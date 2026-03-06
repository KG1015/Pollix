import { Poll } from "../models/poll.js";
import { Vote } from "../models/vote.js";
import mongoose from "mongoose";

export type PollOption = { text: string; voteCount: number };
export type PollState = {
  id: string;
  question: string;
  options: PollOption[];
  durationSeconds: number;
  startedAt: number | null;
  status: "draft" | "live" | "ended";
};

const activePollCache: { poll: PollState | null; endTimeout: NodeJS.Timeout | null } = {
  poll: null,
  endTimeout: null,
};

function clearEndTimeout() {
  if (activePollCache.endTimeout) {
    clearTimeout(activePollCache.endTimeout);
    activePollCache.endTimeout = null;
  }
}

function getRemainingSeconds(startedAt: number, durationSeconds: number): number {
  const elapsed = Math.floor((Date.now() - startedAt) / 1000);
  return Math.max(0, durationSeconds - elapsed);
}

export async function createPoll(question: string, options: string[], durationSeconds: number): Promise<PollState | null> {
  const doc = await Poll.create({
    question,
    options: options.map((text) => ({ text, voteCount: 0 })),
    durationSeconds: Math.min(60, Math.max(5, durationSeconds)),
    status: "draft",
  });
  const state = docToState(doc);
  return state;
}

export async function startPoll(pollId: string): Promise<PollState | null> {
  const doc = await Poll.findById(pollId);
  if (!doc || doc.status !== "draft") return null;
  doc.startedAt = new Date();
  doc.status = "live";
  await doc.save();
  clearEndTimeout();
  const state = docToState(doc);
  activePollCache.poll = state;
  const durationMs = state.durationSeconds * 1000;
  const startedAt = doc.startedAt!.getTime();
  activePollCache.endTimeout = setTimeout(async () => {
    await endPoll(pollId);
  }, durationMs);
  return state;
}

let onPollEnd: (() => void) | null = null;
export function setOnPollEnd(cb: () => void) {
  onPollEnd = cb;
}

export async function endPoll(pollId: string): Promise<void> {
  clearEndTimeout();
  await Poll.findByIdAndUpdate(pollId, { status: "ended" });
  activePollCache.poll = null;
  onPollEnd?.();
}

function docToState(doc: mongoose.Document): PollState {
  const d = doc as unknown as { _id: mongoose.Types.ObjectId; question: string; options: PollOption[]; durationSeconds: number; startedAt: Date | null; status: string };
  return {
    id: d._id.toString(),
    question: d.question,
    options: d.options.map((o) => ({ text: o.text, voteCount: o.voteCount ?? 0 })),
    durationSeconds: d.durationSeconds,
    startedAt: d.startedAt ? d.startedAt.getTime() : null,
    status: d.status as "draft" | "live" | "ended",
  };
}

export function getActivePollState(): PollState | null {
  return activePollCache.poll;
}

export function getRemainingSecondsForActive(): number | null {
  const p = activePollCache.poll;
  if (!p || !p.startedAt || p.status !== "live") return null;
  return getRemainingSeconds(p.startedAt, p.durationSeconds);
}

export async function getPollById(pollId: string): Promise<PollState | null> {
  const doc = await Poll.findById(pollId);
  if (!doc) return null;
  return docToState(doc);
}

export async function submitVote(pollId: string, studentId: string, optionIndex: number): Promise<{ ok: boolean; error?: string }> {
  const poll = await Poll.findById(pollId);
  if (!poll) return { ok: false, error: "Poll not found" };
  if (poll.status !== "live") return { ok: false, error: "Poll not active" };
  if (optionIndex < 0 || optionIndex >= poll.options.length) return { ok: false, error: "Invalid option" };

  const existing = await Vote.findOne({ pollId, studentId });
  if (existing) return { ok: false, error: "Already voted" };

  const startedAt = poll.startedAt?.getTime();
  if (startedAt) {
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    if (elapsed >= poll.durationSeconds) return { ok: false, error: "Time's up" };
  }

  await Vote.create({ pollId, studentId, optionIndex });
  poll.options[optionIndex].voteCount += 1;
  await poll.save();

  const state = docToState(poll);
  activePollCache.poll = state;
  return { ok: true };
}

export async function getPollHistory(limit: number = 50): Promise<PollState[]> {
  const docs = await Poll.find({ status: "ended" }).sort({ createdAt: -1 }).limit(limit).lean();
  return docs.map((d: Record<string, unknown>) => ({
    id: (d._id as mongoose.Types.ObjectId).toString(),
    question: d.question as string,
    options: (d.options as PollOption[])?.map((o: { text: string; voteCount?: number }) => ({ text: o.text, voteCount: o.voteCount ?? 0 })) ?? [],
    durationSeconds: d.durationSeconds as number,
    startedAt: (d.startedAt as Date) ? (d.startedAt as Date).getTime() : null,
    status: d.status as "draft" | "live" | "ended",
  }));
}

export async function hasEveryoneAnswered(pollId: string, participantIds: string[]): Promise<boolean> {
  if (participantIds.length === 0) return true;
  const voted = await Vote.countDocuments({ pollId });
  return voted >= participantIds.length;
}
