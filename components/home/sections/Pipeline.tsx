"use client";

import { useEffect, useState } from "react";
import { Y } from "../data";
import { useDict } from "../i18n";
import { useInView } from "../ui";

// Jarayon: butun kenglikdagi chiziq, 5 nuqta, progress chiziq bo'ylab yuradi

export default function Pipeline() {
  const t = useDict();
  const stages = t.pipeline.stages;
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const [step, setStep] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setStep((s) => (s >= stages.length + 1 ? -1 : s + 1)), 1100);
    return () => clearInterval(t);
  }, [inView, stages.length]);

  const active = Math.min(step, stages.length - 1);
  const pct = active < 0 ? 0 : (active / (stages.length - 1)) * 100;

  return (
    <section id="jarayon" className="scroll-mt-16">
      <div ref={ref} className="mx-auto max-w-[1160px] px-5 py-24 md:py-32">
        <div className={`reveal ${inView ? "is-in" : ""} grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-end`}>
          <h2 className="text-balance text-[34px] font-semibold leading-[1.06] tracking-[-0.035em] md:text-[48px]">
            {t.pipeline.titleA} <span style={{ color: Y }}>{t.pipeline.titleB}</span>
          </h2>
          <p className="max-w-[400px] text-[16px] leading-[1.6] text-white/55 md:justify-self-end">
            {t.pipeline.sub}
          </p>
        </div>

        {/* Desktop: gorizontal */}
        <div className="relative mt-20 hidden md:block">
          <div className="absolute left-0 right-0 top-[7px] h-px bg-white/15" />
          <div className="absolute left-0 top-[6px] h-[3px] rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: Y }} />
          <ol className="relative grid grid-cols-5">
            {stages.map((s, i) => {
              const reached = i <= active;
              const now = i === active;
              return (
                <li key={s.t} className={i === stages.length - 1 ? "text-right" : i === 0 ? "" : "text-center"}>
                  <span
                    className={`inline-block h-4 w-4 rounded-[4px] border-2 transition-all duration-500 ${now ? "scale-125" : ""}`}
                    style={{ borderColor: reached ? Y : "rgba(255,255,255,.25)", background: reached ? Y : "#1c1c1c" }}
                  />
                  <p className="mt-6 text-[13px] tabular-nums text-white/40">{s.t}</p>
                  <p className={`mt-1 text-[20px] font-semibold tracking-[-0.02em] transition-colors duration-500 ${reached ? "text-white" : "text-white/30"}`}>
                    {s.title}
                  </p>
                  <p
                    className={`mt-2 text-[14.5px] leading-[1.5] transition-colors duration-500 ${reached ? "text-white/55" : "text-white/20"} ${
                      i === 0 ? "max-w-[190px]" : i === stages.length - 1 ? "ml-auto max-w-[190px]" : "mx-auto max-w-[190px]"
                    }`}
                  >
                    {s.text}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Mobil: vertikal */}
        <ol className="relative mt-14 border-l border-white/15 pl-7 md:hidden">
          {stages.map((s, i) => {
            const reached = i <= active;
            return (
              <li key={s.t} className="relative pb-8 last:pb-0">
                <span
                  className="absolute -left-[36px] top-1 h-4 w-4 rounded-[4px] border-2 transition-all duration-500"
                  style={{ borderColor: reached ? Y : "rgba(255,255,255,.25)", background: reached ? Y : "#1c1c1c" }}
                />
                <p className="text-[13px] tabular-nums text-white/40">{s.t}</p>
                <p className={`mt-0.5 text-[19px] font-semibold transition-colors ${reached ? "text-white" : "text-white/35"}`}>{s.title}</p>
                <p className="mt-1 text-[14.5px] leading-[1.5] text-white/50">{s.text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
