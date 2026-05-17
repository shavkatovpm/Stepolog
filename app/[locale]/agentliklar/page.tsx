import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getAgencies, getCategories } from "@/lib/agencies";
import AgencyCatalog from "@/components/AgencyCatalog";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "agencies" });

  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: { canonical: "/agentliklar" },
    openGraph: {
      title: t("title"),
      description: t("metaOgDescription"),
      url: "/agentliklar",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("title")} | Stepolog.uz`,
      description: t("metaOgDescription"),
    },
  };
}

export default async function AgentliklarPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "agencies" });
  const agencies = getAgencies(locale);
  const categories = getCategories(locale);

  return (
    <div>
      {/* Hero */}
      <section className="px-5 pt-16 pb-12 text-center md:pt-24 md:pb-16">
        <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">
          {t("heroLabel")}
        </span>
        <h1 className="mx-auto max-w-3xl font-display text-4xl uppercase tracking-wide md:text-6xl">
          {t("heroTitle")}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-muted">{t("heroSubtitle")}</p>
      </section>

      {/* Catalog */}
      <section className="px-5 pb-24">
        <div className="mx-auto max-w-6xl">
          <AgencyCatalog
            agencies={agencies}
            categories={categories}
            labels={{
              searchPlaceholder: t("searchPlaceholder"),
              all: t("all"),
              cities: t("filterCity"),
              sort: t("sort"),
              sortRating: t("sortRating"),
              sortReviews: t("sortReviews"),
              sortNewest: t("sortNewest"),
              results: t("results"),
              empty: t("empty"),
            }}
          />
        </div>
      </section>

      {/* Top 10 CTAs */}
      <section className="border-t border-border bg-surface px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">
              {t("topLabel")}
            </span>
            <h2 className="font-display text-3xl uppercase tracking-wide md:text-4xl">
              {t("topTitle")}
            </h2>
            <p className="mt-3 max-w-lg text-sm text-muted">{t("topDescription")}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/agentliklar/top/${cat.slug}`}
                className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-brand/40"
              >
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-brand">
                  Top 10
                </div>
                <h3 className="mb-2 font-display text-lg uppercase tracking-wide">
                  {cat.shortTitle}
                </h3>
                <p className="text-xs leading-relaxed text-muted">{cat.description}</p>
                <span className="mt-4 inline-block text-xs font-bold text-foreground transition-colors group-hover:text-brand">
                  {t("seeTop")} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
