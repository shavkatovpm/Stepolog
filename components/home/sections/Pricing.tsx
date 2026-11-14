"use client";

import { useState } from "react";
import { BOT, fmt, MONTHLY, prices, Y } from "../data";
import { useDict } from "../i18n";
import { Reveal } from "../ui";

// Narx: chapda katta raqam, o'ngda muddat tanlash va shartlar
export default function Pricing() {
  const t = useDict();
  const pr = t.pricing;
  const [sel, setSel] = useState(1);
  const p = prices[sel];
  const saved = MONTHLY * p.months - p.total;

  return (
    <section id="narx" className="scroll-mt-16">
      <div className="mx-auto max-w-[1160px] px-5 py-24 md:py-32">
        <Reveal>
          <h2 className="max-w-[820px] text-balance text-[34px] font-semibold leading-[1.06] tracking-[-0.035em] md:text-[48px]">{pr.title}</h2>
        </Reveal>

        <Reveal delay={100} className="mt-16 grid gap-14 border-t border-white/[0.1] pt-12 md:grid-cols-[1.1fr_1fr] md:gap-20">
          <div>
            <p className="text-[14px] text-white/45">
              {pr.field} · {pr.labels[sel]}
            </p>
            <div key={sel} className="anim-rise">
              <p className="mt-3 text-[60px] font-semibold leading-none tracking-[-0.045em] tabular-nums md:text-[96px]">
                {fmt(p.total)}
                <span className="ml-3 text-[20px] font-normal tracking-normal text-white/40 md:text-[24px]">{pr.currency}</span>
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-[15.5px]">
                <span className="text-white/55">{pr.perMonth(fmt(Math.round(p.total / p.months)))}</span>
                {saved > 0 && <span style={{ color: Y }}>{pr.save(fmt(saved))}</span>}
              </div>
            </div>
            <a href={BOT} className="btn-y mt-10 inline-block rounded-md px-8 py-4 text-[15px] font-semibold text-[#1c1c1c]" style={{ background: Y }}>
              {pr.cta}
            </a>
          </div>

          <div className="space-y-10">
            <div>
              <p className="text-[14px] text-white/45">{pr.duration}</p>
              <div className="mt-4 grid grid-cols-4 border-b border-white/[0.1]">
                {prices.map((x, i) => (
                  <button
                    key={x.id}
                    onClick={() => setSel(i)}
                    className={`relative pb-3 text-left text-[15px] font-semibold transition-colors md:text-[16px] ${sel === i ? "text-white" : "text-white/35 hover:text-white/70"}`}
                  >
                    {pr.labels[i]}
                    {x.save > 0 && (
                      <span className="block text-[12px] font-medium" style={{ color: sel === i ? Y : undefined }}>
                        −{x.save}%
                      </span>
                    )}
                    {sel === i && <span className="absolute -bottom-px left-0 h-[2px] w-full" style={{ background: Y }} />}
                  </button>
                ))}
              </div>
            </div>

            <ul className="space-y-3 text-[15px] text-white/60">
              {pr.terms.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="border-t border-white/[0.1] pt-8 text-[14.5px] leading-[1.6] text-white/45">{pr.bundle}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
