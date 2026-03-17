"use client";

import { useEffect, useRef } from "react";

export default function MountainSketch({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const y = window.scrollY * 0.3;
      ref.current.style.transform = `translateY(${y}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Everest — main peak, sharp asymmetric summit */}
      <path
        d="M100 580 L200 420 L260 340 L310 260 L340 200 L360 155 L375 120 L385 95 L392 78 L398 70 L405 64 L410 58 L418 70 L425 85 L435 110 L450 145 L470 185 L500 240 L540 310 L600 400 L700 580"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* South Col ridge left */}
      <path
        d="M260 340 L240 350 L220 370 L200 420"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Ridge detail right */}
      <path
        d="M500 240 L520 250 L545 285 L560 310"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Snow/ice lines on peak */}
      <path
        d="M385 95 L395 110 L410 105 L425 115"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeDasharray="3 5"
        opacity="0.4"
      />
      <path
        d="M370 130 L390 140 L415 132 L440 150"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeDasharray="3 5"
        opacity="0.3"
      />
      <path
        d="M350 170 L380 178 L420 168 L460 190"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeDasharray="4 6"
        opacity="0.25"
      />

      {/* Lhotse — secondary peak behind right */}
      <path
        d="M480 580 L540 440 L570 370 L590 330 L600 310 L608 300 L615 310 L625 340 L640 390 L670 460 L720 580"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.25"
      />

      {/* Nuptse — ridge on left background */}
      <path
        d="M40 580 L120 450 L160 380 L185 350 L195 340 L205 345 L220 370 L240 420 L280 500 L340 580"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.15"
      />

      {/* Rock texture strokes on face */}
      <path d="M340 200 L355 220 L348 240" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <path d="M450 180 L440 210 L455 230" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <path d="M380 250 L395 280 L385 300" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      <path d="M430 260 L420 290 L435 310" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      <path d="M310 310 L325 340 L318 360" stroke="currentColor" strokeWidth="0.4" opacity="0.1" />
      <path d="M500 300 L490 330 L505 350" stroke="currentColor" strokeWidth="0.4" opacity="0.1" />
    </svg>
  );
}
