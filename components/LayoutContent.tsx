"use client";

import { usePathname } from "next/navigation";

export function LayoutContent({
  children,
  header,
  footer,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const isModad = pathname.startsWith("/modad");

  if (isModad) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      <main>{children}</main>
      {footer}
    </>
  );
}
