"use client";

import { useState } from "react";
import { BOT, Y } from "@/components/home/data";
import { TgWindow } from "./shared";

// AI kanali (tez orada): xira post ustida navbatga yozilish
const posts = [
  { t: "ChatGPT'da kompaniyalar o'z biznes profilini qo'sha oladigan bo'ldi", w: "Brendingiz AI javoblarida to'g'ri ko'rinishi uchun profilni hozirdan to'ldiring." },
  { t: "Gemini Google Sheets ichida jadval tahlilini avtomatlashtirdi", w: "Hisobotlarni qo'lda yig'ishga ketadigan vaqt qisqaradi." },
  { t: "Yangi rasm modeli matnli bannerlarni xatosiz chiza boshladi", w: "Oddiy reklama bannerlarini dizaynersiz tayyorlash osonlashadi." },
];

export default function WaitlistVisual() {
  const [joined, setJoined] = useState(false);

  return (
    <TgWindow title="Stepolog · Sun'iy intellekt" sub="kanal tez orada ochiladi">
      <div className="relative h-[440px] overflow-hidden">
        <div className="flex h-full flex-col justify-end gap-2.5 p-4 blur-[3px]" aria-hidden="true">
          {posts.map((p) => (
            <div key={p.t} className="rounded-[16px] rounded-bl-[4px] bg-[#262626] px-3.5 py-3 text-[14px] leading-[1.5]">
              <p className="font-semibold">{p.t}</p>
              <p className="mt-1.5 text-white/60">
                <span className="font-semibold text-white/80">Siz uchun:</span> {p.w}
              </p>
            </div>
          ))}
        </div>

        <div className="absolute inset-0 grid place-items-center bg-gradient-to-t from-[#121212] via-[#121212]/70 to-transparent p-6">
          <div className="w-full max-w-[300px] rounded-2xl border border-white/[0.1] bg-[#1d1d1d] p-6 text-center shadow-[0_20px_50px_-15px_rgba(0,0,0,.9)]">
            <p className="text-[13px] font-medium" style={{ color: Y }}>
              Tez orada
            </p>
            <p className="mt-2 text-[18px] font-semibold leading-snug">Kanal ochilganda birinchilardan bilasiz</p>
            {joined ? (
              <a href={BOT} className="anim-rise mt-5 block rounded-lg bg-white/[0.08] py-3 text-[14px] font-semibold">
                ✓ Navbatdasiz · botda tasdiqlang
              </a>
            ) : (
              <button onClick={() => setJoined(true)} className="btn-y mt-5 w-full rounded-lg py-3 text-[14px] font-semibold text-[#1c1c1c]" style={{ background: Y }}>
                Menga kerak
              </button>
            )}
          </div>
        </div>
      </div>
    </TgWindow>
  );
}
