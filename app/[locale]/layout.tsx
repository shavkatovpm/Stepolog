import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LayoutContent } from "@/components/LayoutContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: {
      default: t("title"),
      template: "%s | Stepolog.uz",
    },
    description: t("description"),
    metadataBase: new URL("https://stepolog.uz"),
    alternates: {
      canonical: locale === "uz" ? "/" : "/ru",
    },
    openGraph: {
      siteName: "Stepolog.uz",
      locale: locale === "uz" ? "uz_UZ" : "ru_RU",
      type: "website",
      url: "https://stepolog.uz",
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
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
    ],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "uz" | "ru")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
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
              locale === "uz"
                ? "O'zbekiston digital ekotizimi uchun bepul bilim platformasi."
                : "Бесплатная образовательная платформа для цифровой экосистемы Узбекистана.",
            sameAs: [
              "https://t.me/stepolog",
              "https://instagram.com/stepolog.uz",
            ],
          }),
        }}
      />
      <LayoutContent header={<Header />} footer={<Footer />}>
        {children}
      </LayoutContent>
    </NextIntlClientProvider>
  );
}
