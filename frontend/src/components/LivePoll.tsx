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
        <button type="button" className="btn btn--gradient btn--gradient-shadow" style={{ marginTop: "1rem", width: "auto" }} onClick={onAddQuestion}>
          + Ask a new question
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
      <div className="question-box question-box--gradient">{poll.question}</div>
      {remainingSeconds != null && remainingSeconds > 0 && (
        <p className="timer" style={{ marginBottom: "1rem" }}>Time left: {String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:{String(remainingSeconds % 60).padStart(2, "0")}</p>
      )}
      <div style={{ marginBottom: "1rem" }}>
        {poll.options.map((opt, i) => {
          const pct = total > 0 ? Math.round((opt.voteCount / total) * 100) : 0;
          return (
            <div key={i} className="option-row" style={{ marginBottom: "0.5rem" }}>
              <div className="option-bar" style={{ width: `${pct}%` }} />
              <span className="option-num">{i + 1}</span>
              <span className="option-text">{opt.text}</span>
              <span style={{ marginLeft: "auto", fontSize: "0.875rem", color: "#6E6E6E", position: "relative", zIndex: 1 }}>{pct}%</span>
            </div>
          );
        })}
      </div>
      <button type="button" className="btn btn--gradient btn--gradient-shadow" style={{ width: "auto" }} onClick={onAddQuestion} disabled={!canAskNewQuestion} title={!canAskNewQuestion ? "Wait until everyone has answered" : undefined}>
        + Ask a new question
      </button>
    </div>
  );
}
