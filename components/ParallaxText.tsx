"use client";

import { useEffect, useRef } from "react";

export default function ParallaxText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const y = window.scrollY * 0.3;
      ref.current.style.transform = `translateY(calc(-50% + ${y}px)) rotate(90deg)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
