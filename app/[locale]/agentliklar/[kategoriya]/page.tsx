import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import {
  getAgenciesByCategory,
  getCategories,
  getCategoryBySlug,
} from "@/lib/agencies";
import AgencyCard from "@/components/AgencyCard";

interface Props {
  params: Promise<{ locale: string; kategoriya: string }>;
}

export function generateStaticParams() {
  const locales = ["uz", "ru"];
  return locales.flatMap((locale) =>
    getCategories(locale).map((c) => ({ locale, kategoriya: c.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, kategoriya } = await params;
  const category = getCategoryBySlug(kategoriya, locale);
  if (!category) return {};

  return {
    title: `${category.title} — Stepolog.uz`,
    description: category.longDescription.slice(0, 160),
    alternates: { canonical: `/agentliklar/${kategoriya}` },
    openGraph: {
      title: category.title,
      description: category.description,
      url: `/agentliklar/${kategoriya}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { locale, kategoriya } = await params;
  const category = getCategoryBySlug(kategoriya, locale);

  if (!category) notFound();

  const t = await getTranslations({ locale, namespace: "agencies" });
  const allCategories = getCategories(locale);
  const agencies = getAgenciesByCategory(category.slug, locale).sort(
    (a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount
  );

  const urlPrefix = locale === "ru" ? "/ru" : "";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: category.title,
    description: category.description,
    url: `https://stepolog.uz${urlPrefix}/agentliklar/${kategoriya}`,
    numberOfItems: agencies.length,
    itemListElement: agencies.slice(0, 10).map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LocalBusiness",
        name: a.name,
        description: a.slogan,
        url: `https://stepolog.uz${urlPrefix}/agentliklar/${a.primaryCategory}/${a.slug}`,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: a.rating,
          reviewCount: a.reviewsCount,
        },
      },
    })),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: category.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <Link
        href="/agentliklar"
        className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-brand"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        {t("backToCatalog")}
      </Link>

      {/* Header */}
      <div className="mb-10 max-w-3xl">
        <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">
          {category.shortTitle}
        </span>
        <h1 className="font-display text-4xl uppercase tracking-wide md:text-5xl">
          {category.title}
        </h1>
        <p className="mt-5 leading-relaxed text-muted">{category.longDescription}</p>
      </div>

      {/* Top CTA */}
      <Link
        href={`/agentliklar/top/${category.slug}`}
        className="mb-10 flex items-center justify-between rounded-xl border border-brand/30 bg-brand/5 px-6 py-5 transition-colors hover:border-brand/60"
      >
        <div>
          <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-brand">
            Top 10
          </div>
          <div className="font-display text-lg uppercase tracking-wide">
            {t("topInCategory", { category: category.shortTitle })}
          </div>
        </div>
        <svg className="h-5 w-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>

      {/* Agencies grid */}
      {agencies.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {agencies.map((agency) => (
            <AgencyCard key={agency.slug} agency={agency} categories={allCategories} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface p-12 text-center text-sm text-muted">
          {t("empty")}
        </div>
      )}

      {/* FAQ */}
      {category.faq.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-display text-2xl uppercase tracking-wide md:text-3xl">
            {t("faqTitle")}
          </h2>
          <div className="space-y-3">
            {category.faq.map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-border bg-surface p-5 transition-colors hover:border-brand/30"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-bold text-foreground">
                  {item.question}
                  <svg className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-strong">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
