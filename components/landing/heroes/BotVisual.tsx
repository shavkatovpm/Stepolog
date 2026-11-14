"use client";

import { Y } from "@/components/home/data";
import { useDict } from "@/components/home/i18n";
import { bubble, TgWindow, Typing, useSteps } from "./shared";

// Bot: /start → soha tanlash → kechki dayjest
const TIMES = [700, 900, 1000, 1100, 900, 1000, 1200];

const T = {
  uz: {
    typing: "yozmoqda...",
    hello: "Assalomu alaykum! Qaysi soha yangiliklarini yuboray?",
    fields: ["Marketing", "Sun'iy intellekt", "Dasturlash", "Dizayn"],
    soon: "tez orada",
    ready: "Tayyor. Har kuni soat 20:00 da eng muhim marketing yangiliklarini yuboraman.",
    digest: "20:00 · Bugungi dayjest",
    items: [
      ["Google Ads'da Performance Max uchun kanal hisobotlari ochildi", "Byudjet qayerga ketayotgani endi aniq ko'rinadi."],
      ["Instagram original kontentga ustunlik beradi", "Repost qiladigan sahifalarda qamrov tushishi mumkin."],
    ],
  },
  en: {
    typing: "typing...",
    hello: "Hi! Which field should I send news about?",
    fields: ["Marketing", "AI", "Development", "Design"],
    soon: "coming soon",
    ready: "Done. Every day at 20:00 I'll send you the most important marketing news.",
    digest: "20:00 · Today's digest",
    items: [
      ["Google Ads opens channel-level reporting for Performance Max", "You can now see exactly where the budget goes."],
      ["Instagram will favor original content", "Pages built on reposts may see lower reach."],
    ],
  },
  ru: {
    typing: "печатает...",
    hello: "Здравствуйте! Новости какой сферы присылать?",
    fields: ["Маркетинг", "ИИ", "Разработка", "Дизайн"],
    soon: "скоро",
    ready: "Готово. Каждый день в 20:00 буду присылать главные новости маркетинга.",
    digest: "20:00 · Дайджест за сегодня",
    items: [
      ["В Google Ads появились отчёты по каналам для Performance Max", "Теперь видно, куда уходит бюджет."],
      ["Instagram будет продвигать оригинальный контент", "У страниц с репостами может упасть охват."],
    ],
  },
};

export default function BotVisual() {
  const t = T[useDict().locale];
  const [step] = useSteps(TIMES);
  const typing = step === 1 || step === 4 || step === 5;

  return (
    <TgWindow title="Stepolog" sub={typing ? <span style={{ color: Y }}>{t.typing}</span> : "bot"}>
      <div className="flex h-[440px] flex-col justify-end gap-2.5 overflow-hidden p-4 md:h-[460px]">
        {step >= 1 && (
          <div className="anim-rise ml-auto rounded-[16px] rounded-br-[4px] px-3.5 py-2 text-[14px] font-medium text-[#1c1c1c]" style={{ background: Y }}>
            /start
          </div>
        )}
        {step >= 2 && (
          <div className="anim-rise max-w-[90%]">
            <div className={bubble}>{t.hello}</div>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5">
              {t.fields.map((name, i) => {
                const picked = step >= 3 && i === 0;
                const open = i === 0;
                return (
                  <span
                    key={name}
                    className={`rounded-lg px-2 py-2 text-center text-[13px] font-medium transition-all duration-300 ${
                      picked ? "text-[#1c1c1c]" : open ? "bg-white/[0.1]" : "bg-white/[0.05] text-white/40"
                    }`}
                    style={picked ? { background: Y } : undefined}
                  >
                    {picked ? "✓ " : ""}
                    {name}
                    {!open && <span className="block text-[10.5px] text-white/30">{t.soon}</span>}
                  </span>
                );
              })}
            </div>
          </div>
        )}
        {step >= 4 && <div className={`anim-rise max-w-[90%] ${bubble}`}>{t.ready}</div>}
        {step >= 6 && (
          <div className={`anim-rise max-w-[94%] ${bubble}`}>
            <p className="text-[12px] text-white/45">{t.digest}</p>
            {t.items.map(([h, d], i) => (
              <div key={h} className={i ? "mt-2" : "mt-1.5"}>
                <p className="font-semibold">
                  {i + 1}. {h}
                </p>
                <p className="mt-1 text-white/65">{d}</p>
              </div>
            ))}
          </div>
        )}
        {typing && <Typing />}
      </div>
    </TgWindow>
  );
}
