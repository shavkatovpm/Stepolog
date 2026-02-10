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
      <div className="mb-10">
        <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">Bloglar</h1>
        <p className="text-base text-muted">
          Startaplar haqida yangliklar, tahlillar va PR maqolalar
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-2xl bg-surface p-16 text-center shadow-sm">
          <p className="text-lg text-muted">Hozircha maqolalar yo&apos;q. Tez kunda!</p>
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
