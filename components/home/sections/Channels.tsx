"use client";

import { useState } from "react";
import { BOT } from "../data";
import { useDict } from "../i18n";
import { Reveal } from "../ui";

// Sohalar: sariq fon, menyu kabi yirik qatorlar. Faqat birinchisi ochiq.
export default function Channels() {
  const t = useDict();
  const c = t.channels;
  const [voted, setVoted] = useState<number[]>([]);

  return (
    <section id="sohalar" className="scroll-mt-16 bg-[#FFDE59] text-[#1c1c1c]">
      <div className="mx-auto max-w-[1160px] px-5 py-16 md:py-32">
        <Reveal className="grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-end">
          <h2 className="text-balance text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] md:text-[48px]">{c.title}</h2>
          <p className="max-w-[400px] text-[16px] leading-[1.6] text-black/65 md:justify-self-end">{c.sub}</p>
        </Reveal>

        <div className="mt-10 md:mt-14 border-t-2 border-[#1c1c1c]">
          {c.list.map((name, i) => {
            const open = i === 0;
            const on = voted.includes(i);
            return (
              <Reveal key={name} delay={i * 50}>
                <div className="flex items-center justify-between gap-3 border-b border-black/20 py-4 md:gap-4 md:py-6">
                  <div className="flex min-w-0 items-baseline gap-3 md:gap-6">
                    <span className="w-5 shrink-0 text-[12px] font-semibold tabular-nums text-black/40 md:w-6 md:text-[13px]">0{i + 1}</span>
                    <span className={`text-[21px] font-semibold leading-[1.15] tracking-[-0.025em] md:text-[44px] md:leading-none ${open ? "" : "text-black/45"}`}>{name}</span>
                  </div>
                  {open ? (
                    <a href={BOT} className="flex shrink-0 items-center gap-2 rounded-md bg-[#1c1c1c] px-3 py-2 text-[13px] font-semibold md:px-4 md:py-2.5 md:text-[14px] text-[#FFDE59] transition-transform hover:-translate-y-0.5">
                      {c.openBtn} <span aria-hidden>→</span>
                    </a>
                  ) : (
                    <div className="flex shrink-0 items-center gap-4">
                      <span className="hidden text-[13.5px] text-black/50 md:inline">{c.soon}</span>
                      <button
                        onClick={() => setVoted((v) => (on ? v.filter((x) => x !== i) : [...v, i]))}
                        className={`whitespace-nowrap rounded-md border-2 border-[#1c1c1c] px-3 py-1.5 text-[12.5px] font-semibold md:px-3.5 md:py-2 md:text-[13.5px] transition-colors ${on ? "bg-[#1c1c1c] text-[#FFDE59]" : "hover:bg-black/[0.06]"}`}
                      >
                        {on ? c.voted : c.vote}
                      </button>
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-8 text-[15.5px] text-black/70">
          {c.missingA}{" "}
          <a href={BOT} className="font-semibold underline decoration-2 underline-offset-[5px]">
            {c.missingLink}
          </a>
          {c.missingB}
        </p>
      </div>
    </section>
  );
}
