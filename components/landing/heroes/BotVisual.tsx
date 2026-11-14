"use client";

import { Y } from "@/components/home/data";
import { bubble, TgWindow, Typing, useSteps } from "./shared";

// Bot: /start → soha tanlash → kechki dayjest
const TIMES = [700, 900, 1000, 1100, 900, 1000, 1200];
const fields = [
  { name: "Marketing", open: true },
  { name: "Sun'iy intellekt", open: false },
  { name: "Dasturlash", open: false },
  { name: "Dizayn", open: false },
];

export default function BotVisual() {
  const [step] = useSteps(TIMES);
  const typing = step === 1 || step === 4 || step === 5;

  return (
    <TgWindow title="Stepolog" sub={typing ? <span style={{ color: Y }}>yozmoqda...</span> : "bot"}>
      <div className="flex h-[460px] flex-col justify-end gap-2.5 overflow-hidden p-4">
        {step >= 1 && (
          <div className="anim-rise ml-auto rounded-[16px] rounded-br-[4px] px-3.5 py-2 text-[14px] font-medium text-[#1c1c1c]" style={{ background: Y }}>
            /start
          </div>
        )}
        {step >= 2 && (
          <div className="anim-rise max-w-[88%]">
            <div className={bubble}>Assalomu alaykum! Qaysi soha yangiliklarini yuboray?</div>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5">
              {fields.map((f, i) => {
                const picked = step >= 3 && i === 0;
                return (
                  <span
                    key={f.name}
                    className={`rounded-lg px-2 py-2 text-center text-[13px] font-medium transition-all duration-300 ${
                      picked ? "text-[#1c1c1c]" : f.open ? "bg-white/[0.1]" : "bg-white/[0.05] text-white/40"
                    }`}
                    style={picked ? { background: Y } : undefined}
                  >
                    {picked ? "✓ " : ""}
                    {f.name}
                    {!f.open && <span className="block text-[10.5px] text-white/30">tez orada</span>}
                  </span>
                );
              })}
            </div>
          </div>
        )}
        {step >= 4 && (
          <div className={`anim-rise max-w-[88%] ${bubble}`}>
            Tayyor. Har kuni soat 20:00 da eng muhim marketing yangiliklarini yuboraman.
          </div>
        )}
        {step >= 6 && (
          <div className={`anim-rise max-w-[92%] ${bubble}`}>
            <p className="text-[12px] text-white/45">20:00 · Bugungi dayjest</p>
            <p className="mt-1.5 font-semibold">1. Google Ads&apos;da Performance Max uchun kanal hisobotlari ochildi</p>
            <p className="mt-1 text-white/65">Byudjet qayerga ketayotgani endi aniq ko&apos;rinadi.</p>
            <p className="mt-2 font-semibold">2. Instagram original kontentga ustunlik beradi</p>
            <p className="mt-1 text-white/65">Repost qiladigan sahifalarda qamrov tushishi mumkin.</p>
          </div>
        )}
        {typing && <Typing />}
      </div>
    </TgWindow>
  );
}
