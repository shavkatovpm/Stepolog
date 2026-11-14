"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "@/components/Logo";
import { BOT, tile, Y } from "../data";
import { useDict } from "../i18n";

// Bento hero: istalgan soha bo'yicha saralangan yangiliklar
// Har bir soha uchun namunaviy kunlik raqamlar (tartib: Marketing, AI, Dasturlash, Dizayn, Biznes)
const STATS = [
  { total: 107, sent: 6 },
  { total: 134, sent: 5 },
  { total: 96, sent: 4 },
  { total: 58, sent: 3 },
  { total: 81, sent: 4 },
];
const MAX = 140; // to'r balandligi o'zgarmasligi uchun

// Tanlangan materiallarni to'r bo'ylab tekis taqsimlaymiz
const keepOf = (total: number, sent: number) =>
  Array.from({ length: sent }, (_, k) => Math.min(total - 1, Math.round(((k + 0.5) * total) / sent) + ((k * 7) % 5) - 2));

export default function HeroBento() {
  const t = useDict();
  const fields = t.fields;
  const [n, setN] = useState(0);
  const [field, setField] = useState(0);
  const [auto, setAuto] = useState(true);

  const stat = STATS[field % STATS.length];
  const keep = keepOf(stat.total, stat.sent);

  // Soha almashganda hisoblagich yangi qiymatgacha sanaydi (oshib yoki kamayib)
  useEffect(() => {
    if (n === stat.total) return;
    const step = Math.max(1, Math.round(Math.abs(stat.total - n) / 18));
    const t = setTimeout(() => setN((x) => (x < stat.total ? Math.min(stat.total, x + step) : Math.max(stat.total, x - step))), 22);
    return () => clearTimeout(t);
  }, [n, stat.total]);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setField((i) => (i + 1) % fields.length), 3800);
    return () => clearInterval(t);
  }, [auto, fields.length]);

  const f = fields[field];
  const done = n === stat.total;

  return (
    <section className="flex min-h-[calc(100svh-4rem)] items-center bg-[#1c1c1c]">
      <div className="mx-auto grid w-full max-w-[1160px] gap-3 px-5 py-10 md:grid-cols-4 md:py-14">
        {/* Sarlavha va soha tanlash */}
        <div className={`${tile} anim-rise flex flex-col justify-between p-6 md:col-span-2 md:row-span-2 md:p-10`}>
          <LogoMark size={28} />
          <div className="mt-8 md:mt-14">
            <h1 className="text-balance text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[34px] md:text-[50px] md:leading-[1.06] md:tracking-[-0.035em]">
              {t.hero.titleA} <span className="text-white/40">{t.hero.titleB}</span>
            </h1>
            <p className="mt-4 max-w-[440px] text-[15.5px] leading-[1.6] text-white/60 md:mt-5 md:text-[17px]">
              {t.hero.sub}
            </p>
            <div className="mt-7 md:mt-8">
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
                {stat.sent}
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-[4px]">
            {Array.from({ length: MAX }).map((_, i) => {
              const seen = i < n;
              const out = i >= stat.total; // shu soha uchun kerak emas
              return (
                <span
                  key={i}
                  className="h-[10px] w-[10px] rounded-[2px] transition-colors duration-300"
                  style={{
                    background: out ? "transparent" : !seen ? "rgba(255,255,255,.06)" : keep.includes(i) && done ? Y : "rgba(255,255,255,.22)",
                  }}
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
          <span className="mt-6 flex items-end justify-between gap-3 md:mt-10 text-[24px] font-semibold leading-[1.1] tracking-[-0.02em]">
            <span className="max-w-[140px]">{t.hero.cta}</span>
            <span className="text-[32px] transition-transform group-hover:translate-x-1">→</span>
          </span>
        </a>
      </div>
    </section>
  );
}
