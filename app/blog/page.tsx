import type { Metadata } from "next";
import ArticleCard from "@/components/ArticleCard";
import { getAllArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Bloglar",
  description:
    "Startaplar haqida so'nggi yangliklar, PR maqolalar va O'zbekiston biznes ekotizimi haqida.",
};

export default function BlogPage() {
  const articles = getAllArticles("blog");

  return (
    <div>
      {/* Page header */}
      <div className="mb-12 rounded-2xl bg-gradient-to-r from-brand/20 via-brand/10 to-transparent p-8 md:p-10">
        <span className="mb-3 inline-block rounded-full bg-brand/30 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-dark">
          Blog
        </span>
        <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">Bloglar</h1>
        <p className="max-w-lg text-base text-muted">
          Startaplar haqida yangliklar, tahlillar va PR maqolalar
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-2xl bg-surface p-16 text-center shadow-sm">
          <div className="mb-4 text-4xl">
            <svg className="mx-auto h-12 w-12 text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
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
