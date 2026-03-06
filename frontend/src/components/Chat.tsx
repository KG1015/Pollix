import React, { useState } from "react";

export function Chat({
  onClose,
  onSend,
  messages,
  currentUserName,
  role,
}: {
  onClose: () => void;
  onSend: (text: string) => void;
  messages: { id: string; text: string; sender: string }[];
  currentUserName?: string;
  role?: "teacher" | "student";
}) {
  const [text, setText] = useState("");

  const isSystemMessage = (sender: string) => sender === "System";

  const nameLine =
    role === "teacher"
      ? <strong style={{ color: "#272727" }}>Teacher</strong>
      : role === "student" && currentUserName
        ? <>Student name: <strong style={{ color: "#272727" }}>{currentUserName}</strong></>
        : null;

  return (
    <div className="popup">
      <h3>Chat</h3>
      <button type="button" className="close" aria-label="Close" onClick={onClose}>×</button>
      {nameLine && (
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.875rem", color: "#6E6E6E" }}>
          {nameLine}
        </p>
      )}
      <div style={{ overflowY: "auto", maxHeight: "60vh", marginBottom: "1rem" }}>
        {messages.length === 0 ? (
          <p style={{ color: "#6E6E6E", fontSize: "0.875rem" }}>No messages yet.</p>
        ) : (
          messages.map((m) =>
            isSystemMessage(m.sender) ? (
              <div key={m.id} style={{ marginBottom: "0.5rem", textAlign: "center" }}>
                <span style={{ fontSize: "0.8rem", color: "#6E6E6E", fontStyle: "italic" }}>{m.text}</span>
              </div>
            ) : (
              <div key={m.id} style={{ marginBottom: "0.5rem" }}>
                <strong style={{ fontSize: "0.8rem", color: "#4F3DCE" }}>{m.sender}:</strong>{" "}
                <span style={{ color: "#272727" }}>{m.text}</span>
              </div>
            )
          )
        )}
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          className="input"
          style={{ marginBottom: 0, flex: 1 }}
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            if (text.trim()) {
              onSend(text.trim());
              setText("");
            }
          }}
        />
        <button type="button" className="btn" style={{ width: "auto" }} onClick={() => text.trim() && (onSend(text.trim()), setText(""))}>
          Send
        </button>
      </div>
    </div>
  );
}
