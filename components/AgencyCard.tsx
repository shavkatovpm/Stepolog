import { Link } from "@/i18n/navigation";
import type { Agency, CategoryMeta } from "@/lib/agencies";

interface Props {
  agency: Agency;
  categories: CategoryMeta[];
}

export default function AgencyCard({ agency, categories }: Props) {
  const categoryLabels = agency.categories
    .map((c) => categories.find((cat) => cat.slug === c)?.shortTitle)
    .filter(Boolean) as string[];

  return (
    <Link
      href={`/agentliklar/${agency.primaryCategory}/${agency.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-surface p-6 transition-all hover:border-brand/40"
    >
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-background text-lg font-bold text-muted-strong">
          {agency.name.charAt(0)}
        </div>
        {agency.verified && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Verified
          </span>
        )}
      </div>

      <h3 className="mb-1.5 font-display text-xl uppercase tracking-wide">{agency.name}</h3>
      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted">{agency.slogan}</p>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {categoryLabels.slice(0, 3).map((label) => (
          <span
            key={label}
            className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-strong"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="mt-auto border-t border-border pt-4">
        <div className="mb-2 flex items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1 font-bold text-foreground">
            <svg className="h-3.5 w-3.5 text-brand" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.39 7.36H22l-6.18 4.49L18.21 22 12 17.27 5.79 22l2.39-8.15L2 9.36h7.61z" />
            </svg>
            {agency.rating.toFixed(1)}
          </span>
          <span className="text-xs text-muted">{agency.reviewsCount} sharh</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {agency.city}
          </span>
          <span className="inline-flex items-center gap-1">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            {agency.teamSize}
          </span>
        </div>
      </div>
    </Link>
  );
}
