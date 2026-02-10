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
      <article className="group relative h-full overflow-hidden rounded-2xl bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* Top accent bar */}
        <div className={`absolute left-0 top-0 h-1 w-full transition-all duration-300 group-hover:h-1.5 ${
          type === "blog"
            ? "bg-gradient-to-r from-brand to-yellow-300"
            : "bg-gradient-to-r from-accent to-orange-300"
        }`} />

        <div className="mb-4 flex items-center gap-2.5">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${
            type === "blog"
              ? "bg-brand/20 text-brand-dark"
              : "bg-accent/10 text-accent"
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
        <div className="mt-4 flex items-center gap-1 text-xs font-bold text-brand-dark opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
          O&apos;qish
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </article>
    </Link>
  );
}
