import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stepolog — Moded",
  robots: { index: false, follow: false },
};

export default function ModadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="modad-root">
      {children}
    </div>
  );
}
