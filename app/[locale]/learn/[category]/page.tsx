import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getLearnCategories } from "@/lib/learn-categories";
import { getArticlesByCategory } from "@/lib/content";

interface Props {
  params: Promise<{ locale: string; category: string }>;
}

export async function generateStaticParams() {
  const locales = ["uz", "ru"];
  const categories = getLearnCategories("uz");
  return locales.flatMap((locale) =>
    categories.map((cat) => ({ locale, category: cat.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category: categorySlug } = await params;
  const categories = getLearnCategories(locale);
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) return {};

  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: `/learn/${categorySlug}` },
    openGraph: {
      title: category.title,
      description: category.description,
      url: `/learn/${categorySlug}`,
      type: "website",
    },
  };
}

export default async function LearnCategoryPage({ params }: Props) {
  const { locale, category: categorySlug } = await params;
  const t = await getTranslations("learn");
  const categories = getLearnCategories(locale);
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) notFound();

  const articles = getArticlesByCategory(categorySlug, locale);

  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <Link
        href="/learn"
        className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-brand"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        {t("backToLearn")}
      </Link>

      <div className="mb-14">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-[.2em] text-brand">{t("label")}</span>
          <span className="font-display text-2xl text-brand/30">{category.number}</span>
        </div>
        <h1 className="font-display text-4xl uppercase tracking-wide md:text-5xl">
          {category.title}
        </h1>
        <p className="mt-4 text-lg text-muted">{category.description}</p>

        {category.topics.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {category.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-md border border-border px-3 py-1 text-xs text-muted-strong"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      {articles.length > 0 ? (
        <div className="space-y-4">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/learn/${categorySlug}/${article.slug}`}
              className="group block rounded-xl border border-border bg-surface p-6 transition-all hover:border-brand/40"
            >
              <h2 className="mb-2 font-display text-xl uppercase tracking-wide transition-colors group-hover:text-brand">
                {article.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted">
                {article.description}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted">
                <span>{article.date}</span>
                <span>&middot;</span>
                <span>{article.author}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <p className="text-muted">{t("noArticles")}</p>
        </div>
      )}
    </div>
  );
}
