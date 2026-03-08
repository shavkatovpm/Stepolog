"use client";

import { useEffect, useState } from "react";

const phrases = [
  "Harakat qiling",
  "Rivojlaning",
  "Natijaga chiqing",
];

// All 6 logo rects — viewBox clips to show only left or right half
const logoRects = (
  <>
    <rect x="22" y="14" width="64" height="14" rx="2" fill="currentColor" />
    <rect x="72" y="24" width="14" height="24" fill="currentColor" />
    <rect x="14" y="43" width="20" height="14" rx="2" fill="currentColor" />
    <rect x="66" y="43" width="20" height="14" rx="2" fill="currentColor" />
    <rect x="14" y="52" width="14" height="24" fill="currentColor" />
    <rect x="14" y="72" width="64" height="14" rx="2" fill="currentColor" />
  </>
);

function LogoLeft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 100" fill="none" className={className}>
      {logoRects}
    </svg>
  );
}

function LogoRight({ className }: { className?: string }) {
  return (
    <svg viewBox="50 0 50 100" fill="none" className={className}>
      {logoRects}
    </svg>
  );
}

export default function AnimatedLogo({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Start closed, then open after 1s
    const openTimeout = setTimeout(() => setIsOpen(true), 1000);

    const interval = setInterval(() => {
      // Close
      setIsOpen(false);
      // Stay closed 1.5s, then swap text and reopen
      setTimeout(() => {
        setIndex((i) => (i + 1) % phrases.length);
        setTimeout(() => setIsOpen(true), 1500);
      }, 700);
    }, 6000);

    return () => {
      clearTimeout(openTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={className}>
      <div className="flex items-center justify-center">
        {/* Left half of logo */}
        <div className="shrink-0">
          <LogoLeft className="h-14 w-7 text-brand md:h-20 md:w-10 lg:h-24 lg:w-12" />
        </div>

        {/* Text wrapper — collapses to bring logos together */}
        <div
          className="relative flex h-14 items-center justify-center overflow-hidden transition-all duration-700 ease-[cubic-bezier(.4,0,.2,1)] md:h-20 lg:h-24"
          style={{
            maxWidth: isOpen ? 700 : 0,
          }}
        >
          {/* Top line */}
          <div className="absolute left-0 right-0 top-[14%] h-px bg-brand/30" />
          {/* Bottom line */}
          <div className="absolute bottom-[14%] left-0 right-0 h-px bg-brand/30" />

          <span className="shrink-0 translate-y-[0.05em] whitespace-nowrap px-4 font-display text-4xl uppercase leading-none tracking-wide text-brand md:px-6 md:text-6xl lg:text-7xl">
            {phrases[index]}
          </span>
        </div>

        {/* Right half of logo */}
        <div className="shrink-0">
          <LogoRight className="h-14 w-7 text-brand md:h-20 md:w-10 lg:h-24 lg:w-12" />
        </div>
      </div>
    </div>
  );
}
