import React, { useState } from "react";

export function NameEntry({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState("");

  return (
    <div className="card" style={{ textAlign: "center" }}>
      <span className="badge-gradient">⚡ POLLIX</span>
      <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.35rem", color: "#272727" }}>Let's Get Started</h2>
      <p style={{ margin: "0 0 1.25rem", fontSize: "0.875rem", color: "#6E6E6E", maxWidth: "380px", marginLeft: "auto", marginRight: "auto" }}>
        If you're a student, you'll be able to <strong>submit your answers</strong>, participate in live polls, and see how your responses compare with your classmates.
      </p>
      <div style={{ textAlign: "left", maxWidth: "320px", margin: "0 auto 1.25rem" }}>
        <label className="label">Enter your Name</label>
        <input
          className="input input--light"
          type="text"
          placeholder="Rahul Bajaj"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ borderRadius: 10 }}
        />
      </div>
      <button type="button" className="btn btn--gradient" style={{ borderRadius: 14, padding: "0.85rem 2rem" }} onClick={() => name.trim() && onSubmit(name.trim())} disabled={!name.trim()}>
        Continue
      </button>
    </div>
  );
}
