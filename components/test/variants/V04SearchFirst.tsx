"use client";

import { useMemo, useState } from "react";
import { StarIcon, SearchIcon, VerifiedBadge, type VariantProps } from "./shared";

export default function V04SearchFirst({ agencies, categories }: VariantProps) {
  const [query, setQuery] = useState("");
  const [hasInput, setHasInput] = useState(false);

  const popular = useMemo(
    () => ["SMM agentlik", "Veb-sayt", "Logo dizayn", "Buxgalteriya", "Mobil ilova"],
    []
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return agencies.filter((a) =>
      (a.name + " " + a.slogan + " " + a.services.join(" ")).toLowerCase().includes(q)
    );
  }, [agencies, query]);

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <section className={`flex flex-col items-center justify-center px-5 transition-all ${hasInput ? "pt-16 pb-8" : "pt-32 pb-20"}`}>
        <div className="mb-8 text-center">
          <span className="text-xs font-bold uppercase tracking-[.2em] text-brand">Stepolog</span>
          <h1 className="mt-3 font-display text-3xl uppercase tracking-wide md:text-5xl">
            Qaysi xizmat kerak?
          </h1>
        </div>

        <div className="w-full max-w-2xl">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onFocus={() => setHasInput(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setHasInput(true);
              }}
              placeholder="SMM, veb-sayt, dizayn, buxgalter..."
              className="w-full rounded-full border border-border bg-surface py-5 pl-14 pr-6 text-base shadow-none outline-none transition-colors focus:border-brand"
            />
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <span className="text-xs text-muted">Mashhur:</span>
            {popular.map((p) => (
              <button
                key={p}
                onClick={() => setQuery(p)}
                className="text-xs text-muted-strong underline decoration-dotted underline-offset-2 hover:text-brand"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results or default state */}
      <section className="mx-auto max-w-4xl px-5 pb-20">
        {!hasInput || !query ? (
          <div>
            <h2 className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-muted">Kategoriyalar</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {categories.map((c) => (
                <div key={c.slug} className="group flex items-start justify-between gap-4 rounded-xl border border-border bg-surface p-5 transition-colors hover:border-brand/40">
                  <div>
                    <h3 className="font-display text-lg uppercase tracking-wide">{c.title}</h3>
                    <p className="mt-1 text-xs text-muted">{c.description}</p>
                  </div>
                  <span className="font-display text-3xl text-brand/30 group-hover:text-brand">→</span>
                </div>
              ))}
            </div>
          </div>
        ) : filtered.length > 0 ? (
          <div>
            <h2 className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-muted">
              {filtered.length} ta natija
            </h2>
            <div className="space-y-2">
              {filtered.map((a) => (
                <div key={a.slug} className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-brand/40">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-sm font-bold">
                    {a.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-display text-base uppercase tracking-wide">{a.name}</h3>
                      {a.verified && <VerifiedBadge />}
                    </div>
                    <p className="truncate text-xs text-muted">{a.slogan}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold">
                    <StarIcon className="h-3.5 w-3.5 text-brand" />
                    {a.rating.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-muted">Natija topilmadi</p>
        )}
      </section>
    </div>
  );
}
