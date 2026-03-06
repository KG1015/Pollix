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
      <Brand />
      <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem", color: "#272727" }}>
        Welcome to the live polling system
      </h2>
      <p style={{ margin: "0 0 1.5rem", fontSize: "0.875rem", color: "#6E6E6E" }}>
        Choose your role so we can tailor your experience.
      </p>
      <div className="role-cards">
        <button
          type="button"
          className={`role-card ${role === "student" ? "role-card--selected" : ""}`}
          onClick={() => onRoleChange("student")}
        >
          <strong>I'm a Student</strong>
          <p>Answer questions and view poll results.</p>
        </button>
        <button
          type="button"
          className={`role-card ${role === "teacher" ? "role-card--selected" : ""}`}
          onClick={() => onRoleChange("teacher")}
        >
          <strong>I'm a Teacher</strong>
          <p>Create polls and monitor responses in real time.</p>
        </button>
      </div>
      <button type="button" className="btn" style={{ marginTop: "1.5rem" }} onClick={onContinue} disabled={!role}>
        Continue
      </button>
    </div>
  );
}
