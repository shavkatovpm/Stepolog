"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./modad.css";

export default function ModadLogin() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const data = await res.json();

      if (res.ok) {
        router.push("/modad/dashboard");
      } else {
        setError(data.error || "Login yoki parol noto'g'ri");
        setLoading(false);
      }
    } catch {
      setError("Server xatosi");
      setLoading(false);
    }
  }

  return (
    <div className="modad-login-page">
      <form className="modad-login-card" onSubmit={handleSubmit}>
        <div className="modad-login-logo">STEPOLOG</div>
        <div className="modad-login-badge">/moded</div>
        <p className="modad-login-sub">Admin paneliga kirish</p>

        <div className="modad-form-group">
          <label className="modad-form-label">Login</label>
          <input
            className="modad-form-input"
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Login kiriting"
            autoComplete="username"
          />
        </div>

        <div className="modad-form-group">
          <label className="modad-form-label">Parol</label>
          <input
            className="modad-form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parol kiriting"
            autoComplete="current-password"
          />
        </div>

        {error && <div className="modad-login-error">{error}</div>}

        <button className="modad-login-btn" type="submit" disabled={loading}>
          {loading ? "Kirish..." : "Kirish"}
        </button>
      </form>
    </div>
  );
}
