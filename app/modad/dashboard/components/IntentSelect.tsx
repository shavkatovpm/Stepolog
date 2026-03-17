"use client";

import { useState } from "react";

const INTENT_COLORS = [
  "#5B9CF6", "#43D08A", "#FF8A4C", "#FFDE59", "#C084FC",
  "#F472B6", "#FF5F5F", "#888888",
];

export default function IntentSelect({
  value,
  onChange,
  customIntents,
  onAdd,
  onRemove,
}: {
  value: string;
  onChange: (v: string) => void;
  customIntents: { name: string; color: string }[];
  onAdd: (name: string, color: string) => void;
  onRemove: (name: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [newIntent, setNewIntent] = useState("");
  const [newColor, setNewColor] = useState(INTENT_COLORS[0]);

  const allIntents = customIntents.map((ci) => ({ value: ci.name, label: ci.name, color: ci.color }));

  function handleAdd() {
    const trimmed = newIntent.trim();
    if (!trimmed) return;
    if (allIntents.some((i) => i.value.toLowerCase() === trimmed.toLowerCase())) return;
    onAdd(trimmed, newColor);
    onChange(trimmed);
    setNewIntent("");
    setNewColor(INTENT_COLORS[0]);
    setAdding(false);
  }

  const isCustom = customIntents.some((ci) => ci.name === value);
  const isEmpty = allIntents.length === 0;
  const selectedIntent = allIntents.find((i) => i.value === value);

  return (
    <div className="m-intent-select">
      {isEmpty && !adding ? (
        <button type="button" className="m-intent-empty-btn" onClick={() => setAdding(true)}>
          + Kontent turini qo&apos;shing
        </button>
      ) : (
        <>
          {!isEmpty && (
            <div className="m-intent-select-row">
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
                {selectedIntent && (
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: selectedIntent.color, flexShrink: 0 }} />
                )}
                <select className="m-form-select m-intent-select-el" value={value} onChange={(e) => onChange(e.target.value)}>
                  {allIntents.map((i) => (
                    <option key={i.value} value={i.value}>{i.label}</option>
                  ))}
                </select>
              </div>
              {isCustom && (
                <button
                  type="button"
                  className="m-intent-del"
                  title="Turni o'chirish"
                  onClick={() => { onRemove(value); const rest = allIntents.filter((x) => x.value !== value); onChange(rest[0]?.value || ""); }}
                >
                  ✕
                </button>
              )}
              <button
                type="button"
                className="m-intent-add-btn"
                onClick={() => setAdding(!adding)}
                title="Yangi tur qo'shish"
              >
                {adding ? "−" : "+"}
              </button>
            </div>
          )}
          {adding && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="m-intent-add-row">
                <input
                  className="m-form-input"
                  value={newIntent}
                  onChange={(e) => setNewIntent(e.target.value)}
                  placeholder="Tur nomini kiriting..."
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  autoFocus
                />
                <button type="button" className="m-btn-save" style={{ padding: "7px 14px", fontSize: 12 }} onClick={handleAdd}>
                  Qo&apos;sh
                </button>
                {isEmpty && (
                  <button type="button" className="m-btn-cancel" style={{ padding: "7px 14px", fontSize: 12 }} onClick={() => setAdding(false)}>
                    Bekor
                  </button>
                )}
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "var(--m-text3)", marginRight: 4 }}>Rang:</span>
                {INTENT_COLORS.map((c) => (
                  <div
                    key={c}
                    onClick={() => setNewColor(c)}
                    style={{
                      width: 22, height: 22, borderRadius: "50%", background: c, cursor: "pointer",
                      border: newColor === c ? "2px solid white" : "2px solid transparent",
                      transform: newColor === c ? "scale(1.15)" : "scale(1)",
                      transition: "all .15s",
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
