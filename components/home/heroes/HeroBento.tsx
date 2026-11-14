"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "@/components/Logo";
import { BOT, tile, Y } from "../data";
import { useDict } from "../i18n";

// Bento hero: istalgan soha bo'yicha saralangan yangiliklar
const TOTAL = 107;
const SENT = 6;
const KEEP = [9, 26, 41, 58, 77, 96];

export default function HeroBento() {
  const t = useDict();
  const fields = t.fields;
  const [n, setN] = useState(0);
  const [field, setField] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (n >= TOTAL) return;
    const t = setTimeout(() => setN((x) => Math.min(TOTAL, x + 3)), 22);
    return () => clearTimeout(t);
  }, [n]);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setField((i) => (i + 1) % fields.length), 3800);
    return () => clearInterval(t);
  }, [auto, fields.length]);

  const f = fields[field];
  const done = n >= TOTAL;

  return (
    <section className="flex min-h-[calc(100svh-4rem)] items-center bg-[#1c1c1c]">
      <div className="mx-auto grid w-full max-w-[1160px] gap-3 px-5 py-10 md:grid-cols-4 md:py-14">
        {/* Sarlavha va soha tanlash */}
        <div className={`${tile} anim-rise flex flex-col justify-between p-7 md:col-span-2 md:row-span-2 md:p-10`}>
          <LogoMark size={28} />
          <div className="mt-14">
            <h1 className="text-balance text-[36px] font-semibold leading-[1.06] tracking-[-0.035em] md:text-[50px]">
              {t.hero.titleA} <span className="text-white/40">{t.hero.titleB}</span>
            </h1>
            <p className="mt-5 max-w-[460px] text-[17px] leading-[1.6] text-white/60">
              {t.hero.sub}
            </p>
            <div className="mt-8">
              <p className="text-[13px] text-white/40">{t.hero.fieldsLabel}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {fields.map((x, i) => (
                  <button
                    key={x.name}
                    onClick={() => {
                      setAuto(false);
                      setField(i);
                    }}
                    className={`rounded-md px-3 py-1.5 text-[14px] font-medium transition-all duration-300 ${
                      i === field ? "text-[#1c1c1c]" : "bg-white/[0.06] text-white/70 hover:bg-white/[0.12] hover:text-white"
                    }`}
                    style={i === field ? { background: Y } : undefined}
                  >
                    {x.name}
                  </button>
                ))}
                <span className="rounded-md border border-dashed border-white/20 px-3 py-1.5 text-[14px] text-white/45">{t.hero.andMore}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Jonli hisoblagich */}
        <div className={`${tile} anim-rise p-6 md:col-span-2 md:p-7`} style={{ animationDelay: "80ms" }}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[13px] text-white/45">{t.hero.reviewed}</p>
              <p className="mt-1 text-[44px] font-semibold leading-none tracking-[-0.03em] tabular-nums">{n}</p>
            </div>
            <div className="text-right">
              <p className="text-[13px] text-white/45">{t.hero.published}</p>
              <p className="mt-1 text-[44px] font-semibold leading-none tracking-[-0.03em] transition-colors" style={{ color: done ? Y : "rgba(255,255,255,.2)" }}>
                {SENT}
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-[4px]">
            {Array.from({ length: TOTAL }).map((_, i) => {
              const seen = i < n;
              return (
                <span
                  key={i}
                  className="h-[10px] w-[10px] rounded-[2px] transition-colors duration-300"
                  style={{ background: !seen ? "rgba(255,255,255,.06)" : KEEP.includes(i) && done ? Y : "rgba(255,255,255,.22)" }}
                />
              );
            })}
          </div>
        </div>

        {/* Tanlangan soha posti */}
        <div className={`${tile} anim-rise flex flex-col p-5`} style={{ animationDelay: "160ms" }}>
          <p className="flex items-center justify-between text-[13px] text-white/45">
            <span style={{ color: Y }}>{f.name}</span>
            <span>{f.open ? t.hero.open : t.hero.soon}</span>
          </p>
          <div key={field} className="anim-rise mt-3 flex-1">
            <p className="text-[15px] font-semibold leading-snug">{f.title}</p>
            <p className="mt-2 text-[13.5px] leading-snug text-white/55">{f.why}</p>
          </div>
          <div className="mt-4 flex gap-1">
            {fields.map((x, i) => (
              <span key={x.name} className="h-[3px] flex-1 rounded-full transition-colors" style={{ background: i === field ? Y : "rgba(255,255,255,.12)" }} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <a
          href={BOT}
          className="anim-rise group flex flex-col justify-between rounded-2xl p-5 text-[#1c1c1c] transition-transform hover:-translate-y-0.5"
          style={{ background: Y, animationDelay: "240ms" }}
        >
          <span className="text-[13px] font-medium text-black/60">@stepologbot</span>
          <span className="mt-10 flex items-end justify-between gap-3 text-[24px] font-semibold leading-[1.1] tracking-[-0.02em]">
            <span className="max-w-[140px]">{t.hero.cta}</span>
            <span className="text-[32px] transition-transform group-hover:translate-x-1">→</span>
          </span>
        </a>
      </div>
    </section>
  );
}
