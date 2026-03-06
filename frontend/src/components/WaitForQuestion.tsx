import React from "react";
import { Brand } from "./Brand.js";

export function WaitForQuestion() {
  return (
    <div className="card">
      <Brand />
      <div className="spinner" />
      <p className="waitMessage" style={{ fontSize: "1rem" }}>
        Wait for the teacher to ask questions...
      </p>
    </div>
  );
}
