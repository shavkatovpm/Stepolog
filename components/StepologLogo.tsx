export default function StepologLogo({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Top bar */}
      <rect x="22" y="14" width="64" height="14" rx="2" fill="currentColor" />
      {/* Right connector — extended to overlap into middle right block */}
      <rect x="72" y="24" width="14" height="24" fill="currentColor" />
      {/* Middle left block */}
      <rect x="14" y="43" width="20" height="14" rx="2" fill="currentColor" />
      {/* Middle right block */}
      <rect x="66" y="43" width="20" height="14" rx="2" fill="currentColor" />
      {/* Left connector — extended to overlap into middle left block */}
      <rect x="14" y="52" width="14" height="24" fill="currentColor" />
      {/* Bottom bar */}
      <rect x="14" y="72" width="64" height="14" rx="2" fill="currentColor" />
    </svg>
  );
}
