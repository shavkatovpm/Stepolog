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
      <div className="mb-10">
        <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">O&apos;rganish</h1>
        <p className="text-base text-muted">
          Startap boshlash, xatolardan qochish va o&apos;sish strategiyalari haqida foydali materiallar
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-2xl bg-surface p-16 text-center shadow-sm">
          <p className="text-lg text-muted">Hozircha materiallar yo&apos;q. Tez kunda!</p>
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
