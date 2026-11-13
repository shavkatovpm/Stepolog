"use client";

import { useMemo, useState } from "react";
import { StarIcon, SearchIcon, VerifiedBadge, type VariantProps } from "./shared";

export default function V02SidebarFilters({ agencies, categories }: VariantProps) {
  const [query, setQuery] = useState("");
  const [activeCats, setActiveCats] = useState<Set<string>>(new Set());
  const [activeCities, setActiveCities] = useState<Set<string>>(new Set());

  const cities = useMemo(() => Array.from(new Set(agencies.map((a) => a.city))), [agencies]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return agencies.filter((a) => {
      if (activeCats.size > 0 && !a.categories.some((c) => activeCats.has(c))) return false;
      if (activeCities.size > 0 && !activeCities.has(a.city)) return false;
      if (q && !(a.name + " " + a.slogan).toLowerCase().includes(q)) return false;
      return true;
    });
  }, [agencies, query, activeCats, activeCities]);

  const toggle = (set: Set<string>, key: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    next.has(key) ? next.delete(key) : next.add(key);
    setter(next);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-8 max-w-2xl">
        <h1 className="font-display text-3xl uppercase tracking-wide md:text-4xl">
          Agentliklar katalogi
        </h1>
        <p className="mt-2 text-sm text-muted">
          Filtrlardan foydalanib o&apos;zingizga mos agentlikni toping
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-6 self-start lg:sticky lg:top-[88px]">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Qidirish..."
              className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand"
            />
          </div>

          <FilterGroup title="Kategoriya">
            {categories.map((c) => (
              <CheckRow
                key={c.slug}
                checked={activeCats.has(c.slug)}
                onClick={() => toggle(activeCats, c.slug, setActiveCats)}
                label={c.shortTitle}
                count={agencies.filter((a) => a.categories.includes(c.slug)).length}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Shahar">
            {cities.map((city) => (
              <CheckRow
                key={city}
                checked={activeCities.has(city)}
                onClick={() => toggle(activeCities, city, setActiveCities)}
                label={city}
                count={agencies.filter((a) => a.city === city).length}
              />
            ))}
          </FilterGroup>

          {(activeCats.size > 0 || activeCities.size > 0 || query) && (
            <button
              onClick={() => {
                setQuery("");
                setActiveCats(new Set());
                setActiveCities(new Set());
              }}
              className="w-full rounded-lg border border-border px-3 py-2 text-xs font-bold hover:border-brand/40"
            >
              Filterni tozalash
            </button>
          )}
        </aside>

        {/* Results */}
        <div>
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <span className="text-sm font-bold">{filtered.length} ta agentlik</span>
            <select className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs outline-none">
              <option>Reyting bo&apos;yicha</option>
              <option>Sharhlar soni</option>
              <option>Yangiroq</option>
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((a) => (
              <div key={a.slug} className="flex gap-4 rounded-xl border border-border bg-surface p-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-xl font-bold">
                  {a.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="truncate font-display text-base uppercase tracking-wide">{a.name}</h3>
                    {a.verified && <VerifiedBadge />}
                  </div>
                  <p className="mb-2 line-clamp-2 text-xs text-muted">{a.slogan}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="inline-flex items-center gap-1 font-bold">
                      <StarIcon className="h-3 w-3 text-brand" />
                      {a.rating.toFixed(1)}
                    </span>
                    <span className="text-muted">{a.city}</span>
                    <span className="text-muted">{a.teamSize}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-[10px] font-bold uppercase tracking-[.2em] text-muted">{title}</h4>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function CheckRow({ checked, onClick, label, count }: { checked: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-surface"
    >
      <span className="flex items-center gap-2">
        <span className={`flex h-4 w-4 items-center justify-center rounded border ${checked ? "border-brand bg-brand" : "border-border"}`}>
          {checked && (
            <svg className="h-2.5 w-2.5 text-brand-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </span>
        {label}
      </span>
      <span className="text-xs text-muted">{count}</span>
    </button>
  );
}
