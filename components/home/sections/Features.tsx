"use client";

import Link from "next/link";
import { landingLinks, landingPath, soonLabel } from "@/content/landing/links";
import { useDict } from "../i18n";
import { Reveal } from "../ui";

// Imkoniyatlar: alohida sahifalarga havolalar (hozircha faqat /uz)
export default function Features() {
  const t = useDict();

  return (
    <section id="imkoniyatlar" className="scroll-mt-16 border-t border-white/[0.08]">
      <div className="mx-auto max-w-[1160px] px-5 py-16 md:py-32">
        <Reveal className="grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-end">
          <h2 className="text-balance text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] md:text-[48px]">{t.features.title}</h2>
          <p className="max-w-[400px] text-[16px] leading-[1.6] text-white/55 md:justify-self-end">
            {t.features.sub}
          </p>
        </Reveal>

        <div className="mt-10 md:mt-14 grid border-t border-white/[0.1] md:grid-cols-2 md:gap-x-16">
          {landingLinks[t.locale].map((l, i) => (
            <Reveal key={l.slug} delay={(i % 2) * 80}>
              <Link href={landingPath(t.locale, l.slug)} className="group flex items-start justify-between gap-6 border-b border-white/[0.1] py-7">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-[21px] font-semibold tracking-[-0.02em] transition-colors group-hover:text-[#FFDE59]">{l.nav}</h3>
                    {l.status === "soon" && <span className="shrink-0 rounded px-1.5 py-0.5 text-[11.5px] text-white/50 ring-1 ring-white/15">{soonLabel[t.locale]}</span>}
                  </div>
                  <p className="mt-2 text-[15px] leading-[1.6] text-white/50">{l.short}</p>
                </div>
                <span className="pt-1 text-[22px] text-white/30 transition-all group-hover:translate-x-1 group-hover:text-[#FFDE59]">→</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
