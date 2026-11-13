"use client";

import { useMemo, useState } from "react";
import { StarIcon, SearchIcon, VerifiedBadge, type VariantProps } from "./shared";

export default function V03HeroStats({ agencies, categories }: VariantProps) {
  const [query, setQuery] = useState("");

  const cities = useMemo(() => new Set(agencies.map((a) => a.city)), [agencies]);
  const totalProjects = useMemo(
    () => agencies.reduce((sum, a) => sum + a.projectsCount, 0),
    [agencies]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return agencies;
    return agencies.filter((a) => (a.name + " " + a.slogan).toLowerCase().includes(q));
  }, [agencies, query]);

  return (
    <div>
      <section className="border-b border-border px-5 py-16 md:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">
            Agentliklar katalogi · 2026
          </span>
          <h1 className="font-display text-5xl uppercase leading-[0.95] tracking-wide md:text-7xl">
            O&apos;zbekistondagi top<br />
            <span className="text-brand">{agencies.length}+</span> agentlik
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-muted">
            Reyting, sharhlar va real portfolio asosida saralangan
          </p>

          {/* Stats row */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
            <Stat value={`${agencies.length}+`} label="Agentlik" />
            <Stat value={`${categories.length}`} label="Kategoriya" />
            <Stat value={`${cities.size}`} label="Shahar" />
            <Stat value={`${totalProjects}+`} label="Loyiha" />
          </div>

          <div className="mx-auto mt-12 max-w-xl">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Qidirish: SMM, veb-sayt..."
                className="w-full rounded-xl border border-border bg-surface py-4 pl-11 pr-4 text-sm outline-none focus:border-brand"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
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
                <span className="text-xs text-muted">{a.city}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-surface px-4 py-6">
      <div className="font-display text-3xl uppercase tracking-wide text-brand md:text-4xl">{value}</div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}
