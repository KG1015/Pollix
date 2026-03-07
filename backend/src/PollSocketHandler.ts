import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import * as PollService from "./services/PollService.js";

const participantIds = new Set<string>();
const kickedIds = new Set<string>();
const teacherSockets = new Set<string>();
const studentIdToSocketId = new Map<string, string>();

export function attachPollSocket(httpServer: HttpServer, corsOrigin: string) {
  const io = new Server(httpServer, {
    cors: { origin: corsOrigin, methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    socket.on("join:teacher", () => {
      teacherSockets.add(socket.id);
      const state = PollService.getActivePollState();
      const remaining = PollService.getRemainingSecondsForActive();
      socket.emit("state", { poll: state, remainingSeconds: remaining });
    });

    socket.on("join:student", (studentId: string) => {
      if (typeof studentId !== "string" || !studentId.trim()) return;
      const id = studentId.trim();
      if (kickedIds.has(id)) {
        socket.emit("kicked", { studentId: id });
        return;
      }
      participantIds.add(id);
      studentIdToSocketId.set(id, socket.id);
      (socket as unknown as { studentId?: string }).studentId = id;
      const state = PollService.getActivePollState();
      const remaining = PollService.getRemainingSecondsForActive();
      socket.emit("state", { poll: state, remainingSeconds: remaining });
    });

    socket.on("disconnect", () => {
      teacherSockets.delete(socket.id);
      const sid = (socket as unknown as { studentId?: string }).studentId;
      if (sid) {
        participantIds.delete(sid);
        studentIdToSocketId.delete(sid);
      }
    });

    socket.on("createPoll", async (body: { question: string; options: string[]; durationSeconds: number }) => {
      try {
        if (!teacherSockets.has(socket.id)) {
          socket.emit("createPoll:error", { message: "Only teachers can create polls. Rejoin as teacher." });
          return;
        }
        const { question, options, durationSeconds } = body ?? {};
        if (!question || !Array.isArray(options) || options.length < 2) {
          socket.emit("createPoll:error", { message: "Invalid question or options" });
          return;
        }
        const timeoutMs = 10000;
        const rejectAfter = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Database timeout. Backend may be cold-starting.")), timeoutMs)
        );
        const poll = await Promise.race([
          PollService.createPoll(question, options, durationSeconds ?? 30),
          rejectAfter,
        ]);
        if (!poll) {
          socket.emit("createPoll:error", { message: "Failed to create poll" });
          return;
        }
        const resolveNullAfter = new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs));
        const started = await Promise.race([PollService.startPoll(poll.id), resolveNullAfter]);
        if (started) {
          io.emit("pollStarted", { poll: started, remainingSeconds: started.durationSeconds });
        } else {
          socket.emit("createPoll:error", { message: "Failed to start poll" });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create poll";
        console.error("createPoll error:", err);
        socket.emit("createPoll:error", { message });
      }
    });

    socket.on("vote", async (body: { pollId: string; optionIndex: number }) => {
      const sid = (socket as unknown as { studentId?: string }).studentId;
      if (!sid) {
        socket.emit("vote:error", { message: "Not joined as student" });
        return;
      }
      const { pollId, optionIndex } = body ?? {};
      const result = await PollService.submitVote(pollId, sid, optionIndex);
      if (!result.ok) {
        socket.emit("vote:error", { message: result.error ?? "Vote failed" });
        return;
      }
      const state = PollService.getActivePollState();
      if (state) io.emit("pollUpdate", state);
    });

    socket.on("kickStudent", (studentId: string) => {
      if (!teacherSockets.has(socket.id)) return;
      const id = String(studentId ?? "").trim();
      if (!id) return;
      kickedIds.add(id);
      participantIds.delete(id);
      const targetSocketId = studentIdToSocketId.get(id);
      if (targetSocketId) {
        io.to(targetSocketId).emit("kicked", { studentId: id });
        studentIdToSocketId.delete(id);
      }
      teacherSockets.forEach((tid) => io.to(tid).emit("participantKicked", { studentId: id }));
      io.emit("chatMessage", {
        id: `system-kick-${Date.now()}`,
        text: `Teacher has kicked out ${id}.`,
        sender: "System",
      });
    });

    socket.on("requestState", () => {
      const state = PollService.getActivePollState();
      const remaining = PollService.getRemainingSecondsForActive();
      socket.emit("state", { poll: state, remainingSeconds: remaining });
    });

    socket.on("canAskNewQuestion", async () => {
      const state = PollService.getActivePollState();
      const participants = getParticipantIds();
      const allowed = !state || (state.id && (await PollService.hasEveryoneAnswered(state.id, participants)));
      socket.emit("canAskNewQuestion", { allowed, participants });
    });

    socket.on("getParticipants", () => {
      socket.emit("participants", { list: getParticipantIds() });
    });

    socket.on("chat", (body: { text: string; sender: string }) => {
      const { text, sender } = body ?? {};
      if (typeof text !== "string" || !text.trim() || typeof sender !== "string" || !sender.trim()) return;
      const msg = { id: String(Date.now()), text: text.trim(), sender: sender.trim() };
      socket.broadcast.emit("chatMessage", msg);
    });
  });

  PollService.setOnPollEnd(() => {
    io.emit("pollEnded", {});
  });

  return io;
}

export function getParticipantIds(): string[] {
  return Array.from(participantIds);
}
