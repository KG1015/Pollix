import React, { useState } from "react";
import type { PollState } from "./LivePoll.js";

export function AnswerQuestion({
  poll,
  remainingSeconds,
  onSubmit,
  hasVoted,
}: {
  poll: PollState;
  remainingSeconds: number;
  onSubmit: (optionIndex: number) => void;
  hasVoted: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const total = poll.options.reduce((s, o) => s + o.voteCount, 0);
  const showResults = hasVoted || remainingSeconds <= 0;

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <h2 style={{ margin: 0, fontSize: "1rem", color: "#272727" }}>Question 1</h2>
        <span className="timer timer--danger" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <span style={{ fontSize: "1rem" }} aria-hidden>🕐</span>
          {String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:{String(remainingSeconds % 60).padStart(2, "0")}
        </span>
      </div>
      <div className="question-box question-box--gradient">{poll.question}</div>
      <div className="option-card">
        {poll.options.map((opt, i) => {
          const pct = total > 0 ? Math.round((opt.voteCount / total) * 100) : 0;
          return (
            <div key={i}>
              {!showResults ? (
                <label className={`option-choice-row ${selected === i ? "selected" : ""}`} onClick={() => setSelected(i)}>
                  <span className={`option-num-circle ${selected === i ? "selected" : ""}`}>{i + 1}</span>
                  <span style={{ color: "#272727", flex: 1 }}>{opt.text}</span>
                  <input type="radio" name="option" checked={selected === i} onChange={() => setSelected(i)} style={{ accentColor: "#4F3DCE" }} />
                </label>
              ) : (
                <div className="option-row" style={{ marginBottom: "0.5rem" }}>
                  <div className="option-bar" style={{ width: `${pct}%` }} />
                  <span className="option-num">{i + 1}</span>
                  <span className="option-text">{opt.text}</span>
                  <span style={{ marginLeft: "auto", fontSize: "0.875rem", color: "#6E6E6E", position: "relative", zIndex: 1 }}>{pct}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!showResults && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
          <button
            type="button"
            className="btn btn--gradient btn--gradient-shadow"
            style={{ width: "auto", borderRadius: 12 }}
            onClick={() => selected !== null && onSubmit(selected)}
            disabled={selected === null}
          >
            Submit
          </button>
        </div>
      )}
      {showResults && remainingSeconds <= 0 && (
        <p className="waitMessage" style={{ marginTop: "1rem" }}>Wait for the teacher to ask a new question.</p>
      )}
    </div>
  );
}
