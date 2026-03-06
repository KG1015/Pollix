import React, { useState } from "react";

const DURATIONS = [15, 30, 45, 60];

export function CreatePoll({ onSubmit }: { onSubmit: (question: string, options: string[], durationSeconds: number) => void }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [durationSeconds, setDurationSeconds] = useState(30);

  const addOption = () => {
    if (options.length < 6) setOptions([...options, ""]);
  };
  const setOption = (i: number, v: string) => {
    const next = [...options];
    next[i] = v;
    setOptions(next);
  };
  const removeOption = (i: number) => {
    if (options.length > 2) setOptions(options.filter((_, j) => j !== i));
  };

  const valid = question.trim() && options.every((o) => o.trim().length > 0);
  const handleSubmit = () => {
    if (!valid) return;
    onSubmit(question.trim(), options.map((o) => o.trim()).filter(Boolean), durationSeconds);
  };

  return (
    <div className="card">
      <span className="badge-gradient">★ POLLIX</span>
      <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem", color: "#272727" }}>Let's Get Started</h2>
      <p style={{ margin: "0 0 1rem", fontSize: "0.875rem", color: "#6E6E6E" }}>
        You'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
      </p>
      <div className="question-row">
        <label className="label">Enter your question</label>
        <select
          className="input input--light"
          value={durationSeconds}
          onChange={(e) => setDurationSeconds(Number(e.target.value))}
          style={{ width: "auto", minWidth: "130px" }}
        >
          {DURATIONS.map((d) => (
            <option key={d} value={d}>{d} seconds</option>
          ))}
        </select>
      </div>
      <div style={{ position: "relative" }}>
        <textarea
          className="input input--light"
          rows={3}
          placeholder="Enter your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={100}
          style={{ resize: "vertical", marginBottom: 0, borderRadius: 10 }}
        />
        <div className="char-count">{question.length}/100</div>
      </div>
      <div className="edit-options-header">
        <label className="label">Edit Options</label>
        <span className="is-correct-label">Is it Correct?</span>
      </div>
      {options.map((opt, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <span className="option-num-circle selected">{i + 1}</span>
          <input
            className="input input--light"
            style={{ marginBottom: 0, flex: 1, borderRadius: 10 }}
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => setOption(i, e.target.value)}
          />
          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#6E6E6E" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.25rem", cursor: "pointer" }}>
              <input type="radio" name={`correct-${i}`} readOnly style={{ accentColor: "#4F3DCE" }} />
              Yes
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.25rem", cursor: "pointer" }}>
              <input type="radio" name={`correct-${i}`} defaultChecked readOnly style={{ accentColor: "#4F3DCE" }} />
              No
            </label>
          </span>
          {options.length > 2 && (
            <button type="button" className="btn secondary" style={{ width: "auto", padding: "0.4rem 0.6rem" }} onClick={() => removeOption(i)}>
              Remove
            </button>
          )}
        </div>
      ))}
      {options.length < 6 && (
        <button type="button" className="add-more-option" onClick={addOption}>
          + Add More option
        </button>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.25rem" }}>
        <button type="button" className="btn btn--gradient btn--gradient-shadow" onClick={handleSubmit} disabled={!valid} style={{ width: "auto" }}>
          Ask Question
        </button>
      </div>
    </div>
  );
}
