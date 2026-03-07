import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSocket } from "./hooks/useSocket.js";
import { usePollTimer } from "./hooks/usePollTimer.js";
import { Brand } from "./components/Brand.js";
import { RoleSelect } from "./components/RoleSelect.js";
import { NameEntry } from "./components/NameEntry.js";
import { CreatePoll } from "./components/CreatePoll.js";
import { LivePoll, type PollState } from "./components/LivePoll.js";
import { WaitForQuestion } from "./components/WaitForQuestion.js";
import { AnswerQuestion } from "./components/AnswerQuestion.js";
import { PollHistory } from "./components/PollHistory.js";
import { KickedOut } from "./components/KickedOut.js";
import { Chat } from "./components/Chat.js";
import { Participants } from "./components/Participants.js";
import { API_BASE } from "./config.js";
import "./App.css";

type Role = "student" | "teacher" | null;
type Screen = "role" | "name" | "create" | "teacher" | "student" | "history" | "kicked";

type ChatMessage = { id: string; text: string; sender: string };

export default function App() {
  const { socket, connected } = useSocket();
  const [role, setRole] = useState<Role>(null);
  const [screen, setScreen] = useState<Screen>("role");
  const [studentName, setStudentName] = useState("");
  const [poll, setPoll] = useState<PollState | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [history, setHistory] = useState<PollState[]>([]);
  const [votedPollId, setVotedPollId] = useState<string | null>(null);
  const [canAskNew, setCanAskNew] = useState(true);
  const [addQuestionRequested, setAddQuestionRequested] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [createPollPending, setCreatePollPending] = useState(false);
  const pendingCreateRef = useRef(false);
  const createPollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const timerSeconds = usePollTimer(remainingSeconds, poll?.status === "live");

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // State recovery: fetch /api/state on load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/api/state`);
        const data = await r.json();
        if (cancelled) return;
        if (data.poll) setPoll(data.poll);
        if (typeof data.remainingSeconds === "number") setRemainingSeconds(data.remainingSeconds);
      } catch {
        if (!cancelled) showToast("Could not load state");
      }
    })();
    return () => { cancelled = true; };
  }, [showToast]);

  // Fetch history when opening history screen
  useEffect(() => {
    if (screen !== "history") return;
    fetch(`${API_BASE}/api/history`)
      .then((r) => r.json())
      .then(setHistory)
      .catch(() => setHistory([]));
  }, [screen]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;
    const onState = (data: { poll: PollState | null; remainingSeconds: number | null }) => {
      setPoll(data.poll ?? null);
      setRemainingSeconds(data.remainingSeconds ?? null);
    };
    const onPollStarted = (data: { poll: PollState; remainingSeconds: number }) => {
      setPoll(data.poll);
      setRemainingSeconds(data.remainingSeconds);
      setVotedPollId(null);
      if (pendingCreateRef.current) {
        pendingCreateRef.current = false;
        if (createPollTimeoutRef.current) {
          clearTimeout(createPollTimeoutRef.current);
          createPollTimeoutRef.current = null;
        }
        setCreatePollPending(false);
        setScreen("teacher");
      }
    };
    const onPollUpdate = (p: PollState) => {
      setPoll(p);
    };
    const onPollEnded = () => {
      setPoll(null);
      setRemainingSeconds(null);
    };
    const onKicked = (data: { studentId?: string }) => {
      const kickedId = (data.studentId ?? "").trim();
      const me = (studentName ?? "").trim();
      if (kickedId && me && kickedId === me) setScreen("kicked");
      if (!data.studentId) setScreen("kicked");
    };
    const onVoteError = (data: { message?: string }) => {
      showToast(data.message ?? "Vote failed");
    };
    const onCanAskNewQuestion = (data: { allowed: boolean; participants: string[] }) => {
      setCanAskNew(data.allowed);
      setParticipants(data.participants ?? []);
      setAddQuestionRequested((req) => {
        if (req && data.allowed) setScreen("create");
        else if (req && !data.allowed) showToast("Wait until everyone has answered or there is no active question.");
        return false;
      });
    };
    const onCreatePollError = (data: { message?: string }) => {
      if (createPollTimeoutRef.current) {
        clearTimeout(createPollTimeoutRef.current);
        createPollTimeoutRef.current = null;
      }
      pendingCreateRef.current = false;
      setCreatePollPending(false);
      showToast(data.message ?? "Failed to create poll");
    };
    const onParticipants = (data: { list: string[] }) => {
      setParticipants(data.list ?? []);
    };
    const onChatMessage = (msg: ChatMessage) => {
      setChatMessages((prev) => [...prev, msg]);
    };

    socket.on("state", onState);
    socket.on("pollStarted", onPollStarted);
    socket.on("pollUpdate", onPollUpdate);
    socket.on("pollEnded", onPollEnded);
    socket.on("kicked", onKicked);
    socket.on("vote:error", onVoteError);
    socket.on("canAskNewQuestion", onCanAskNewQuestion);
    socket.on("participants", onParticipants);
    socket.on("chatMessage", onChatMessage);
    socket.on("createPoll:error", onCreatePollError);

    return () => {
      socket.off("state", onState);
      socket.off("pollStarted", onPollStarted);
      socket.off("pollUpdate", onPollUpdate);
      socket.off("pollEnded", onPollEnded);
      socket.off("kicked", onKicked);
      socket.off("vote:error", onVoteError);
      socket.off("canAskNewQuestion", onCanAskNewQuestion);
      socket.off("participants", onParticipants);
      socket.off("chatMessage", onChatMessage);
      socket.off("createPoll:error", onCreatePollError);
    };
  }, [socket, studentName, showToast]);

  // Request state from server when socket connects (resilience)
  useEffect(() => {
    if (!socket || !connected) return;
    if (role === "teacher") {
      socket.emit("join:teacher");
      socket.emit("canAskNewQuestion");
    } else if (role === "student" && studentName) {
      socket.emit("join:student", studentName);
    }
    socket.emit("requestState");
  }, [socket, connected, role, studentName]);

  useEffect(() => {
    if (socket && connected && role === "teacher") {
      socket.emit("canAskNewQuestion");
    }
  }, [socket, connected, role, poll?.id]);

  const handleRoleContinue = () => {
    if (!role) {
      showToast("Please select Student or Teacher first.");
      return;
    }
    if (role === "teacher") {
      setScreen("create");
      if (socket?.connected) socket.emit("join:teacher");
    } else {
      setScreen("name");
    }
  };

  const handleNameSubmit = (name: string) => {
    setStudentName(name);
    setScreen("student");
    if (socket?.connected) socket.emit("join:student", name);
  };

  const handleCreatePoll = (question: string, options: string[], durationSeconds: number) => {
    if (!socket || !connected) {
      showToast("Not connected to server. Set VITE_API_URL to your backend URL and redeploy.");
      return;
    }
    if (createPollPending) return;
    setCreatePollPending(true);
    pendingCreateRef.current = true;
    socket.emit("createPoll", { question, options, durationSeconds });
    createPollTimeoutRef.current = setTimeout(() => {
      if (pendingCreateRef.current) {
        pendingCreateRef.current = false;
        setCreatePollPending(false);
        showToast("Server didn’t respond. Check VITE_API_URL and Render backend logs.");
      }
    }, 8000);
  };

  const handleTeacherView = () => {
    setScreen("teacher");
  };

  const handleAddQuestionClick = () => {
    if (!socket) return;
    setAddQuestionRequested(true);
    socket.emit("canAskNewQuestion");
  };

  const handleViewHistory = () => setScreen("history");

  const handleVote = (optionIndex: number) => {
    if (!poll || !socket) return;
    socket.emit("vote", { pollId: poll.id, optionIndex });
    setVotedPollId(poll.id);
  };

  const handleChatSend = (text: string) => {
    const sender = role === "teacher" ? "Teacher" : studentName;
    const trimmed = text.trim();
    if (!trimmed) return;
    const optId = `opt-${Date.now()}`;
    setChatMessages((prev) => [...prev, { id: optId, text: trimmed, sender }]);
    if (!socket || !connected) {
      showToast("Not connected. Message saved locally.");
      return;
    }
    socket.emit("chat", { text: trimmed, sender });
  };

  const handleKick = (name: string) => {
    if (socket) socket.emit("kickStudent", name);
    setParticipants((prev) => prev.filter((n) => n.trim() !== name.trim()));
  };

  const openChat = () => {
    setShowParticipants(false);
    setShowChat(true);
  };

  const openParticipants = () => {
    setShowChat(false);
    if (socket) socket.emit("getParticipants");
    setShowParticipants(true);
  };

  if (screen === "kicked") {
    return (
      <div className="app">
        <KickedOut onRejoin={() => { setScreen("role"); setRole(null); setStudentName(""); }} />
      </div>
    );
  }

  if (screen === "role") {
    return (
      <div className="app">
        <RoleSelect role={role} onRoleChange={setRole} onContinue={handleRoleContinue} />
      </div>
    );
  }

  if (screen === "name") {
    return (
      <div className="app">
        <NameEntry onSubmit={handleNameSubmit} />
      </div>
    );
  }

  if (screen === "create") {
    return (
      <div className="app">
        <CreatePoll onSubmit={handleCreatePoll} pending={createPollPending} connected={connected} />
        <button type="button" className="btn secondary" style={{ marginTop: "1rem", maxWidth: 480, marginLeft: "auto", marginRight: "auto", display: "block" }} onClick={handleTeacherView}>
          Back to live poll
        </button>
      </div>
    );
  }

  if (screen === "history") {
    return (
      <div className="app">
        <PollHistory history={history} onBack={handleTeacherView} />
      </div>
    );
  }

  if (screen === "teacher") {
    return (
      <div className="app">
        <Brand />
        {!connected && <p style={{ color: "#6E6E6E", fontSize: "0.875rem" }}>Connecting...</p>}
        <LivePoll
          poll={poll}
          remainingSeconds={timerSeconds}
          onAddQuestion={handleAddQuestionClick}
          onViewHistory={handleViewHistory}
          canAskNewQuestion={canAskNew}
        />
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "1rem", flexWrap: "wrap" }}>
          <button type="button" className="btn secondary" style={{ width: "auto" }} onClick={openChat}>
            Chat
          </button>
          <button type="button" className="btn secondary" style={{ width: "auto" }} onClick={openParticipants}>
            Participants
          </button>
          <button type="button" className="btn secondary" style={{ width: "auto" }} onClick={handleViewHistory}>
            Past polls
          </button>
        </div>
        {showChat && <Chat onClose={() => setShowChat(false)} onSend={handleChatSend} messages={chatMessages} currentUserName={role === "teacher" ? "Teacher" : studentName || undefined} role={role ?? undefined} />}
        {showParticipants && <Participants onClose={() => setShowParticipants(false)} participants={participants} onKick={handleKick} isTeacher />}
        {toast && <div className="toast">{toast}</div>}
      </div>
    );
  }

  // Student
  return (
    <div className="app">
      <Brand />
      {!connected && <p style={{ color: "#6E6E6E", fontSize: "0.875rem" }}>Connecting...</p>}
      {!poll ? (
        <WaitForQuestion />
      ) : (
        <AnswerQuestion
          poll={poll}
          remainingSeconds={timerSeconds}
          onSubmit={handleVote}
          hasVoted={votedPollId === poll.id}
        />
      )}
      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "1rem", flexWrap: "wrap" }}>
        <button type="button" className="btn secondary" style={{ width: "auto" }} onClick={openChat}>Chat</button>
        <button type="button" className="btn secondary" style={{ width: "auto" }} onClick={openParticipants}>Participants</button>
      </div>
      {showChat && <Chat onClose={() => setShowChat(false)} onSend={handleChatSend} messages={chatMessages} currentUserName={role === "teacher" ? "Teacher" : studentName || undefined} role={role ?? undefined} />}
      {showParticipants && <Participants onClose={() => setShowParticipants(false)} participants={participants} />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
