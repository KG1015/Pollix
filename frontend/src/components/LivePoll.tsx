import React from "react";

export type PollOption = { text: string; voteCount: number };
export type PollState = {
  id: string;
  question: string;
  options: PollOption[];
  durationSeconds: number;
  startedAt: number | null;
  status: string;
};

export function LivePoll({
  poll,
  remainingSeconds,
  onAddQuestion,
  onViewHistory,
  canAskNewQuestion = true,
}: {
  poll: PollState | null;
  remainingSeconds: number | null;
  onAddQuestion: () => void;
  onViewHistory: () => void;
  canAskNewQuestion?: boolean;
}) {
  if (!poll) {
    return (
      <div className="card">
        <p style={{ color: "#6E6E6E", margin: 0 }}>No active poll. Create one to get started.</p>
        <button type="button" className="btn" style={{ marginTop: "1rem" }} onClick={onAddQuestion}>
          Add a new question
        </button>
      </div>
    );
  }

  const total = poll.options.reduce((s, o) => s + o.voteCount, 0);
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.1rem", color: "#272727" }}>Question</h2>
        <button type="button" className="btn secondary" style={{ width: "auto", padding: "0.5rem 1rem" }} onClick={onViewHistory}>
          View poll history
        </button>
      </div>
      <p style={{ margin: "0 0 1rem", color: "#272727" }}>{poll.question}</p>
      {remainingSeconds != null && remainingSeconds > 0 && (
        <p className="timer" style={{ marginBottom: "1rem" }}>Time left: {String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:{String(remainingSeconds % 60).padStart(2, "0")}</p>
      )}
      <div className="radioGroup">
        {poll.options.map((opt, i) => {
          const pct = total > 0 ? Math.round((opt.voteCount / total) * 100) : 0;
          return (
            <div key={i} style={{ marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#272727" }}>{opt.text}</span>
                <span style={{ color: "#6E6E6E", fontSize: "0.875rem" }}>{pct}%</span>
              </div>
              <div className="progressBar">
                <div style={{ width: `${pct}%`, height: "100%", background: "#4F3DCE", borderRadius: 4 }} />
              </div>
            </div>
          );
        })}
      </div>
      <button type="button" className="btn" onClick={onAddQuestion} disabled={!canAskNewQuestion} title={!canAskNewQuestion ? "Wait until everyone has answered" : undefined}>
        + Add a new question
      </button>
    </div>
  );
}
