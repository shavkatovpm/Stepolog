"use client";

import type { ReactNode } from "react";
import { Y } from "@/components/home/data";
import { useDict } from "@/components/home/i18n";
import { useSteps } from "./shared";

// Tarjima: inglizcha matnda muhim gaplar belgilanadi → o'zbekcha post yig'iladi
const TIMES = [800, 900, 900, 900, 800, 800];

function Hl({ on, n, children }: { on: boolean; n: number; children: ReactNode }) {
  return (
    <span
      className="rounded-[3px] transition-all duration-500"
      style={{ background: on ? "rgba(255,222,89,.9)" : "transparent", color: on ? "#1c1c1c" : undefined, boxShadow: on ? "0 0 0 2px rgba(255,222,89,.9)" : "none" }}
    >
      {on && <sup className="mr-0.5 font-bold">{n}</sup>}
      {children}
    </span>
  );
}

function Num({ n }: { n: number }) {
  return (
    <span className="mr-1.5 inline-grid h-[18px] w-[18px] place-items-center rounded-[4px] align-[2px] text-[11px] font-bold text-[#1c1c1c]" style={{ background: Y }}>
      {n}
    </span>
  );
}

const T = {
  uz: { src: "1 840 so'z · ~9 daqiqa", out: "62 so'z · ~30 soniya" },
  en: { src: "1,840 words · ~9 min", out: "62 words · ~30 sec · in Uzbek" },
  ru: { src: "1 840 слов · ~9 мин", out: "62 слова · ~30 сек · на узбекском" },
};

export default function TranslateVisual() {
  const t = T[useDict().locale];
  const [step] = useSteps(TIMES);

  return (
    <div className="relative">
      {/* Asl maqola */}
      <div className="rounded-2xl bg-[#f6f5f1] p-5 text-[#2a2a2a] shadow-[0_30px_80px_-30px_rgba(0,0,0,.8)] md:mr-16">
        <div className="flex items-center justify-between text-[11.5px] text-black/45">
          <span>blog.google · EN</span>
          <span>{t.src}</span>
        </div>
        <p className="mt-3 text-[16px] font-semibold leading-snug text-black">Introducing channel-level reporting for Performance Max</p>
        <p className="mt-2.5 text-[13px] leading-[1.65] text-black/55">
          Over the past year, we&apos;ve heard from many of you that understanding where your ads run is critical.{" "}
          <Hl on={step >= 1} n={1}>Advertisers can now see performance by channel, including Search, YouTube and Discover.</Hl> The report is available in
          the Insights tab. <Hl on={step >= 2} n={2}>It helps identify which channels may need budget adjustments.</Hl> Learn more in the{" "}
          <Hl on={step >= 3} n={3}>Help Center</Hl>.
        </p>
      </div>

      {/* O'zbekcha post */}
      <div
        className={`relative -mt-6 ml-6 rounded-2xl border border-white/[0.1] bg-[#232323] p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,.9)] transition-all duration-500 md:ml-20 ${
          step >= 4 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between text-[11.5px] text-white/45">
          <span style={{ color: Y }}>Stepolog · UZ</span>
          <span>{t.out}</span>
        </div>
        <p className="mt-3 text-[14.5px] font-semibold leading-snug">
          <Num n={1} />
          Google Ads&apos;da Performance Max uchun kanal hisobotlari ochildi
        </p>
        <p className={`mt-2 text-[13.5px] leading-[1.55] text-white/70 transition-opacity duration-500 ${step >= 5 ? "opacity-100" : "opacity-0"}`}>
          <Num n={2} />
          <span className="font-semibold text-white">Siz uchun:</span> byudjetning qaysi qismi samarasiz ketayotganini endi aniq ko&apos;rasiz.
        </p>
        <p className={`mt-2 text-[13px] transition-opacity duration-500 ${step >= 6 ? "opacity-100" : "opacity-0"}`} style={{ color: Y }}>
          <Num n={3} />
          Google Ads Blog ↗
        </p>
      </div>
    </div>
  );
}
