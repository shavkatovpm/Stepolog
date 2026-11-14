import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Onest } from "next/font/google";
import { DictProvider } from "@/components/home/i18n";
import { getDict, isLocale, LOCALES } from "@/components/home/i18n/server";
import "../globals.css";

const onest = Onest({ subsets: ["latin", "cyrillic"], variable: "--f-onest" });

// "/" inglizcha (proxy /en ga ichkaridan yo'naltiradi), "/uz", "/ru"
export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDict(locale);
  return {
    metadataBase: new URL("https://stepolog.uz"),
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: t.path,
      languages: { en: "/", uz: "/uz", ru: "/ru", "x-default": "/" },
    },
    openGraph: { title: t.meta.title, description: t.meta.description, url: t.path, siteName: "Stepolog", locale },
    verification: { google: "uHzs5xDnmIRQFWpvv1SNaeYqjbCpVW1rX0hQ5pFMi6o" },
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} className={onest.variable}>
      <body>
        <DictProvider locale={locale}>{children}</DictProvider>
      </body>
    </html>
  );
}
