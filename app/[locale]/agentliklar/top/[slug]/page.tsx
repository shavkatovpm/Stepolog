import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import {
  getCategories,
  getCategoryBySlug,
  getTopAgencies,
} from "@/lib/agencies";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const locales = ["uz", "ru"];
  return locales.flatMap((locale) =>
    getCategories(locale).map((c) => ({ locale, slug: c.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = getCategoryBySlug(slug, locale);
  if (!category) return {};

  const t = await getTranslations({ locale, namespace: "agencies" });
  const title = t("topMetaTitle", { category: category.shortTitle });

  return {
    title,
    description: t("topMetaDescription", { category: category.shortTitle.toLowerCase() }),
    alternates: { canonical: `/agentliklar/top/${slug}` },
    openGraph: {
      title,
      description: t("topMetaDescription", { category: category.shortTitle.toLowerCase() }),
      url: `/agentliklar/top/${slug}`,
      type: "article",
    },
  };
}

const months: Record<string, string[]> = {
  uz: [
    "yanvar",
    "fevral",
    "mart",
    "aprel",
    "may",
    "iyun",
    "iyul",
    "avgust",
    "sentabr",
    "oktabr",
    "noyabr",
    "dekabr",
  ],
  ru: [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ],
};

export default async function TopCategoryPage({ params }: Props) {
  const { locale, slug } = await params;
  const category = getCategoryBySlug(slug, locale);
  if (!category) notFound();

  const t = await getTranslations({ locale, namespace: "agencies" });
  const top = getTopAgencies(category.slug, locale, 10);
  const year = new Date().getFullYear();
  const today = new Date();
  const monthName = months[locale === "ru" ? "ru" : "uz"][today.getMonth()];
  const dateLabel = `${today.getDate()} ${monthName} ${year}`;

  const urlPrefix = locale === "ru" ? "/ru" : "";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Top 10 — ${category.title}`,
    url: `https://stepolog.uz${urlPrefix}/agentliklar/top/${slug}`,
    numberOfItems: top.length,
    itemListElement: top.map((a, i) => ({
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

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href={`/agentliklar/${category.slug}`}
        className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-brand"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        {category.shortTitle}
      </Link>

      {/* Header */}
      <header className="mb-14">
        <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">
          Top 10 · {year}
        </span>
        <h1 className="font-display text-4xl uppercase leading-tight tracking-wide md:text-5xl">
          {t("topPageTitle", { category: category.shortTitle })}
        </h1>
        <p className="mt-4 text-sm text-muted">
          {t("updated")}: {dateLabel}
        </p>
      </header>

      {/* List */}
      <ol className="space-y-10">
        {top.map((agency, i) => (
          <li key={agency.slug} className="border-b border-border pb-10 last:border-b-0">
            <div className="mb-5 flex items-baseline gap-4">
              <span className="font-display text-5xl text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <Link
                  href={`/agentliklar/${agency.primaryCategory}/${agency.slug}`}
                  className="group inline-flex items-center gap-2"
                >
                  <h2 className="font-display text-2xl uppercase tracking-wide transition-colors group-hover:text-brand md:text-3xl">
                    {agency.name}
                  </h2>
                  {agency.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Verified
                    </span>
                  )}
                </Link>
                <p className="mt-1 text-sm text-muted">{agency.slogan}</p>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-strong">
              <span className="inline-flex items-center gap-1 font-bold">
                <svg className="h-3.5 w-3.5 text-brand" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.39 7.36H22l-6.18 4.49L18.21 22 12 17.27 5.79 22l2.39-8.15L2 9.36h7.61z" />
                </svg>
                {agency.rating.toFixed(1)} <span className="text-xs text-muted">({agency.reviewsCount})</span>
              </span>
              <span className="text-xs">{agency.city}</span>
              <span className="text-xs">{agency.teamSize} {t("statTeam")}</span>
              <span className="text-xs">{agency.founded}</span>
            </div>

            <p className="mb-4 text-sm leading-relaxed text-foreground/80">{agency.about}</p>

            {agency.portfolio[0] && (
              <div className="mb-4 rounded-xl border border-border bg-surface p-4">
                <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-brand">
                  {t("strongCase")}
                </div>
                <div className="mb-1 text-sm font-bold">{agency.portfolio[0].title}</div>
                <p className="text-xs leading-relaxed text-muted-strong">
                  {agency.portfolio[0].description}
                </p>
              </div>
            )}

            {agency.reviews[0] && (
              <blockquote className="mb-4 border-l-2 border-brand/40 pl-4 text-sm italic leading-relaxed text-muted-strong">
                &laquo;{agency.reviews[0].text}&raquo;
                <footer className="mt-1 text-xs not-italic text-muted">— {agency.reviews[0].author}</footer>
              </blockquote>
            )}

            <Link
              href={`/agentliklar/${agency.primaryCategory}/${agency.slug}`}
              className="inline-flex items-center gap-1 text-sm font-bold text-foreground transition-colors hover:text-brand"
            >
              {t("viewProfile")} &rarr;
            </Link>
          </li>
        ))}
      </ol>

      {top.length === 0 && (
        <div className="rounded-xl border border-border bg-surface p-12 text-center text-sm text-muted">
          {t("empty")}
        </div>
      )}
    </div>
  );
}
