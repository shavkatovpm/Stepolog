import type { ReactNode } from "react";
import { Manrope, Bebas_Neue } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uz" className="dark">
      <head>
        <meta name="google-site-verification" content="uHzs5xDnmIRQFWpvv1SNaeYqjbCpVW1rX0hQ5pFMi6o" />
      </head>
      <body className={`${manrope.variable} ${bebasNeue.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
