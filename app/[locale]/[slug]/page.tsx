import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingPage from "@/components/landing/LandingPage";
import { getLanding, getLandings } from "@/content/landing";
import { landingAlternates, landingPath } from "@/content/landing/links";
import { isLocale, LOCALES } from "@/components/home/i18n/server";

// Imkoniyat sahifalari: /<slug> (EN), /uz/<slug>, /ru/<slug>
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => getLandings(locale).map((l) => ({ locale, slug: l.slug })));
}

type Props = { params: Promise<{ locale: string; slug: string }> };

const ogLocale = { en: "en_US", uz: "uz_UZ", ru: "ru_RU" } as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const l = getLanding(locale, slug);
  if (!l) return {};
  const url = landingPath(locale, l.slug);
  const alt = landingAlternates(l.id);
  return {
    title: { absolute: l.metaTitle },
    description: l.metaDescription,
    alternates: { canonical: url, languages: { ...alt, "x-default": alt.en } },
    openGraph: { title: l.metaTitle, description: l.metaDescription, url, type: "website", locale: ogLocale[locale], siteName: "Stepolog" },
  };
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const l = getLanding(locale, slug);
  if (!l) notFound();
  return <LandingPage l={l} locale={locale} />;
}
