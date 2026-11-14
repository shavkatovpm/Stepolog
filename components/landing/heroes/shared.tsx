"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LogoMark } from "@/components/Logo";

// Qadamma-qadam aylanadigan animatsiya uchun hisoblagich
export function useSteps(times: number[], loop = true) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= times.length) {
      if (!loop) return;
      const t = setTimeout(() => setStep(0), 2600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), times[step]);
    return () => clearTimeout(t);
  }, [step, times, loop]);
  return [step, setStep] as const;
}

// Telegram oynasi ramkasi
export function TgWindow({ title, sub, children, className = "" }: { title: string; sub: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121212] shadow-[0_30px_80px_-30px_rgba(0,0,0,.8)] ${className}`}>
      <div className="flex items-center gap-3 border-b border-white/[0.06] bg-[#1d1d1d] px-4 py-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#2b2b2b]">
          <LogoMark size={18} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold">{title}</p>
          <p className="text-[12.5px] text-white/45">{sub}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export function Typing() {
  return (
    <div className="anim-rise flex w-fit items-center gap-1 rounded-[16px] rounded-bl-[4px] bg-[#262626] px-3.5 py-3">
      <span className="typing-dot" />
      <span className="typing-dot" style={{ animationDelay: ".15s" }} />
      <span className="typing-dot" style={{ animationDelay: ".3s" }} />
    </div>
  );
}

export const bubble = "rounded-[16px] rounded-bl-[4px] bg-[#262626] px-3.5 py-2.5 text-[14px] leading-[1.5]";
