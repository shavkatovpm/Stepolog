"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "@/components/Logo";
import { Y } from "../data";
import { useDict } from "../i18n";
import { Reveal, TgPost, type PostPart } from "../ui";

// Post tuzilishi: och fon, chapda qatorlar, o'ngda post
const ids: Exclude<PostPart, null>[] = ["title", "body", "source"];

export default function Anatomy() {
  const t = useDict();
  const parts = t.anatomy.parts.map((p, i) => ({ ...p, id: ids[i] }));
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setActive((a) => (a + 1) % parts.length), 2800);
    return () => clearInterval(t);
  }, [auto, parts.length]);

  const pick = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <section id="post" className="scroll-mt-16 bg-[#f3f1ea] text-[#1c1c1c]">
      <div className="mx-auto grid max-w-[1160px] gap-14 px-5 py-24 md:grid-cols-[1fr_1fr] md:items-center md:gap-20 md:py-32">
        <Reveal>
          <p className="text-[14px] font-medium text-black/50">{t.anatomy.kicker}</p>
          <h2 className="mt-4 text-balance text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] md:text-[48px]">
            {t.anatomy.title}
          </h2>
          <div className="mt-12 border-t border-black/15">
            {parts.map((p, i) => {
              const on = i === active;
              return (
                <button
                  key={p.id}
                  onMouseEnter={() => pick(i)}
                  onClick={() => pick(i)}
                  className="relative block w-full border-b border-black/15 py-5 text-left"
                >
                  <div className="flex items-baseline gap-5">
                    <span className={`text-[14px] font-semibold tabular-nums transition-colors ${on ? "text-black" : "text-black/30"}`}>0{i + 1}</span>
                    <div>
                      <p className={`text-[22px] font-semibold tracking-[-0.02em] transition-colors ${on ? "text-black" : "text-black/35"}`}>{p.title}</p>
                      <div className={`grid transition-all duration-300 ${on ? "mt-1.5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                        <p className="overflow-hidden text-[15.5px] leading-[1.6] text-black/60">{p.text}</p>
                      </div>
                    </div>
                  </div>
                  {on && auto && <span key={active} className="progress-bar absolute -bottom-px left-0 h-[2px] bg-[#1c1c1c]" />}
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mx-auto w-full max-w-[480px] rounded-[28px] bg-[#1c1c1c] p-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,.45)]">
            <div className="flex items-center gap-3 px-3 pb-3 pt-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#2b2b2b]">
                <LogoMark size={16} />
              </span>
              <div className="text-white">
                <p className="text-[14px] font-semibold">{t.anatomy.channel}</p>
                <p className="text-[12px] text-white/45">{t.anatomy.sample}</p>
              </div>
            </div>
            <div className="rounded-[20px] bg-[#141414] px-4 py-10 md:px-6 md:py-14">
              <TgPost p={t.fields[0]} focus={parts[active].id} />
            </div>
          </div>
          <p className="mt-5 text-center text-[13px] text-black/45">
            {t.anatomy.caption("")}
            <span className="font-semibold" style={{ color: "#1c1c1c", background: Y, padding: "0 4px" }}>{parts[active].title}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
