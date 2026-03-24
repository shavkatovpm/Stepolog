export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <svg
        width={48}
        height={48}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-brand animate-[loading-pulse_1.2s_ease-in-out_infinite]"
      >
        <rect x="22" y="14" width="64" height="14" rx="2" fill="currentColor" />
        <rect x="72" y="24" width="14" height="24" fill="currentColor" />
        <rect x="14" y="43" width="20" height="14" rx="2" fill="currentColor" />
        <rect x="66" y="43" width="20" height="14" rx="2" fill="currentColor" />
        <rect x="14" y="52" width="14" height="24" fill="currentColor" />
        <rect x="14" y="72" width="64" height="14" rx="2" fill="currentColor" />
      </svg>
    </div>
  );
}
