"use client";

import { useState } from "react";

const DEFAULT_INTENTS: { value: string; label: string }[] = [];

export default function IntentSelect({
  value,
  onChange,
  customIntents,
  onAdd,
  onRemove,
}: {
  value: string;
  onChange: (v: string) => void;
  customIntents: string[];
  onAdd: (name: string) => void;
  onRemove: (name: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [newIntent, setNewIntent] = useState("");

  const allIntents = [
    ...DEFAULT_INTENTS,
    ...customIntents.map((ci) => ({ value: ci, label: ci })),
  ];

  function handleAdd() {
    const trimmed = newIntent.trim();
    if (!trimmed) return;
    if (allIntents.some((i) => i.value.toLowerCase() === trimmed.toLowerCase())) return;
    onAdd(trimmed);
    onChange(trimmed);
    setNewIntent("");
    setAdding(false);
  }

  const isCustom = customIntents.includes(value);
  const isEmpty = allIntents.length === 0;

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
              <select className="m-form-select m-intent-select-el" value={value} onChange={(e) => onChange(e.target.value)}>
                {allIntents.map((i) => (
                  <option key={i.value} value={i.value}>{i.label}</option>
                ))}
              </select>
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
          )}
        </>
      )}
    </div>
  );
}
