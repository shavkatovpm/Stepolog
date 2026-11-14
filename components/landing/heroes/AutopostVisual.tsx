"use client";

import { Y } from "@/components/home/data";
import { useDict } from "@/components/home/i18n";
import { useSteps } from "./shared";

// Avtopost: kanal jadvali, postlar holati o'zgarib boradi
const T = {
  uz: {
    ch: "Sizning kanalingiz", sub: "avtopost jadvali", soon: "tez orada", today: "Bugun", foot: "Kanalingiz uslubida yoziladi · siz tasdiqlaysiz yoki avtomatik",
    days: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"], st: ["Tasdiqlash kutilmoqda", "Rejada", "Joylandi"],
    queue: ["Instagram original kontentga ustunlik beradi", "Google Ads'da kanal hisobotlari ochildi", "TikTok qidiruv reklamasi yangi bozorlarda"],
  },
  en: {
    ch: "Your channel", sub: "autopost schedule", soon: "coming soon", today: "Today", foot: "Written in your channel's style · approve or go fully automatic",
    days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"], st: ["Awaiting approval", "Scheduled", "Posted"],
    queue: ["Instagram favors original content", "Google Ads opens channel reporting", "TikTok Search Ads in new markets"],
  },
  ru: {
    ch: "Ваш канал", sub: "расписание автопостинга", soon: "скоро", today: "Сегодня", foot: "В стиле вашего канала · с подтверждением или полностью автоматически",
    days: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"], st: ["Ждёт подтверждения", "Запланирован", "Опубликован"],
    queue: ["Instagram продвигает оригинальный контент", "В Google Ads появились отчёты по каналам", "Поисковая реклама TikTok на новых рынках"],
  },
};
const TIMESLOTS = ["09:00", "13:00", "18:00"];
const TIMES = [1000, 1000, 1000, 1000, 1000, 1000];

// step: har bir post uchun 0 kutilmoqda → 1 rejada → 2 joylandi
function status(i: number, step: number, labels: string[]) {
  const s = step - i * 2;
  if (s >= 2) return { label: labels[2], cls: "text-[#1c1c1c]", bg: Y };
  if (s >= 1) return { label: labels[1], cls: "text-white", bg: "rgba(255,255,255,.12)" };
  return { label: labels[0], cls: "text-white/60", bg: "rgba(255,255,255,.05)" };
}

export default function AutopostVisual() {
  const t = T[useDict().locale];
  const [step] = useSteps(TIMES);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121212] shadow-[0_30px_80px_-30px_rgba(0,0,0,.8)]">
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#1d1d1d] px-5 py-3.5">
        <div>
          <p className="text-[15px] font-semibold">{t.ch}</p>
          <p className="text-[12.5px] text-white/45">{t.sub}</p>
        </div>
        <span className="rounded-md px-2 py-1 text-[11.5px] font-semibold text-[#1c1c1c]" style={{ background: Y }}>
          {t.soon}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1.5 border-b border-white/[0.06] px-5 py-4">
        {t.days.map((d, i) => (
          <div key={d} className="text-center">
            <p className="text-[11.5px] text-white/40">{d}</p>
            <div className="mt-2 flex flex-col items-center gap-1">
              {Array.from({ length: i < 5 ? 3 : 1 }).map((_, k) => (
                <span key={k} className="h-1.5 w-full rounded-full" style={{ background: i === 0 ? Y : "rgba(255,255,255,.14)" }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2.5 p-5">
        <p className="text-[13px] text-white/45">{t.today}</p>
        {TIMESLOTS.map((time, i) => {
          const s = status(i, step, t.st);
          return (
            <div key={time} className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-[#1b1b1b] px-4 py-3.5">
              <span className="text-[13px] font-semibold tabular-nums text-white/55">{time}</span>
              <p className="min-w-0 flex-1 truncate text-[14px]">{t.queue[i]}</p>
              <span className={`shrink-0 rounded-md px-2 py-1 text-[11.5px] font-semibold transition-all duration-500 ${s.cls}`} style={{ background: s.bg }}>
                {s.label}
              </span>
            </div>
          );
        })}
        <p className="pt-2 text-[12.5px] text-white/40">{t.foot}</p>
      </div>
    </div>
  );
}
