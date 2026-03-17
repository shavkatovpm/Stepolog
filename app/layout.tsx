import type { Metadata } from "next";
import { Manrope, Bebas_Neue } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import { LayoutContent } from "@/components/LayoutContent";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Stepolog.uz — Startaplar uchun bilim platformasi",
    template: "%s | Stepolog.uz",
  },
  description:
    "O'zbekistondagi startaplar va yangi bizneslar uchun bilim, xizmat va PR platformasi. Blog, o'quv materiallar va agentliklar katalogi.",
  metadataBase: new URL("https://stepolog.uz"),
  openGraph: {
    siteName: "Stepolog.uz",
    locale: "uz_UZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="dark">
      <body className={`${manrope.variable} ${bebasNeue.variable} antialiased`}>
        <LayoutContent header={<Header />} footer={<Footer />}>
          {children}
        </LayoutContent>
      </body>
    </html>
  );
}
