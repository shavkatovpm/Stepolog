import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getAllArticles } from "@/lib/content";
import { getLearnCategories } from "@/lib/learn-categories";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Startap asoslari",
  description:
    "Startap boshlash, biznes yuritish va o'sish strategiyalari haqida bosqichma-bosqich o'quv materiallar.",
  alternates: { canonical: "/learn" },
  openGraph: {
    title: "Startap asoslari",
    description: "G'oyadan exitgacha — 9 bosqichli startap qo'llanma.",
    url: "/learn",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Startap asoslari | Stepolog.uz",
    description: "G'oyadan exitgacha — 9 bosqichli startap qo'llanma.",
  },
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function LearnPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("learn");
  const articles = getAllArticles("learn", locale);

  const learnCategories = getLearnCategories(locale);
  const articlesByCategory = learnCategories.map((cat) => ({
    ...cat,
    articles: articles.filter((a) => a.category === cat.slug),
  }));

  return (
    <div className="mx-auto max-w-5xl px-5 py-20">
      <div className="mb-14">
        <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">
          {t("label")}
        </span>
        <h1 className="font-display text-5xl uppercase tracking-wide md:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-lg text-muted">
          {t("description")}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articlesByCategory.map((cat) => (
          <Link
            key={cat.slug}
            href={`/learn/${cat.slug}`}
            className="group rounded-xl border border-border bg-surface p-6 transition-all hover:border-brand/40"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-3xl text-brand/20 transition-colors group-hover:text-brand">
                {cat.number}
              </span>
              {cat.articles.length > 0 && (
                <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[10px] font-bold text-brand">
                  {cat.articles.length}
                </span>
              )}
            </div>
            <h2 className="mb-1 font-display text-lg uppercase tracking-wide">
              {cat.title}
            </h2>
            <p className="text-xs leading-relaxed text-muted">{cat.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
