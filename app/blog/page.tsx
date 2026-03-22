import type { Metadata } from "next";
import ArticleCard from "@/components/ArticleCard";
import { getAllArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Bloglar",
  description:
    "Startaplar haqida so'nggi yangliklar, PR maqolalar va O'zbekiston biznes ekotizimi haqida.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Bloglar",
    description: "Startaplar haqida yangliklar, tahlillar va PR maqolalar.",
    url: "/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bloglar | Stepolog.uz",
    description: "Startaplar haqida yangliklar, tahlillar va PR maqolalar.",
  },
};

export default function BlogPage() {
  const articles = getAllArticles("blog");

  return (
    <div className="mx-auto max-w-5xl px-5 py-20">
      <div className="mb-12">
        <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">Blog</span>
        <h1 className="font-display text-5xl uppercase tracking-wide md:text-6xl">Bloglar</h1>
        <p className="mt-4 max-w-lg text-muted">
          Startaplar haqida yangliklar, tahlillar va PR maqolalar
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-16 text-center">
          <svg className="mx-auto mb-4 h-12 w-12 text-muted/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-lg font-medium text-muted">Hozircha maqolalar yo&apos;q. Tez kunda!</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} {...article} type="blog" />
          ))}
        </div>
      )}
    </div>
  );
}
