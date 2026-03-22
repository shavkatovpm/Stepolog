import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/content";
import { learnCategories } from "@/lib/learn-categories";

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

export default function LearnPage() {
  const articles = getAllArticles("learn");

  const articlesByCategory = learnCategories.map((cat) => ({
    ...cat,
    articles: articles.filter((a) => a.category === cat.slug),
  }));

  return (
    <div className="mx-auto max-w-5xl px-5 py-20">
      <div className="mb-14">
        <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">
          O&apos;rganish
        </span>
        <h1 className="font-display text-5xl uppercase tracking-wide md:text-6xl">
          Startap asoslari
        </h1>
        <p className="mt-4 max-w-lg text-muted">
          G&apos;oyadan exitgacha — bosqichma-bosqich qo&apos;llanmalar.
          Har bir bo&apos;limda mavzulashtirilgan maqolalar.
        </p>
      </div>

      <div className="space-y-6">
        {articlesByCategory.map((cat) => (
          <div
            key={cat.slug}
            className="group rounded-xl border border-border bg-surface p-6 transition-all hover:border-brand/40"
          >
            <div className="flex items-start gap-5">
              <span className="font-display text-3xl text-brand/20 transition-colors group-hover:text-brand">
                {cat.number}
              </span>
              <div className="flex-1">
                <h2 className="mb-1 font-display text-xl uppercase tracking-wide">
                  {cat.title}
                </h2>
                <p className="text-sm text-muted">{cat.description}</p>

                {cat.articles.length > 0 ? (
                  <div className="mt-4 space-y-2">
                    {cat.articles.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/learn/${article.slug}`}
                        className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-brand"
                      >
                        <svg className="h-3.5 w-3.5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                        {article.title}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted/50" />
                    <span className="text-xs text-muted">Tez kunda</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
