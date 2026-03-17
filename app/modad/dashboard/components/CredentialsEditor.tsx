"use client";

import { useState } from "react";

export default function CredentialsEditor({
  currentLogin,
  currentPassword,
  onSave,
}: {
  currentLogin: string;
  currentPassword: string;
  onSave: (login: string, password: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [newLogin, setNewLogin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function startEdit() {
    setNewLogin(currentLogin);
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setEditing(true);
  }

  function handleSave() {
    if (!newLogin.trim()) { setError("Login bo'sh bo'lmasin"); return; }
    if (!newPassword) { setError("Yangi parolni kiriting"); return; }
    if (newPassword.length < 6) { setError("Parol kamida 6 ta belgi bo'lsin"); return; }
    if (newPassword !== confirmPassword) { setError("Parollar mos kelmadi"); return; }
    onSave(newLogin.trim(), newPassword);
    setEditing(false);
  }

  if (!editing) {
    return (
      <div>
        <div style={{ display: "flex", gap: 24, marginBottom: 14 }}>
          <div>
            <span style={{ fontSize: 10, color: "var(--m-text3)", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 3 }}>Login</span>
            <span style={{ fontSize: 13, color: "var(--m-text2)", fontFamily: "'Space Mono', monospace" }}>{currentLogin}</span>
          </div>
          <div>
            <span style={{ fontSize: 10, color: "var(--m-text3)", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 3 }}>Parol</span>
            <span style={{ fontSize: 13, color: "var(--m-text3)", fontFamily: "'Space Mono', monospace" }}>{"•".repeat(currentPassword.length)}</span>
          </div>
        </div>
        <button className="m-btn-action m-btn-ghost" onClick={startEdit}>O&apos;zgartirish</button>
      </div>
    );
  }

  return (
    <div>
      <div className="m-form-grid" style={{ marginBottom: 12 }}>
        <div className="m-form-group">
          <label className="m-form-label">Yangi login</label>
          <input className="m-form-input" value={newLogin} onChange={(e) => setNewLogin(e.target.value)} />
        </div>
        <div className="m-form-group" />
        <div className="m-form-group">
          <label className="m-form-label">Yangi parol</label>
          <input className="m-form-input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Kamida 6 belgi" />
        </div>
        <div className="m-form-group">
          <label className="m-form-label">Parolni tasdiqlang</label>
          <input className="m-form-input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Parolni qayta kiriting" />
        </div>
      </div>
      {error && <div style={{ fontSize: 12, color: "var(--m-red)", marginBottom: 10 }}>{error}</div>}
      <div style={{ display: "flex", gap: 8 }}>
        <button className="m-btn-action m-btn-ghost" onClick={() => setEditing(false)}>Bekor</button>
        <button className="m-btn-save" style={{ fontSize: 12, padding: "8px 16px" }} onClick={handleSave}>Saqlash</button>
      </div>
    </div>
  );
}
