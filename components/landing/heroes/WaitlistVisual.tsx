"use client";

import { useState } from "react";
import { BOT, Y } from "@/components/home/data";
import { useDict } from "@/components/home/i18n";
import { TgWindow } from "./shared";

// AI kanali (tez orada): xira post ustida navbatga yozilish
const T = {
  uz: {
    title: "Stepolog · Sun'iy intellekt", sub: "kanal tez orada ochiladi", forYou: "Siz uchun:", soon: "Tez orada",
    head: "Kanal ochilganda birinchilardan bilasiz", joined: "✓ Navbatdasiz · botda tasdiqlang", btn: "Menga kerak",
    posts: [
      { t: "ChatGPT'da kompaniyalar o'z biznes profilini qo'sha oladigan bo'ldi", w: "Brendingiz AI javoblarida to'g'ri ko'rinishi uchun profilni hozirdan to'ldiring." },
      { t: "Gemini Google Sheets ichida jadval tahlilini avtomatlashtirdi", w: "Hisobotlarni qo'lda yig'ishga ketadigan vaqt qisqaradi." },
      { t: "Yangi rasm modeli matnli bannerlarni xatosiz chiza boshladi", w: "Oddiy reklama bannerlarini dizaynersiz tayyorlash osonlashadi." },
    ],
  },
  en: {
    title: "Stepolog · AI", sub: "channel opening soon", forYou: "Why it matters:", soon: "Coming soon",
    head: "Be the first to know when the channel opens", joined: "✓ You're on the list · confirm in the bot", btn: "I need this",
    posts: [
      { t: "ChatGPT now lets companies add a business profile", w: "Fill it in now so your brand shows up correctly in AI answers." },
      { t: "Gemini automates spreadsheet analysis in Google Sheets", w: "Less time spent building reports by hand." },
      { t: "A new image model renders text in banners without errors", w: "Simple ad banners get easier to make without a designer." },
    ],
  },
  ru: {
    title: "Stepolog · ИИ", sub: "канал скоро откроется", forYou: "Для вас:", soon: "Скоро",
    head: "Узнайте первыми, когда канал откроется", joined: "✓ Вы в списке · подтвердите в боте", btn: "Мне нужно",
    posts: [
      { t: "В ChatGPT компании могут добавить бизнес-профиль", w: "Заполните его сейчас, чтобы бренд правильно отображался в ответах ИИ." },
      { t: "Gemini автоматизировал анализ таблиц в Google Sheets", w: "Меньше времени на ручную сборку отчётов." },
      { t: "Новая модель изображений пишет текст на баннерах без ошибок", w: "Простые рекламные баннеры проще делать без дизайнера." },
    ],
  },
};

export default function WaitlistVisual() {
  const t = T[useDict().locale];
  const [joined, setJoined] = useState(false);

  return (
    <TgWindow title={t.title} sub={t.sub}>
      <div className="relative h-[440px] overflow-hidden">
        <div className="flex h-full flex-col justify-end gap-2.5 p-4 blur-[3px]" aria-hidden="true">
          {t.posts.map((p) => (
            <div key={p.t} className="rounded-[16px] rounded-bl-[4px] bg-[#262626] px-3.5 py-3 text-[14px] leading-[1.5]">
              <p className="font-semibold">{p.t}</p>
              <p className="mt-1.5 text-white/60">
                <span className="font-semibold text-white/80">{t.forYou}</span> {p.w}
              </p>
            </div>
          ))}
        </div>

        <div className="absolute inset-0 grid place-items-center bg-gradient-to-t from-[#121212] via-[#121212]/70 to-transparent p-6">
          <div className="w-full max-w-[300px] rounded-2xl border border-white/[0.1] bg-[#1d1d1d] p-6 text-center shadow-[0_20px_50px_-15px_rgba(0,0,0,.9)]">
            <p className="text-[13px] font-medium" style={{ color: Y }}>
              {t.soon}
            </p>
            <p className="mt-2 text-[18px] font-semibold leading-snug">{t.head}</p>
            {joined ? (
              <a href={BOT} className="anim-rise mt-5 block rounded-lg bg-white/[0.08] py-3 text-[14px] font-semibold">
                {t.joined}
              </a>
            ) : (
              <button onClick={() => setJoined(true)} className="btn-y mt-5 w-full rounded-lg py-3 text-[14px] font-semibold text-[#1c1c1c]" style={{ background: Y }}>
                {t.btn}
              </button>
            )}
          </div>
        </div>
      </div>
    </TgWindow>
  );
}
