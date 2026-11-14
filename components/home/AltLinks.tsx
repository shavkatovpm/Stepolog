"use client";

import { createContext, useContext, type ReactNode } from "react";

// Joriy sahifaning boshqa tillardagi manzillari (til almashtirgich uchun).
// Berilmasa, til almashtirgich bosh sahifalarga olib boradi.
type Alt = { en: string; uz: string; ru: string } | null;
const Ctx = createContext<Alt>(null);

export function AltLinksProvider({ value, children }: { value: Alt; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAltLinks = () => useContext(Ctx);
