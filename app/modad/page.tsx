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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const saved = localStorage.getItem("stepolog_moded");
      const settings = saved ? JSON.parse(saved).settings : null;
      const adminLogin = settings?.adminLogin || "stepologad";
      const adminPassword = settings?.adminPassword || "stepologad321";
      if (login === adminLogin && password === adminPassword) {
        sessionStorage.setItem("modad_auth", "true");
        router.push("/modad/dashboard");
      } else {
        setError("Login yoki parol noto'g'ri");
        setLoading(false);
      }
    }, 400);
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
