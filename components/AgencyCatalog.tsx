"use client";

import { useMemo, useState } from "react";
import type { Agency, AgencyCategory, CategoryMeta } from "@/lib/agencies";
import AgencyCard from "./AgencyCard";

interface Props {
  agencies: Agency[];
  categories: CategoryMeta[];
  labels: {
    searchPlaceholder: string;
    all: string;
    cities: string;
    sort: string;
    sortRating: string;
    sortReviews: string;
    sortNewest: string;
    results: string;
    empty: string;
  };
}

type SortKey = "rating" | "reviews" | "newest";

export default function AgencyCatalog({ agencies, categories, labels }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<AgencyCategory | "all">("all");
  const [activeCity, setActiveCity] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("rating");

  const cities = useMemo(() => {
    return Array.from(new Set(agencies.map((a) => a.city))).sort();
  }, [agencies]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = agencies.filter((a) => {
      if (activeCategory !== "all" && !a.categories.includes(activeCategory)) return false;
      if (activeCity !== "all" && a.city !== activeCity) return false;
      if (q) {
        const haystack = [
          a.name,
          a.slogan,
          a.about,
          ...a.services,
          ...a.categories,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    list = list.slice().sort((a, b) => {
      if (sort === "rating") {
        const d = b.rating - a.rating;
        if (d !== 0) return d;
        return b.reviewsCount - a.reviewsCount;
      }
      if (sort === "reviews") return b.reviewsCount - a.reviewsCount;
      return b.founded - a.founded;
    });

    return list;
  }, [agencies, query, activeCategory, activeCity, sort]);

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="w-full rounded-xl border border-border bg-surface py-3.5 pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted focus:border-brand"
        />
      </div>

      {/* Category pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        <CategoryPill
          active={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
        >
          {labels.all}
        </CategoryPill>
        {categories.map((c) => (
          <CategoryPill
            key={c.slug}
            active={activeCategory === c.slug}
            onClick={() => setActiveCategory(c.slug)}
          >
            {c.shortTitle}
          </CategoryPill>
        ))}
      </div>

      {/* Toolbar */}
      <div className="sticky top-[88px] z-10 -mx-5 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/80 px-5 py-3 backdrop-blur-xl">
        <span className="text-xs font-bold text-muted-strong">
          {filtered.length} {labels.results}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={activeCity} onChange={setActiveCity}>
            <option value="all">{labels.cities}</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
          <Select value={sort} onChange={(v) => setSort(v as SortKey)}>
            <option value="rating">{labels.sortRating}</option>
            <option value="reviews">{labels.sortReviews}</option>
            <option value="newest">{labels.sortNewest}</option>
          </Select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((agency) => (
            <AgencyCard key={agency.slug} agency={agency} categories={categories} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface p-12 text-center text-sm text-muted">
          {labels.empty}
        </div>
      )}
    </div>
  );
}

function CategoryPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
        active
          ? "border-brand bg-brand text-brand-dark"
          : "border-border bg-surface text-muted-strong hover:border-brand/40 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-md border border-border bg-surface py-1.5 pl-3 pr-8 text-xs font-bold text-foreground outline-none transition-colors hover:border-brand/40 focus:border-brand"
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </div>
  );
}
