import React from "react";
import type { PollState } from "./LivePoll.js";

export function PollHistory({
  history,
  onBack,
}: {
  history: PollState[];
  onBack: () => void;
}) {
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#272727" }}>View poll history</h2>
        <button type="button" className="btn secondary" style={{ width: "auto" }} onClick={onBack}>
          Back
        </button>
      </div>
      {history.length === 0 ? (
        <p style={{ color: "#6E6E6E" }}>No past polls yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {history.map((poll, idx) => {
            const total = poll.options.reduce((s, o) => s + o.voteCount, 0);
            return (
              <div key={poll.id} style={{ padding: "1rem", border: "1px solid #E8E8E8", borderRadius: 8 }}>
                <h3 style={{ margin: "0 0 0.5rem", fontSize: "1rem", color: "#272727" }}>Question {idx + 1}</h3>
                <p style={{ margin: "0 0 0.75rem", color: "#272727" }}>{poll.question}</p>
                {poll.options.map((opt, i) => {
                  const pct = total > 0 ? Math.round((opt.voteCount / total) * 100) : 0;
                  return (
                    <div key={i} style={{ marginBottom: "0.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                        <span style={{ color: "#272727" }}>{opt.text}</span>
                        <span style={{ color: "#6E6E6E" }}>{pct}%</span>
                      </div>
                      <div className="progressBar">
                        <div style={{ width: `${pct}%`, height: "100%", background: "#4F3DCE", borderRadius: 4 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
