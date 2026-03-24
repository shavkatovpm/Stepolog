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
    default: "Stepolog.uz — O'zbekiston digital ekotizimi uchun bepul bilim platformasi",
    template: "%s | Stepolog.uz",
  },
  description:
    "O'zbekiston digital ekotizimi uchun bepul bilim platformasi. Startaplar, kasblar xaritasi va foydali maqolalar.",
  metadataBase: new URL("https://stepolog.uz"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: "Stepolog.uz",
    locale: "uz_UZ",
    type: "website",
    url: "https://stepolog.uz",
    title: "Stepolog.uz — Bepul bilim platformasi",
    description:
      "O'zbekiston digital ekotizimi uchun bepul bilim platformasi. Startaplar, kasblar xaritasi va maqolalar.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stepolog.uz — Bepul bilim platformasi",
    description:
      "O'zbekiston digital ekotizimi uchun bepul bilim platformasi. Startaplar, kasblar xaritasi va maqolalar.",
  },
  keywords: [
    "stepolog",
    "startap",
    "startup",
    "o'zbekiston",
    "uzbekistan",
    "IT",
    "bilim platformasi",
    "biznes",
    "tadbirkorlik",
    "investitsiya",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Stepolog",
              url: "https://stepolog.uz",
              logo: "https://stepolog.uz/icon.png",
              description:
                "O'zbekiston digital ekotizimi uchun bepul bilim platformasi.",
              sameAs: [
                "https://t.me/stepolog",
                "https://instagram.com/stepolog.uz",
              ],
            }),
          }}
        />
      </head>
      <body className={`${manrope.variable} ${bebasNeue.variable} antialiased`}>
        <LayoutContent header={<Header />} footer={<Footer />}>
          {children}
        </LayoutContent>
      </body>
    </html>
  );
}
