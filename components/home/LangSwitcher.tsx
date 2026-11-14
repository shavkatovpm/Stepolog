"use client";

import { useEffect, useRef, useState } from "react";
import { FlagGB, FlagRU, FlagUZ } from "@/components/Flags";
import { useDict } from "./i18n";

const langs = [
  { code: "en", short: "EN", name: "English", href: "/", Flag: FlagGB },
  { code: "uz", short: "UZ", name: "O'zbekcha", href: "/uz", Flag: FlagUZ },
  { code: "ru", short: "RU", name: "Русский", href: "/ru", Flag: FlagRU },
] as const;

const flagCls = "h-[14px] w-[20px] shrink-0 overflow-hidden rounded-[3px] ring-1 ring-white/15";

export default function LangSwitcher() {
  const t = useDict();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = langs.find((l) => l.code === t.locale)!;

  // Tashqariga bosilganda yoki Esc bosilganda yopiladi
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language"
        className={`flex h-10 items-center gap-2 rounded-md px-3 text-[13.5px] font-semibold transition-colors ${open ? "bg-white/[0.1]" : "bg-white/[0.06] hover:bg-white/[0.1]"}`}
      >
        <current.Flag className={flagCls} />
        {current.short}
        <svg width="10" height="10" viewBox="0 0 10 10" className={`text-white/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true">
          <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <ul
        role="listbox"
        className={`absolute right-0 top-[calc(100%+8px)] z-50 w-[180px] origin-top-right rounded-lg border border-white/[0.1] bg-[#232323] p-1 shadow-[0_16px_40px_-12px_rgba(0,0,0,.7)] transition-all duration-200 ${
          open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"
        }`}
      >
        {langs.map((l) => {
          const on = l.code === t.locale;
          return (
            <li key={l.code} role="option" aria-selected={on}>
              <a
                href={l.href}
                hrefLang={l.code}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] transition-colors ${on ? "bg-white/[0.08] text-white" : "text-white/70 hover:bg-white/[0.05] hover:text-white"}`}
              >
                <l.Flag className={flagCls} />
                <span className="flex-1">{l.name}</span>
                {on && <span className="text-[#FFDE59]">✓</span>}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
