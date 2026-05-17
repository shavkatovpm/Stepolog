import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import {
  getAgencies,
  getAgencyBySlug,
  getCategories,
  getCategoryBySlug,
} from "@/lib/agencies";

interface Props {
  params: Promise<{ locale: string; kategoriya: string; slug: string }>;
}

export function generateStaticParams() {
  const locales = ["uz", "ru"];
  return locales.flatMap((locale) =>
    getAgencies(locale).map((a) => ({
      locale,
      kategoriya: a.primaryCategory,
      slug: a.slug,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const agency = getAgencyBySlug(slug, locale);
  if (!agency) return {};

  return {
    title: `${agency.name} — ${agency.slogan}`,
    description: agency.about.slice(0, 160),
    alternates: { canonical: `/agentliklar/${agency.primaryCategory}/${slug}` },
    openGraph: {
      title: agency.name,
      description: agency.slogan,
      url: `/agentliklar/${agency.primaryCategory}/${slug}`,
      type: "profile",
    },
  };
}

export default async function AgencyDetailPage({ params }: Props) {
  const { locale, kategoriya, slug } = await params;
  const agency = getAgencyBySlug(slug, locale);
  if (!agency || agency.primaryCategory !== kategoriya) notFound();

  const t = await getTranslations({ locale, namespace: "agencies" });
  const allCategories = getCategories(locale);
  const category = getCategoryBySlug(kategoriya, locale);

  const urlPrefix = locale === "ru" ? "/ru" : "";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: agency.name,
    description: agency.about,
    url: `https://stepolog.uz${urlPrefix}/agentliklar/${agency.primaryCategory}/${slug}`,
    image: agency.cover,
    telephone: agency.contacts.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: agency.city,
      addressCountry: "UZ",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: agency.rating,
      reviewCount: agency.reviewsCount,
    },
    review: agency.reviews.map((r) => ({
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: r.rating },
      reviewBody: r.text,
      author: { "@type": "Person", name: r.author },
    })),
  };

  const categoryLabels = agency.categories
    .map((c) => allCategories.find((cat) => cat.slug === c)?.shortTitle)
    .filter(Boolean) as string[];

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href={`/agentliklar/${agency.primaryCategory}`}
        className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-brand"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        {category?.shortTitle ?? t("backToCatalog")}
      </Link>

      {/* Header */}
      <header className="mb-10">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-2xl font-bold text-muted-strong">
            {agency.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl uppercase tracking-wide md:text-4xl">
                {agency.name}
              </h1>
              {agency.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
            <p className="text-muted">{agency.slogan}</p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-1.5">
          {categoryLabels.map((label) => (
            <span
              key={label}
              className="rounded-md border border-border px-2.5 py-0.5 text-[11px] text-muted-strong"
            >
              {label}
            </span>
          ))}
        </div>

        {/* Contact CTAs */}
        <div className="flex flex-wrap gap-2">
          {agency.contacts.telegram && (
            <a
              href={`https://t.me/${agency.contacts.telegram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-bold text-brand-dark transition-opacity hover:opacity-90"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 2L2 10l7 3 3 7 10-18zM9 13l9-7-6 9-3-2z" />
              </svg>
              {t("contactTelegram")}
            </a>
          )}
          {agency.contacts.website && (
            <a
              href={agency.contacts.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:border-brand/40 hover:text-brand"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              {t("contactWebsite")}
            </a>
          )}
          {agency.contacts.phone && (
            <a
              href={`tel:${agency.contacts.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:border-brand/40 hover:text-brand"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {agency.contacts.phone}
            </a>
          )}
        </div>
      </header>

      {/* Key facts bar */}
      <section className="mb-12 grid grid-cols-2 gap-3 rounded-xl border border-border bg-surface p-5 sm:grid-cols-4">
        <KeyFact value={agency.rating.toFixed(1)} label={t("statRating")} accent />
        <KeyFact value={`${agency.projectsCount}+`} label={t("statProjects")} />
        <KeyFact value={agency.teamSize} label={t("statTeam")} />
        <KeyFact value={String(agency.founded)} label={t("statFounded")} />
      </section>

      {/* About */}
      <section className="mb-12">
        <h2 className="mb-4 font-display text-2xl uppercase tracking-wide">{t("aboutTitle")}</h2>
        <p className="leading-relaxed text-foreground/80">{agency.about}</p>
      </section>

      {/* Services */}
      <section className="mb-12">
        <h2 className="mb-4 font-display text-2xl uppercase tracking-wide">{t("servicesTitle")}</h2>
        <div className="flex flex-wrap gap-2">
          {agency.services.map((s) => (
            <span
              key={s}
              className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-muted-strong"
            >
              {s}
            </span>
          ))}
        </div>
        {agency.budgetRange && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-brand/30 bg-brand/5 px-3 py-1.5 text-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              {t("budget")}
            </span>
            <span className="font-bold text-foreground">{agency.budgetRange}</span>
          </div>
        )}
      </section>

      {/* Portfolio */}
      {agency.portfolio.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 font-display text-2xl uppercase tracking-wide">{t("portfolioTitle")}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {agency.portfolio.map((p, i) => (
              <div key={i} className="rounded-xl border border-border bg-surface p-5">
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wide">{p.title}</h3>
                <p className="text-sm leading-relaxed text-muted-strong">{p.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      {agency.reviews.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 font-display text-2xl uppercase tracking-wide">{t("reviewsTitle")}</h2>
          <div className="space-y-3">
            {agency.reviews.map((r, i) => (
              <div key={i} className="rounded-xl border border-border bg-surface p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Stars rating={r.rating} />
                  <span className="text-xs font-bold text-muted-strong">{r.author}</span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/80">&laquo;{r.text}&raquo;</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {agency.faq.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 font-display text-2xl uppercase tracking-wide">{t("faqTitle")}</h2>
          <div className="space-y-3">
            {agency.faq.map((item, i) => (
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

function KeyFact({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div>
      <div
        className={`font-display text-2xl ${accent ? "text-brand" : "text-foreground"}`}
      >
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-3.5 w-3.5 ${i < Math.round(rating) ? "text-brand" : "text-border"}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l2.39 7.36H22l-6.18 4.49L18.21 22 12 17.27 5.79 22l2.39-8.15L2 9.36h7.61z" />
        </svg>
      ))}
    </div>
  );
}
