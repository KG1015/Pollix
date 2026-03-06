import React from "react";

export function Participants({
  onClose,
  participants,
  onKick,
  isTeacher,
}: {
  onClose: () => void;
  participants: string[];
  onKick?: (name: string) => void;
  isTeacher?: boolean;
}) {
  return (
    <div className="popup">
      <h3>Participants</h3>
      <button type="button" className="close" aria-label="Close" onClick={onClose}>×</button>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {participants.length === 0 ? (
          <li style={{ color: "#6E6E6E", fontSize: "0.875rem" }}>No participants yet.</li>
        ) : (
          participants.map((name) => (
            <li key={name} style={{ padding: "0.5rem 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#272727" }}>{name}</span>
              {isTeacher && onKick && (
                <button
                  type="button"
                  className="btn secondary"
                  style={{ width: "auto", padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                  onClick={() => onKick(name)}
                >
                  Remove
                </button>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
