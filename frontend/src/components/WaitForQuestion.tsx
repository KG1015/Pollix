import React from "react";
import { Brand } from "./Brand.js";

export function WaitForQuestion() {
  return (
    <div className="card">
      <Brand />
      <p style={{ margin: "0 0 1rem", fontSize: "0.875rem", color: "#4F3DCE", fontWeight: 600 }}>+ Initiate Poll</p>
      <div className="spinner" />
      <p className="waitMessage" style={{ fontSize: "1rem" }}>
        Wait for the teacher to ask questions..
      </p>
    </div>
  );
}
