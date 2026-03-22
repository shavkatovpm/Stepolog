"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import StepologLogo from "@/components/StepologLogo";

const navLinks = [
  { href: "/learn", label: "Startap asoslari" },
  { href: "/kasblar", label: "Kasblar xaritasi" },
  { href: "/blog", label: "Maqolalar" },
  { href: "/about", label: "Haqimizda" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Tashqariga bosilganda yoki scroll qilganda menyu yopilsin
  useEffect(() => {
    if (!mobileOpen) return;
    const close = () => setMobileOpen(false);
    window.addEventListener("scroll", close, { passive: true });
    document.addEventListener("touchstart", handleOutsideTouch);
    document.addEventListener("mousedown", handleOutsideTouch);
    function handleOutsideTouch(e: Event) {
      const header = document.querySelector("header");
      if (header && !header.contains(e.target as Node)) close();
    }
    return () => {
      window.removeEventListener("scroll", close);
      document.removeEventListener("touchstart", handleOutsideTouch);
      document.removeEventListener("mousedown", handleOutsideTouch);
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 animate-fade-in bg-background/80 px-5 py-6 backdrop-blur-xl md:px-20">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <StepologLogo size={30} className="text-brand" />
          <span className="font-display text-[28px] tracking-[.08em] text-brand">STEPOLOG</span>
        </Link>

        {/* Desktop nav — centered */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] font-medium transition-colors ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-strong hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-md md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menyu"
        >
          <div className="flex w-[18px] flex-col gap-[5px]">
            <span
              className={`h-[2px] w-full bg-foreground transition-all duration-300 ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`h-[2px] w-full bg-foreground transition-all duration-300 ${mobileOpen ? "scale-0 opacity-0" : ""}`}
            />
            <span
              className={`h-[2px] w-full bg-foreground transition-all duration-300 ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile nav */}
      <div
        className={`absolute left-0 right-0 top-full border-b border-border bg-background backdrop-blur-xl transition-all duration-300 md:hidden ${
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-2 px-5 py-4">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-md border border-border px-3 py-3 text-center text-[13px] font-medium transition-colors ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-strong hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
