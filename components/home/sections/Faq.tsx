"use client";

import { useState } from "react";
import { BOT, Y } from "../data";
import { useDict } from "../i18n";
import { Reveal } from "../ui";

// Savollar: chapda sarlavha, o'ngda chiziqli accordion
export default function Faq() {
  const t = useDict();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="savollar" className="scroll-mt-16 border-t border-white/[0.08]">
      <div className="mx-auto grid max-w-[1160px] gap-10 px-5 py-16 md:gap-12 md:grid-cols-[0.8fr_1.4fr] md:py-32">
        <Reveal>
          <h2 className="text-balance text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] md:text-[48px]">{t.faq.title}</h2>
          <p className="mt-5 text-[16px] text-white/55">
            {t.faq.notFound}{" "}
            <a href={BOT} className="font-semibold underline-offset-4 hover:underline" style={{ color: Y }}>
              {t.faq.ask}
            </a>
          </p>
        </Reveal>

        <Reveal delay={100} className="border-t border-white/[0.12]">
          {t.faq.items.map((f, i) => {
            const on = open === i;
            return (
              <div key={f.q} className="border-b border-white/[0.12]">
                <button onClick={() => setOpen(on ? null : i)} aria-expanded={on} className="flex w-full items-center justify-between gap-6 py-6 text-left">
                  <span className={`text-[18px] font-medium transition-colors ${on ? "text-white" : "text-white/75"}`}>{f.q}</span>
                  <span className="text-[24px] leading-none transition-transform duration-300" style={{ color: on ? Y : "rgba(255,255,255,.4)", transform: on ? "rotate(45deg)" : "none" }}>
                    +
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ${on ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <p className="max-w-[620px] overflow-hidden text-[15.5px] leading-[1.65] text-white/60">{f.a}</p>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
