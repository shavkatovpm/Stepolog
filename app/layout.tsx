import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://stepolog.uz"),
  title: "Stepolog",
  description: "Marketing yangiliklari o'zbek tilida. Tez orada.",
  verification: { google: "uHzs5xDnmIRQFWpvv1SNaeYqjbCpVW1rX0hQ5pFMi6o" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
