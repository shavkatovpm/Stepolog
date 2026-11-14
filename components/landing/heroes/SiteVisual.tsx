"use client";

import { LogoMark } from "@/components/Logo";
import { Y } from "@/components/home/data";
import { useDict } from "@/components/home/i18n";
import { useSteps } from "./shared";

// Sayt kuzatish: URL yoziladi → ro'yxatga qo'shiladi → yangi maqola xabari
const URL = "blog.hubspot.com/marketing";
const TIMES = [400, ...Array(URL.length).fill(55), 600, 1400, 900];
const SITES = ["blog.google/products/ads", "about.fb.com/news"];

const T = {
  uz: { add: "Kuzatiladigan sayt qo'shish", btn: "Qo'shish", tracking: "Kuzatuvda", fresh: "yangi", checked: "tekshirildi", ago: ["2 daq oldin", "6 daq oldin"], rss: "RSS shart emas: sitemap va sahifa o'zgarishlari ham kuzatiladi", now: "hozir", toast: "Yangi maqola: 2026-yilgi email marketing hisoboti chiqdi", toastSub: "blog.hubspot.com · qisqa mazmuni o'zbek tilida" },
  en: { add: "Add a site to track", btn: "Add", tracking: "Tracking", fresh: "new", checked: "checked", ago: ["2 min ago", "6 min ago"], rss: "No RSS needed: sitemaps and page changes are tracked too", now: "now", toast: "New article: the 2026 email marketing report is out", toastSub: "blog.hubspot.com · short summary in Uzbek" },
  ru: { add: "Добавить сайт для отслеживания", btn: "Добавить", tracking: "Отслеживаются", fresh: "новый", checked: "проверено", ago: ["2 мин назад", "6 мин назад"], rss: "RSS не нужен: отслеживаются sitemap и изменения страниц", now: "сейчас", toast: "Новая статья: вышел отчёт по email-маркетингу 2026", toastSub: "blog.hubspot.com · краткое содержание на узбекском" },
};

export default function SiteVisual() {
  const t = T[useDict().locale];
  const [step] = useSteps(TIMES);
  const typed = Math.max(0, Math.min(URL.length, step - 1));
  const added = step >= URL.length + 2;
  const toast = step >= URL.length + 3;

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121212] shadow-[0_30px_80px_-30px_rgba(0,0,0,.8)]">
        <div className="border-b border-white/[0.06] bg-[#1d1d1d] px-5 py-4">
          <p className="text-[13px] text-white/45">{t.add}</p>
          <div className="mt-2.5 flex items-center gap-2">
            <div className="flex h-11 flex-1 items-center rounded-lg border border-white/[0.12] bg-black/30 px-3.5 text-[14.5px]">
              <span className="text-white/35">https://</span>
              <span>{URL.slice(0, typed)}</span>
              {!added && <span className="ml-px inline-block h-4 w-px animate-pulse bg-white" />}
            </div>
            <span
              className="grid h-11 shrink-0 place-items-center rounded-lg px-4 text-[14px] font-semibold text-[#1c1c1c] transition-transform"
              style={{ background: Y, transform: step === URL.length + 1 ? "scale(0.95)" : "none" }}
            >
              {t.btn}
            </span>
          </div>
        </div>

        <div className="px-5 py-4">
          <p className="text-[13px] text-white/45">{t.tracking}</p>
          <ul className="mt-2">
            {added && (
              <li className="anim-rise flex items-center justify-between border-b border-white/[0.06] py-3 text-[14.5px]">
                <span className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: Y, boxShadow: "0 0 0 3px rgba(255,222,89,.18)" }} />
                  {URL}
                </span>
                <span className="text-[12.5px]" style={{ color: Y }}>{t.fresh}</span>
              </li>
            )}
            {SITES.map((host, i) => (
              <li key={host} className="flex items-center justify-between border-b border-white/[0.06] py-3 text-[14.5px] last:border-0">
                <span className="flex items-center gap-2.5 text-white/80">
                  <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                  {host}
                </span>
                <span className="text-[12.5px] text-white/35">{t.checked} · {t.ago[i]}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2.5 text-[12.5px] text-white/50">
            {t.rss}
          </div>
        </div>
      </div>

      {/* Telegram bildirishnomasi */}
      <div
        className={`absolute -bottom-6 left-4 right-4 rounded-2xl border border-white/[0.1] bg-[#2a2a2a]/95 p-4 shadow-[0_20px_50px_-15px_rgba(0,0,0,.9)] backdrop-blur transition-all duration-500 md:-right-6 md:left-auto md:w-[330px] ${
          toast ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-[#1c1c1c]">
            <LogoMark size={12} />
          </span>
          <span className="text-[12.5px] font-semibold">Stepolog</span>
          <span className="ml-auto text-[11.5px] text-white/45">{t.now}</span>
        </div>
        <p className="mt-2 text-[13.5px] font-semibold leading-snug">{t.toast}</p>
        <p className="mt-1 text-[12.5px] text-white/55">{t.toastSub}</p>
      </div>
    </div>
  );
}
