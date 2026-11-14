import { useId } from "react";

// Bayroqlar SVG: emoji bayroqlar Windows'da ko'rinmaydi
type P = { className?: string };

export function FlagUZ({ className }: P) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#fff" />
      <rect width="30" height="6.4" fill="#0099B5" />
      <rect y="13.6" width="30" height="6.4" fill="#1EB53A" />
      <rect y="6.4" width="30" height="0.6" fill="#CE1126" />
      <rect y="13" width="30" height="0.6" fill="#CE1126" />
      <circle cx="5.2" cy="3.2" r="2.1" fill="#fff" />
      <circle cx="6" cy="3.2" r="2.1" fill="#0099B5" />
    </svg>
  );
}

export function FlagRU({ className }: P) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="6.67" fill="#fff" />
      <rect y="6.67" width="30" height="6.67" fill="#0039A6" />
      <rect y="13.33" width="30" height="6.67" fill="#D52B1E" />
    </svg>
  );
}

export function FlagGB({ className }: P) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <clipPath id={`gb-t-${id}`}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#gb-t-${id})`} stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}
