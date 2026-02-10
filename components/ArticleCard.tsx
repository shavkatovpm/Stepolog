import Link from "next/link";

interface ArticleCardProps {
  title: string;
  description: string;
  date: string;
  slug: string;
  type: "blog" | "learn";
}

export default function ArticleCard({ title, description, date, slug, type }: ArticleCardProps) {
  return (
    <Link href={`/${type}/${slug}`}>
      <article className="group h-full rounded-2xl bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="mb-4 flex items-center gap-2.5">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
            type === "blog"
              ? "bg-brand/30 text-brand-dark"
              : "bg-foreground/5 text-muted"
          }`}>
            {type === "blog" ? "Blog" : "O'rganish"}
          </span>
          <time className="text-xs text-muted">{date}</time>
        </div>
        <h3 className="mb-2.5 text-lg font-bold leading-snug transition-colors group-hover:text-brand-dark">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted line-clamp-2">
          {description}
        </p>
        <div className="mt-4 flex items-center text-xs font-semibold text-brand-dark opacity-0 transition-opacity group-hover:opacity-100">
          O&apos;qish →
        </div>
      </article>
    </Link>
  );
}
