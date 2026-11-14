"use client";

import { BOT, Y } from "../data";
import { useDict } from "../i18n";
import { useInView } from "../ui";

// Bot va kanal: jadval ko'rinishi, har qatorda 24 soatlik chizg'ich
const BOT_HOURS = [20];
const CHANNEL_HOURS = [8.25, 10.7, 12.1, 14.5, 17.3, 19.5];

export default function DayRuler() {
  const t = useDict();
  const [ref, inView] = useInView<HTMLDivElement>(0.25);
  const plans = [
    { ...t.day.bot, hours: BOT_HOURS, href: BOT, main: false },
    { ...t.day.channel, hours: CHANNEL_HOURS, href: "#narx", main: true },
  ];

  return (
    <section id="kun" className="scroll-mt-16 border-t border-white/[0.08]">
      <div ref={ref} className="mx-auto max-w-[1160px] px-5 py-24 md:py-32">
        <div className={`reveal ${inView ? "is-in" : ""}`}>
          <h2 className="max-w-[720px] text-balance text-[34px] font-semibold leading-[1.06] tracking-[-0.035em] md:text-[48px]">{t.day.title}</h2>
          <p className="mt-5 max-w-[520px] text-[16px] leading-[1.6] text-white/55">{t.day.sub}</p>
        </div>

        <div className="mt-16">
          <div className="hidden grid-cols-[240px_1fr] gap-10 pb-3 md:grid">
            <span />
            <div className="relative h-4 text-[11.5px] tabular-nums text-white/35">
              {[0, 6, 12, 18, 24].map((h) => (
                <span key={h} className="absolute -translate-x-1/2" style={{ left: `${(h / 24) * 100}%` }}>
                  {String(h).padStart(2, "0")}:00
                </span>
              ))}
            </div>
          </div>

          {plans.map((p, pi) => (
            <div key={p.name} className="grid gap-5 border-t border-white/[0.1] py-9 md:grid-cols-[240px_1fr] md:gap-10">
              <div>
                <p className="text-[15px] font-semibold" style={p.main ? { color: Y } : undefined}>{p.name}</p>
                <p className="mt-1 text-[24px] font-semibold tracking-[-0.02em]">{p.price}</p>
                <p className="mt-1 text-[13.5px] text-white/45">{t.day.perDay(p.hours.length)}</p>
              </div>
              <div>
                <div className="relative h-8">
                  <div className="absolute inset-x-0 top-1/2 h-px bg-white/15" />
                  {Array.from({ length: 25 }).map((_, h) => (
                    <span key={h} className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-white/15" style={{ left: `${(h / 24) * 100}%` }} />
                  ))}
                  {p.hours.map((h, i) => (
                    <span
                      key={h}
                      className="absolute top-1/2 h-4 w-4 rounded-[4px] transition-all duration-500"
                      style={{
                        left: `${(h / 24) * 100}%`,
                        background: p.main ? Y : "#f2f2f2",
                        opacity: inView ? 1 : 0,
                        transform: `translate(-50%, ${inView ? "-50%" : "-150%"})`,
                        transitionDelay: `${200 + pi * 300 + i * 120}ms`,
                      }}
                    />
                  ))}
                </div>
                <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <p className="max-w-[560px] text-[15px] leading-[1.55] text-white/60">{p.points}</p>
                  <a
                    href={p.href}
                    className={`shrink-0 text-[15px] font-semibold underline-offset-[6px] transition-colors ${p.main ? "" : "text-white/80 underline decoration-white/30 hover:decoration-white"}`}
                    style={p.main ? { color: Y } : undefined}
                  >
                    {p.cta} →
                  </a>
                </div>
              </div>
            </div>
          ))}
          <div className="border-t border-white/[0.1]" />
        </div>
      </div>
    </section>
  );
}
