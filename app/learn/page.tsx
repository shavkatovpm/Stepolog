import type { Metadata } from "next";
import ArticleCard from "@/components/ArticleCard";
import { getAllArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "O'rganish",
  description:
    "Startap boshlash, biznes yuritish va o'sish strategiyalari haqida foydali o'quv materiallar.",
};

export default function LearnPage() {
  const articles = getAllArticles("learn");

  return (
    <div>
      {/* Page header */}
      <div className="mb-12 rounded-2xl bg-gradient-to-r from-accent/10 via-accent/5 to-transparent p-8 md:p-10">
        <span className="mb-3 inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent">
          O&apos;rganish
        </span>
        <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">O&apos;rganish</h1>
        <p className="max-w-lg text-base text-muted">
          Startap boshlash, xatolardan qochish va o&apos;sish strategiyalari haqida foydali materiallar
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-2xl bg-surface p-16 text-center shadow-sm">
          <div className="mb-4 text-4xl">
            <svg className="mx-auto h-12 w-12 text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-muted">Hozircha materiallar yo&apos;q. Tez kunda!</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} {...article} type="learn" />
          ))}
        </div>
      )}
    </div>
  );
}
