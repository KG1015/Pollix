import React from "react";
import { Brand } from "./Brand.js";

export function KickedOut({ onRejoin }: { onRejoin: () => void }) {
  return (
    <div className="card" style={{ textAlign: "center" }}>
      <span className="pill-badge">POLLIX</span>
      <h2 style={{ margin: "0.5rem 0 0.5rem", fontSize: "1.5rem", color: "#272727" }}>You've been Kicked out!</h2>
      <p style={{ margin: "0 0 1.5rem", fontSize: "0.875rem", color: "#6E6E6E" }}>
        Looks like the teacher had removed you from the poll system. Please Try again sometime.
      </p>
      <button type="button" className="btn" onClick={onRejoin}>
        Rejoin
      </button>
    </div>
  );
}
