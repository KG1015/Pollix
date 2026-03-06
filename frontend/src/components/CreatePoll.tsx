import React, { useState } from "react";
import { Brand } from "./Brand.js";

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
      <Brand />
      <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem", color: "#272727" }}>Let's get started</h2>
      <p style={{ margin: "0 0 1rem", fontSize: "0.875rem", color: "#6E6E6E" }}>
        Create a question, set a time limit, and add options.
      </p>
      <label className="label">Question</label>
      <input
        className="input"
        type="text"
        placeholder="Enter your question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <label className="label">Time limit (seconds)</label>
      <select
        className="input"
        value={durationSeconds}
        onChange={(e) => setDurationSeconds(Number(e.target.value))}
      >
        {DURATIONS.map((d) => (
          <option key={d} value={d}>{d} seconds</option>
        ))}
      </select>
      <label className="label">Poll options</label>
      {options.map((opt, i) => (
        <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <input
            className="input"
            style={{ marginBottom: 0 }}
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => setOption(i, e.target.value)}
          />
          {options.length > 2 && (
            <button type="button" className="btn secondary" style={{ width: "auto" }} onClick={() => removeOption(i)}>
              Remove
            </button>
          )}
        </div>
      ))}
      {options.length < 6 && (
        <button type="button" className="btn secondary" style={{ marginBottom: "1rem" }} onClick={addOption}>
          Add option
        </button>
      )}
      <button type="button" className="btn" onClick={handleSubmit} disabled={!valid}>
        Add question
      </button>
    </div>
  );
}
