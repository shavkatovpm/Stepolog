"use client";

import { useEffect, useRef } from "react";

const LINES = 5;

export default function StepsAnimation({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight;
      const progress = Math.min(scrollY / maxScroll, 1);

      ref.current.style.transform = `translateY(${scrollY * 0.15}px)`;

      const lines = ref.current.querySelectorAll<SVGPathElement>("[data-line]");
      lines.forEach((line) => {
        const index = Number(line.dataset.line);
        const totalLength = line.getTotalLength();
        const lineProgress = Math.min(Math.max((progress - index * 0.1) * 2.5, 0), 1);
        const drawLength = totalLength * lineProgress;
        line.style.strokeDasharray = `${drawLength} ${totalLength}`;
      });

      const dot = ref.current.querySelector<SVGElement>("[data-dot]");
      if (dot) {
        const mainLine = lines[2];
        if (mainLine) {
          const totalLength = mainLine.getTotalLength();
          const point = mainLine.getPointAtLength(totalLength * progress);
          dot.setAttribute("cx", String(point.x));
          dot.setAttribute("cy", String(point.y));
          dot.style.opacity = String(Math.min(progress * 4, 1));
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 600 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Diagonal lines ascending from bottom-right to top-left */}
      {Array.from({ length: LINES }, (_, i) => {
        const offset = i * 70;
        const opacity = i === 2 ? 0.12 : 0.04 + Math.abs(2 - i) * 0.01;
        const strokeWidth = i === 2 ? 2.5 : 1;
        return (
          <path
            key={i}
            data-line={i}
            d={`M${520 + offset} 780 Q${350 + offset * 0.3} 500 ${280 + offset * 0.2} 400 Q${200 + offset * 0.1} 280 ${80 + offset * 0.5} 20`}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray="0 9999"
            opacity={opacity}
          />
        );
      })}

      {/* Horizontal accent marks crossing the lines */}
      {[200, 350, 520, 650].map((y, i) => (
        <line
          key={`h${i}`}
          x1={140 + i * 40}
          y1={y}
          x2={220 + i * 40}
          y2={y}
          stroke="currentColor"
          strokeWidth={1}
          opacity={0.04}
        />
      ))}

      {/* Climbing dot on the main (middle) line */}
      <circle
        data-dot
        cx={520}
        cy={780}
        r={5}
        fill="currentColor"
        opacity={0}
      />

      {/* Logo at the top */}
      <g opacity={0.1} transform="translate(55, -10)">
        <rect x="13" y="8" width="38" height="8" rx="1" fill="currentColor" />
        <rect x="43" y="14" width="8" height="14" fill="currentColor" />
        <rect x="8" y="26" width="12" height="8" rx="1" fill="currentColor" />
        <rect x="40" y="26" width="12" height="8" rx="1" fill="currentColor" />
        <rect x="8" y="32" width="8" height="14" fill="currentColor" />
        <rect x="8" y="44" width="38" height="8" rx="1" fill="currentColor" />
      </g>
    </svg>
  );
}
