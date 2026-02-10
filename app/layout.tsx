import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
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
    <html lang="uz">
      <body className={`${geistSans.variable} antialiased`}>
        <Header />
        <main className="mx-auto min-h-[calc(100vh-160px)] max-w-5xl px-5 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
