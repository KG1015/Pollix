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
        <h2 style={{ margin: 0, fontSize: "1rem", color: "#272727" }}>Question</h2>
        <span className="timer">
          {String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:{String(remainingSeconds % 60).padStart(2, "0")}
        </span>
      </div>
      <p style={{ margin: "0 0 1rem", color: "#272727" }}>{poll.question}</p>
      <div className="radioGroup">
        {poll.options.map((opt, i) => {
          const pct = total > 0 ? Math.round((opt.voteCount / total) * 100) : 0;
          return (
            <div key={i}>
              <label className={`radioRow ${selected === i ? "selected" : ""}`} style={{ opacity: showResults ? 1 : 1 }}>
                <input
                  type="radio"
                  name="option"
                  checked={selected === i}
                  onChange={() => setSelected(i)}
                  disabled={showResults}
                />
                <span style={{ color: "#272727" }}>{opt.text}</span>
                {showResults && (
                  <span style={{ marginLeft: "auto", color: "#6E6E6E", fontSize: "0.875rem" }}>{pct}%</span>
                )}
              </label>
              {showResults && (
                <div className="progressBar" style={{ marginLeft: "2rem" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "#4F3DCE", borderRadius: 4 }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!showResults && (
        <button
          type="button"
          className="btn"
          style={{ marginTop: "1rem" }}
          onClick={() => selected !== null && onSubmit(selected)}
          disabled={selected === null}
        >
          Submit
        </button>
      )}
      {showResults && remainingSeconds <= 0 && (
        <p className="waitMessage" style={{ marginTop: "1rem" }}>Wait for the teacher to ask a new question.</p>
      )}
    </div>
  );
}
