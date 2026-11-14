"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { landingLinks, landingPath, soonLabel, type LandingLink } from "@/content/landing/links";
import { BOT, Y } from "./data";
import { useDict } from "./i18n";
import LangSwitcher from "./LangSwitcher";

// Imkoniyat sahifalari hozircha faqat o'zbekcha
function FeaturesMenu({ label, links, soon, locale }: { label: string; links: LandingLink[]; soon: string; locale: "en" | "uz" | "ru" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-1.5 py-2 transition-colors ${open ? "text-white" : "hover:text-white"}`}
      >
        {label}
        <svg width="10" height="10" viewBox="0 0 10 10" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true">
          <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        className={`absolute left-1/2 top-full w-[540px] -translate-x-1/2 pt-3 transition-all duration-200 ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/[0.1] bg-[#232323] p-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,.8)]">
          {links.map((l) => (
            <Link key={l.slug} href={landingPath(locale, l.slug)} onClick={() => setOpen(false)} className="group rounded-lg p-3 transition-colors hover:bg-white/[0.05]">
              <span className="flex items-center gap-2 text-[14px] font-semibold text-white">
                <span className="transition-colors group-hover:text-[#FFDE59]">{l.nav}</span>
                {l.status === "soon" && <span className="rounded px-1 text-[10.5px] font-medium text-white/45 ring-1 ring-white/15">{soon}</span>}
              </span>
              <span className="mt-1 block text-[12.5px] leading-snug text-white/45">{l.short}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const t = useDict();
  const feats = landingLinks[t.locale];
  const soon = soonLabel[t.locale];
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [featOpen, setFeatOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Menyu ochiq paytda sahifa scroll bo'lmasin
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Ixcham navbar: faqat kerakli bo'limlar
  const links = [
    { href: `${t.path}#sohalar`, label: t.nav.fields },
    { href: `${t.path}#narx`, label: t.nav.pricing },
    { href: `${t.path}#savollar`, label: t.nav.faq },
  ];

  return (
    <>
      {/* Scroll qilinganda kichrayib, yumaloq va xira fonli panelga aylanadi */}
      <header className="sticky top-0 z-40 px-3 md:px-4">
        <div
          className={`mx-auto flex items-center justify-between gap-4 border transition-all duration-300 ease-out ${
            scrolled || open
              ? "mt-2.5 h-14 max-w-[1100px] rounded-2xl border-white/[0.1] bg-[#1c1c1c]/70 px-4 shadow-[0_12px_40px_-12px_rgba(0,0,0,.75)] backdrop-blur-xl backdrop-saturate-150 md:mt-3"
              : "mt-0 h-16 max-w-[1160px] rounded-none border-transparent bg-transparent px-2"
          }`}
        >
          <a href={t.path} aria-label="Stepolog" onClick={() => setOpen(false)}>
            <Logo />
          </a>
          <nav className="hidden items-center gap-7 text-[14px] text-white/60 lg:flex">
            <FeaturesMenu label={t.nav.features} links={feats} soon={soon} locale={t.locale} />
            {links.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-white">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <LangSwitcher />
            <a href={BOT} className="btn-y hidden rounded-lg px-4 py-2 text-[14px] font-semibold text-[#1c1c1c] sm:inline-block" style={{ background: Y }}>
              {t.nav.openBot}
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
              aria-expanded={open}
              className="relative grid h-10 w-10 place-items-center rounded-lg bg-white/[0.06] lg:hidden"
            >
              <span className={`absolute h-[2px] w-[18px] rounded bg-white transition-all duration-300 ${open ? "rotate-45" : "-translate-y-[5px]"}`} />
              <span className={`absolute h-[2px] w-[18px] rounded bg-white transition-all duration-300 ${open ? "-rotate-45" : "translate-y-[5px]"}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobil menyu */}
      <div
        className={`fixed inset-0 z-30 overflow-y-auto bg-[#1c1c1c]/95 pt-[72px] backdrop-blur-xl transition-all duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="mx-auto flex min-h-full max-w-[1160px] flex-col px-5 pb-8">
          {(
            <div className="border-b border-white/[0.08]">
              <button
                onClick={() => setFeatOpen((v) => !v)}
                aria-expanded={featOpen}
                className="flex w-full items-center justify-between py-4 text-[24px] font-semibold tracking-[-0.02em]"
              >
                {t.nav.features}
                <svg width="16" height="16" viewBox="0 0 10 10" className={`text-white/50 transition-transform duration-300 ${featOpen ? "rotate-180" : ""}`} aria-hidden="true">
                  <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className={`grid transition-all duration-300 ${featOpen ? "grid-rows-[1fr] pb-4 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  {feats.map((l) => (
                    <Link
                      key={l.slug}
                      href={landingPath(t.locale, l.slug)}
                      onClick={() => setOpen(false)}
                      className="flex items-start justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
                    >
                      <span>
                        <span className="block text-[16px] font-medium">{l.nav}</span>
                        <span className="mt-0.5 block text-[13px] text-white/45">{l.short}</span>
                      </span>
                      {l.status === "soon" && <span className="mt-1 shrink-0 text-[11px] text-white/40">{soon}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`border-b border-white/[0.08] py-4 text-[24px] font-semibold tracking-[-0.02em] transition-all duration-300 ${
                open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${60 + i * 40}ms` : "0ms" }}
            >
              {l.label}
            </a>
          ))}
          <div className="mt-auto pt-8">
            <a href={BOT} className="block rounded-md py-4 text-center text-[16px] font-semibold text-[#1c1c1c]" style={{ background: Y }}>
              {t.nav.openBot}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
