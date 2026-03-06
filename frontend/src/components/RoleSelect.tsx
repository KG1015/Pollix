import React from "react";
import { Brand } from "./Brand.js";

type Role = "student" | "teacher" | null;

export function RoleSelect({
  role,
  onRoleChange,
  onContinue,
}: {
  role: Role;
  onRoleChange: (r: Role) => void;
  onContinue: () => void;
}) {
  return (
    <div className="card">
      <span className="pill-badge" style={{ marginBottom: "0.75rem" }}>Live Poll</span>
      <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem", color: "#272727" }}>
        Welcome to the Live Polling System
      </h2>
      <p style={{ margin: "0 0 1.5rem", fontSize: "0.875rem", color: "#6E6E6E" }}>
        Please select the role that best describes you to begin using the live polling system.
      </p>
      <div className="role-cards role-cards--horizontal">
        <button
          type="button"
          className={`role-card ${role === "student" ? "role-card--selected" : ""}`}
          onClick={() => onRoleChange("student")}
        >
          <strong>I'm a Student</strong>
          <p>Submit answers and view live poll results in real-time.</p>
        </button>
        <button
          type="button"
          className={`role-card ${role === "teacher" ? "role-card--selected" : ""}`}
          onClick={() => onRoleChange("teacher")}
        >
          <strong>I'm a Teacher</strong>
          <p>Create polls and monitor your students' responses in real time.</p>
        </button>
      </div>
      <button
        type="button"
        className="btn btn--gradient"
        style={{ marginTop: "1.5rem", position: "relative", zIndex: 1 }}
        onClick={() => onContinue()}
      >
        Continue
      </button>
    </div>
  );
}
