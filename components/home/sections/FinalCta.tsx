"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { landingLinks, landingPath } from "@/content/landing/links";
import { BOT, Y } from "../data";
import { useDict } from "../i18n";
import { Reveal } from "../ui";

// Yakun: katta tipografiya va ustunli footer
export default function FinalCta() {
  const t = useDict();
  const sections = [
    { href: `${t.path}#post`, label: t.nav.post },
    { href: `${t.path}#jarayon`, label: t.nav.flow },
    { href: `${t.path}#kun`, label: t.nav.plans },
    { href: `${t.path}#sohalar`, label: t.nav.fields },
    { href: `${t.path}#narx`, label: t.nav.pricing },
    { href: `${t.path}#savollar`, label: t.nav.faq },
  ];
  const head = "text-[13px] font-medium text-white/35";
  const link = "text-[14.5px] text-white/65 transition-colors hover:text-white";

  return (
    <footer className="border-t border-white/[0.08]">
      <div className="mx-auto max-w-[1160px] px-5 pb-10 pt-16 md:pt-32">
        <Reveal>
          <p className="max-w-[900px] text-balance text-[34px] font-semibold leading-[1.06] tracking-[-0.04em] md:text-[80px] md:leading-[1.02]">
            {t.final.pre}
            <span style={{ color: Y }}>{t.final.hl}</span>
            {t.final.post}
          </p>
          <a href={BOT} className="btn-y mt-12 inline-flex items-center gap-3 rounded-md px-8 py-4 text-[16px] font-semibold text-[#1c1c1c]" style={{ background: Y }}>
            {t.final.cta} <span aria-hidden>→</span>
          </a>
        </Reveal>

        <div className={`mt-20 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/[0.08] pt-12 md:mt-28 lg:grid-cols-[1.2fr_1.3fr_1fr_0.8fr]`}>
          <div className="col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-[260px] text-[14px] leading-[1.6] text-white/45">{t.footer.tagline}</p>
          </div>

          {(
            <div className="col-span-2 lg:col-span-1">
              <p className={head}>{t.nav.features}</p>
              <ul className="mt-4 space-y-2.5">
                {landingLinks[t.locale].map((l) => (
                  <li key={l.slug}>
                    <Link href={landingPath(t.locale, l.slug)} className={link}>
                      {l.nav}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className={head}>{t.footer.sections}</p>
            <ul className="mt-4 space-y-2.5">
              {sections.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className={link}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={head}>{t.footer.contact}</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href={BOT} className={link}>
                  @stepologbot
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-14 text-[13px] text-white/35">{t.final.rights}</p>
      </div>
    </footer>
  );
}
