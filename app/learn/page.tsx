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
    <div className="mx-auto max-w-5xl px-5 py-20">
      <div className="mb-12">
        <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">O&apos;rganish</span>
        <h1 className="font-display text-5xl uppercase tracking-wide md:text-6xl">O&apos;rganish</h1>
        <p className="mt-4 max-w-lg text-muted">
          Startap boshlash, xatolardan qochish va o&apos;sish strategiyalari haqida foydali materiallar
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-16 text-center">
          <svg className="mx-auto mb-4 h-12 w-12 text-muted/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
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
