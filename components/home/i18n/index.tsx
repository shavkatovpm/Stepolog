"use client";

import { createContext, useContext, type ReactNode } from "react";
import en, { type Dict } from "./en";
import uz from "./uz";
import ru from "./ru";

export const LOCALES = ["en", "uz", "ru"] as const;
export type Locale = (typeof LOCALES)[number];

const dicts: Record<Locale, Dict> = { en, uz, ru };

const Ctx = createContext<Dict>(en);

export function DictProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <Ctx.Provider value={dicts[locale]}>{children}</Ctx.Provider>;
}

export const useDict = () => useContext(Ctx);
