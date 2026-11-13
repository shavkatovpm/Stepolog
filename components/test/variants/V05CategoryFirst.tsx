"use client";

import { useState } from "react";
import { StarIcon, VerifiedBadge, ArrowRight, type VariantProps } from "./shared";

export default function V05CategoryFirst({ agencies, categories }: VariantProps) {
  const [active, setActive] = useState<string | null>(null);

  const activeAgencies = active ? agencies.filter((a) => a.categories.includes(active as never)) : [];

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-12 max-w-2xl">
        <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">
          Agentliklar katalogi
        </span>
        <h1 className="font-display text-4xl uppercase tracking-wide md:text-6xl">
          Qaysi yo&apos;nalishda agentlik kerak?
        </h1>
        <p className="mt-4 text-muted">
          Kategoriyani tanlang — eng yaxshi jamoalar ko&apos;rsatiladi
        </p>
      </div>

      {/* Big category cards */}
      <div className="mb-12 grid gap-4 sm:grid-cols-2">
        {categories.map((c) => {
          const count = agencies.filter((a) => a.categories.includes(c.slug)).length;
          const isActive = active === c.slug;
          return (
            <button
              key={c.slug}
              onClick={() => setActive(isActive ? null : c.slug)}
              className={`group text-left rounded-2xl border p-8 transition-colors ${
                isActive ? "border-brand bg-brand/5" : "border-border bg-surface hover:border-brand/40"
              }`}
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-display text-5xl text-brand">{String(categories.indexOf(c) + 1).padStart(2, "0")}</span>
                <span className="rounded-full border border-border px-3 py-1 text-xs font-bold">
                  {count} ta
                </span>
              </div>
              <h2 className="mb-2 font-display text-2xl uppercase tracking-wide md:text-3xl">
                {c.shortTitle}
              </h2>
              <p className="mb-4 text-sm text-muted">{c.description}</p>
              <span className={`inline-flex items-center gap-2 text-sm font-bold transition-colors ${isActive ? "text-brand" : "text-foreground group-hover:text-brand"}`}>
                {isActive ? "Yopilsin" : "Ko'rish"} <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Active category agencies */}
      {active && (
        <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl uppercase tracking-wide md:text-2xl">
              {categories.find((c) => c.slug === active)?.title}
            </h2>
            <span className="text-sm text-muted">{activeAgencies.length} ta</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeAgencies.map((a) => (
              <div key={a.slug} className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 transition-colors hover:border-brand/40">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-sm font-bold">
                  {a.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate font-display text-sm uppercase tracking-wide">{a.name}</h3>
                    {a.verified && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span className="inline-flex items-center gap-0.5">
                      <StarIcon className="h-2.5 w-2.5 text-brand" />
                      {a.rating.toFixed(1)}
                    </span>
                    <span>{a.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
