// Stepolog brend belgisi: ramka. Logo/Stepolog (16).png asosida.
export function LogoMark({ size = 24, color = "#FFDE59" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="24 26 52 48" fill={color} aria-hidden="true">
      <path d="M24 26.2H76V37H68.3V31.6H31.6V37H24Z" />
      <rect x="24" y="44.6" width="7.6" height="10.8" />
      <rect x="68.4" y="44.6" width="7.6" height="10.8" />
      <path d="M24 63H31.6V68.3H68.3V63H76V74H24Z" />
    </svg>
  );
}

export function Logo({ color = "#FFDE59", textClass = "" }: { color?: string; textClass?: string }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={22} color={color} />
      <span className={`text-[17px] font-semibold tracking-[-0.01em] ${textClass}`}>stepolog</span>
    </span>
  );
}
