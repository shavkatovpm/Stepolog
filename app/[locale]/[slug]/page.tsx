import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingPage from "@/components/landing/LandingPage";
import { getLanding, landings } from "@/content/landing/uz";

// Imkoniyat sahifalari hozircha faqat o'zbekcha: /uz/<slug>
export const dynamicParams = false;

export function generateStaticParams() {
  return landings.map((l) => ({ locale: "uz", slug: l.slug }));
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = locale === "uz" ? getLanding(slug) : undefined;
  if (!l) return {};
  const url = `/uz/${l.slug}`;
  return {
    title: { absolute: l.metaTitle },
    description: l.metaDescription,
    alternates: { canonical: url, languages: { uz: url } },
    openGraph: { title: l.metaTitle, description: l.metaDescription, url, type: "website", locale: "uz_UZ", siteName: "Stepolog" },
  };
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  const l = locale === "uz" ? getLanding(slug) : undefined;
  if (!l) notFound();
  return <LandingPage l={l} />;
}
