"use client";

import { useMemo, useState } from "react";
import { StarIcon, SearchIcon, VerifiedBadge, type VariantProps } from "./shared";

export default function V01CenteredMinimal({ agencies, categories }: VariantProps) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return agencies.filter((a) => {
      if (cat !== "all" && !a.categories.includes(cat as never)) return false;
      if (q && !(a.name + " " + a.slogan).toLowerCase().includes(q)) return false;
      return true;
    });
  }, [agencies, query, cat]);

  return (
    <div>
      <section className="px-5 py-20 text-center">
        <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">
          Agentliklar katalogi
        </span>
        <h1 className="mx-auto max-w-3xl font-display text-5xl uppercase tracking-wide md:text-7xl">
          Eng yaxshi agentlikni toping
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-muted">
          O&apos;zbekistondagi top jamoalar — reyting, sharh va portfolio bilan
        </p>
        <div className="mx-auto mt-10 max-w-xl">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SMM, veb-sayt, dizayn..."
              className="w-full rounded-xl border border-border bg-surface py-4 pl-11 pr-4 text-sm outline-none focus:border-brand"
            />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            <Pill active={cat === "all"} onClick={() => setCat("all")}>Hammasi</Pill>
            {categories.map((c) => (
              <Pill key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>
                {c.shortTitle}
              </Pill>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <div key={a.slug} className="flex flex-col rounded-xl border border-border bg-surface p-6">
              <div className="mb-5 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-background text-lg font-bold">
                  {a.name.charAt(0)}
                </div>
                {a.verified && <VerifiedBadge />}
              </div>
              <h3 className="mb-1 font-display text-xl uppercase tracking-wide">{a.name}</h3>
              <p className="mb-4 text-sm text-muted">{a.slogan}</p>
              <div className="mt-auto flex items-center gap-3 border-t border-border pt-3 text-sm">
                <span className="inline-flex items-center gap-1 font-bold">
                  <StarIcon className="h-3.5 w-3.5 text-brand" />
                  {a.rating.toFixed(1)}
                </span>
                <span className="text-xs text-muted">{a.reviewsCount} sharh · {a.city}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
        active ? "border-brand bg-brand text-brand-dark" : "border-border bg-surface hover:border-brand/40"
      }`}
    >
      {children}
    </button>
  );
}
