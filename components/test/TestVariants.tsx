"use client";

import { useState } from "react";
import type { Agency, CategoryMeta } from "@/lib/agencies";
import V01CenteredMinimal from "./variants/V01CenteredMinimal";
import V02SidebarFilters from "./variants/V02SidebarFilters";
import V03HeroStats from "./variants/V03HeroStats";
import V04SearchFirst from "./variants/V04SearchFirst";
import V05CategoryFirst from "./variants/V05CategoryFirst";
import V06Editorial from "./variants/V06Editorial";
import V07DenseList from "./variants/V07DenseList";
import V08InlineTabs from "./variants/V08InlineTabs";
import V09Brutalist from "./variants/V09Brutalist";
import V10TableView from "./variants/V10TableView";

interface Props {
  agencies: Agency[];
  categories: CategoryMeta[];
}

const variants = [
  { id: 1, name: "Centered Minimal", desc: "Markazlashgan hero + qidiruv + grid (hozirgi)" },
  { id: 2, name: "Sidebar Filters", desc: "Chap panel filter, o'ng tarafda kartalar (Clutch)" },
  { id: 3, name: "Hero + Stats", desc: "Hero + ko'rsatkichlar qatori (152 agentlik...)" },
  { id: 4, name: "Search-First", desc: "Katta qidiruv markazda — Google stilida" },
  { id: 5, name: "Category-First", desc: "Avval kategoriya tanlash — keyin agentliklar" },
  { id: 6, name: "Editorial", desc: "Bitta katta featured + boshqalar asimmetrik" },
  { id: 7, name: "Dense List", desc: "Linear stili — gorizontal qatorlar" },
  { id: 8, name: "Inline Tabs", desc: "Hero ostida kategoriya tablar" },
  { id: 9, name: "Brutalist", desc: "Qora qalin tipografika, o'tkir burchaklar" },
  { id: 10, name: "Table View", desc: "Jadval ko'rinishi — eksperetlar uchun" },
];

export default function TestVariants({ agencies, categories }: Props) {
  const [active, setActive] = useState(1);

  const VariantComponent = (() => {
    switch (active) {
      case 1: return V01CenteredMinimal;
      case 2: return V02SidebarFilters;
      case 3: return V03HeroStats;
      case 4: return V04SearchFirst;
      case 5: return V05CategoryFirst;
      case 6: return V06Editorial;
      case 7: return V07DenseList;
      case 8: return V08InlineTabs;
      case 9: return V09Brutalist;
      case 10: return V10TableView;
      default: return V01CenteredMinimal;
    }
  })();

  const current = variants.find((v) => v.id === active)!;

  return (
    <div>
      {/* Sticky toggle bar */}
      <div className="sticky top-[88px] z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5 py-3">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
            <span className="font-bold uppercase tracking-[.2em] text-brand">Test variantlari</span>
            <span className="text-muted">{current.desc}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setActive(v.id)}
                className={`rounded-md border px-3 py-1.5 text-xs font-bold transition-colors ${
                  active === v.id
                    ? "border-brand bg-brand text-brand-dark"
                    : "border-border bg-surface text-muted-strong hover:border-brand/40 hover:text-foreground"
                }`}
              >
                <span className="mr-1.5 opacity-60">V{String(v.id).padStart(2, "0")}</span>
                {v.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-screen">
        <VariantComponent agencies={agencies} categories={categories} />
      </div>
    </div>
  );
}
