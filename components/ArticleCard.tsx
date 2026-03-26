import { Link } from "@/i18n/navigation";

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
      <article className="group flex h-full flex-col rounded-xl border border-border bg-surface p-6 transition-all hover:border-brand/40">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="text-xs font-bold uppercase tracking-[.2em] text-brand">
            {type === "blog" ? "Blog" : "O'rganish"}
          </span>
          <time className="text-xs text-muted">{date}</time>
        </div>
        <h3 className="mb-2.5 font-display text-xl uppercase tracking-wide transition-colors group-hover:text-brand">
          {title}
        </h3>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted line-clamp-2">
          {description}
        </p>
        <div className="flex items-center gap-1 text-sm font-bold text-foreground transition-colors group-hover:text-brand">
          O&apos;qish &rarr;
        </div>
      </article>
    </Link>
  );
}
