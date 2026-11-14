"use client";

import { useEffect, useState } from "react";
import { Y } from "@/components/home/data";
import { useDict } from "@/components/home/i18n";

// Marketing: platformalar taxtasi, yangiliklar navbat bilan yonadi
const rows = {
  uz: [
    { p: "Google Ads", t: "Performance Max uchun kanal hisobotlari ochildi", time: "08:15" },
    { p: "Instagram", t: "Tavsiyalarda original kontentga ustunlik beriladi", time: "10:30" },
    { p: "Meta Ads", t: "Auditoriya sozlamalari soddalashtirildi", time: "12:10" },
    { p: "TikTok", t: "Qidiruv reklamasi yangi bozorlarda ishga tushdi", time: "14:45" },
    { p: "YouTube", t: "Shorts uchun yangi reklama formati sinovda", time: "16:20" },
    { p: "Google qidiruv", t: "AI javoblarida manba ko'rsatish o'zgardi", time: "18:05" },
  ],
  en: [
    { p: "Google Ads", t: "Channel-level reporting opens for Performance Max", time: "08:15" },
    { p: "Instagram", t: "Recommendations now favor original content", time: "10:30" },
    { p: "Meta Ads", t: "Audience settings are simplified", time: "12:10" },
    { p: "TikTok", t: "Search Ads launch in new markets", time: "14:45" },
    { p: "YouTube", t: "New ad format for Shorts in testing", time: "16:20" },
    { p: "Google Search", t: "How AI answers cite sources has changed", time: "18:05" },
  ],
  ru: [
    { p: "Google Ads", t: "Появились отчёты по каналам для Performance Max", time: "08:15" },
    { p: "Instagram", t: "Рекомендации продвигают оригинальный контент", time: "10:30" },
    { p: "Meta Ads", t: "Настройки аудитории упростили", time: "12:10" },
    { p: "TikTok", t: "Поисковая реклама запущена на новых рынках", time: "14:45" },
    { p: "YouTube", t: "Тестируется новый формат рекламы для Shorts", time: "16:20" },
    { p: "Google Поиск", t: "Изменилось указание источников в ответах ИИ", time: "18:05" },
  ],
};
const T = {
  uz: { ch: "Stepolog · Marketing", today: "bugun 6 ta post", weekly: "Dushanba: haftalik xulosa", note: "har biri manbasi bilan" },
  en: { ch: "Stepolog · Marketing", today: "6 posts today", weekly: "Monday: weekly summary", note: "each with a source link" },
  ru: { ch: "Stepolog · Маркетинг", today: "сегодня 6 постов", weekly: "Понедельник: недельная сводка", note: "к каждому ссылка на источник" },
};

export default function MarketingVisual() {
  const locale = useDict().locale;
  const t = T[locale];
  const list = rows[locale];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % 6), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121212] shadow-[0_30px_80px_-30px_rgba(0,0,0,.8)]">
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#1d1d1d] px-5 py-3.5">
        <p className="text-[15px] font-semibold">{t.ch}</p>
        <p className="text-[12.5px] text-white/45">{t.today}</p>
      </div>
      <ul>
        {list.map((r, i) => {
          const on = i === active;
          const done = i < active;
          return (
            <li
              key={r.p}
              className={`relative grid grid-cols-[92px_1fr_auto] md:grid-cols-[110px_1fr_auto] items-center gap-3 border-b border-white/[0.05] px-5 py-4 transition-colors duration-500 last:border-0 ${
                on ? "bg-white/[0.05]" : ""
              }`}
            >
              {on && <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: Y }} />}
              <span className={`text-[13px] font-semibold transition-colors ${on ? "" : "text-white/55"}`} style={on ? { color: Y } : undefined}>
                {r.p}
              </span>
              <span className={`truncate text-[14px] transition-colors ${on ? "text-white" : done ? "text-white/60" : "text-white/35"}`}>{r.t}</span>
              <span className="text-[12px] tabular-nums text-white/35">{r.time}</span>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3 text-[12.5px] text-white/45">
        <span>{t.weekly}</span>
        <span style={{ color: Y }}>{t.note}</span>
      </div>
    </div>
  );
}
