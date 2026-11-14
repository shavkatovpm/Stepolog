"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Y } from "./data";
import type { Dict } from "./i18n/en";

type Field = Pick<Dict["fields"][number], "title" | "body" | "source" | "views" | "time">;

// Ko'rinishga kirganda paydo bo'ladi; inView ni bolalarga ham beradi
export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, shown] = useInView<HTMLDivElement>(0.15);
  return (
    <div ref={ref} className={`reveal ${shown ? "is-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function Eye() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// Logotipdagi ramka burchaklari
export function Corners({ show = true, inset = -8 }: { show?: boolean; inset?: number }) {
  const base = "pointer-events-none absolute h-3 w-3 transition-all duration-500";
  const o = show ? 1 : 0;
  const s = show ? inset : inset - 10;
  return (
    <>
      <span className={`${base} border-l-2 border-t-2`} style={{ borderColor: Y, opacity: o, left: s, top: s }} />
      <span className={`${base} border-r-2 border-t-2`} style={{ borderColor: Y, opacity: o, right: s, top: s }} />
      <span className={`${base} border-b-2 border-l-2`} style={{ borderColor: Y, opacity: o, left: s, bottom: s }} />
      <span className={`${base} border-b-2 border-r-2`} style={{ borderColor: Y, opacity: o, right: s, bottom: s }} />
    </>
  );
}

export type PostPart = "title" | "body" | "source" | null;

export function TgPost({ p, focus = null }: { p: Field; focus?: PostPart }) {
  const part = (name: Exclude<PostPart, null>, children: ReactNode, cls = "") => (
    <div className={`relative transition-opacity duration-300 ${focus && focus !== name ? "opacity-30" : ""} ${cls}`}>
      {focus !== null && <Corners show={focus === name} inset={-7} />}
      {children}
    </div>
  );
  return (
    <div className="w-full rounded-[16px] rounded-bl-[4px] bg-[#2b2b2b] px-4 pb-2.5 pt-3.5 text-[15px] leading-[1.5] text-[#ececec]">
      {part("title", <p className="font-semibold">{p.title}</p>)}
      {part("body", <p className="text-[#d4d4d4]">{p.body}</p>, "mt-2")}
      {part(
        "source",
        <p className="text-[14px]" style={{ color: Y }}>
          {p.source} ↗
        </p>,
        "mt-2.5 w-fit"
      )}
      <div className="mt-1 flex items-center justify-end gap-1.5 text-[12px] text-[#8c8c8c]">
        <Eye /> {p.views}
        <span className="ml-1">{p.time}</span>
      </div>
    </div>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="text-[13px] font-medium" style={{ color: Y }}>{children}</p>;
}

export function H2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`text-balance text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[40px] ${className}`}>{children}</h2>;
}
