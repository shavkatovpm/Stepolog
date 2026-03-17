"use client";

import { useState, useRef } from "react";
import { MONTH_NAMES, WEEKDAYS } from "../constants";

export default function DatePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const today = new Date();
  const selected = value ? new Date(value + "T00:00:00") : null;
  const [viewYear, setViewYear] = useState(selected?.getFullYear() || today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function pick(day: number) {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${viewYear}-${m}-${d}`);
    setOpen(false);
  }

  function prev() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  }

  function next() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  }

  const isToday = (d: number) => d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const isSelected = (d: number) => selected !== null && d === selected.getDate() && viewMonth === selected.getMonth() && viewYear === selected.getFullYear();

  const displayValue = selected
    ? `${selected.getDate()} ${MONTH_NAMES[selected.getMonth()]} ${selected.getFullYear()}`
    : "";

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={triggerRef}
        className="m-form-input"
        style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
        onClick={() => {
          if (!open && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const modal = triggerRef.current.closest(".m-modal");
            if (modal) {
              const modalRect = modal.getBoundingClientRect();
              setPos({ top: modalRect.top + modalRect.height / 2 - 160, left: modalRect.left - 300 });
            } else {
              setPos({ top: rect.bottom + 6, left: rect.left });
            }
          }
          setOpen(!open);
        }}
      >
        <span style={{ color: displayValue ? "var(--m-text)" : "var(--m-text3)" }}>
          {displayValue || "Sanani tanlang"}
        </span>
        <span style={{ fontSize: 14, color: "var(--m-text3)" }}>📅</span>
      </div>
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => setOpen(false)} />
          <div className="m-datepicker" style={{ top: pos.top, left: pos.left }}>
            <div className="m-dp-header">
              <button type="button" className="m-dp-nav" onClick={prev}>&lt;</button>
              <span className="m-dp-title">{MONTH_NAMES[viewMonth]} {viewYear}</span>
              <button type="button" className="m-dp-nav" onClick={next}>&gt;</button>
            </div>
            <div className="m-dp-weekdays">
              {WEEKDAYS.map((w) => <span key={w} className="m-dp-wd">{w}</span>)}
            </div>
            <div className="m-dp-grid">
              {cells.map((d, i) => (
                <button
                  key={i}
                  type="button"
                  className={`m-dp-day${d === null ? " empty" : ""}${d && isToday(d) ? " today" : ""}${d && isSelected(d) ? " selected" : ""}`}
                  disabled={d === null}
                  onClick={() => d && pick(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
