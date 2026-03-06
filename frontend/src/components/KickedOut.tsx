import React from "react";
import { Brand } from "./Brand.js";

export function KickedOut({ onRejoin }: { onRejoin: () => void }) {
  return (
    <div className="card">
      <Brand />
      <h2 style={{ margin: "1rem 0 0.5rem", fontSize: "1.5rem", color: "#272727" }}>You have been kicked out by the teacher</h2>
      <p style={{ margin: "0 0 1.5rem", fontSize: "0.875rem", color: "#6E6E6E" }}>
        You have been removed from this session. You can try again later.
      </p>
      <button type="button" className="btn" onClick={onRejoin}>
        Rejoin
      </button>
    </div>
  );
}
