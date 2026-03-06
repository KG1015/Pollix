import React, { useState } from "react";
import { Brand } from "./Brand.js";

export function NameEntry({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState("");

  return (
    <div className="card">
      <Brand />
      <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem", color: "#272727" }}>Let's get started</h2>
      <p style={{ margin: "0 0 1rem", fontSize: "0.875rem", color: "#6E6E6E" }}>
        Enter your name to join and take part in live polls.
      </p>
      <label className="label">Enter your name</label>
      <input
        className="input"
        type="text"
        placeholder="e.g. Rahul Bajaj"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="button" className="btn" onClick={() => name.trim() && onSubmit(name.trim())} disabled={!name.trim()}>
        Continue
      </button>
    </div>
  );
}
