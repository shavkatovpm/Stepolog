// To'liq sahifa matnlari (server tomonda ishlatiladi)
import uz, { type Landing, type LandingId } from "./uz";
import en from "./en";
import ru from "./ru";
import type { Locale } from "./links";

const all: Record<Locale, Landing[]> = { uz, en, ru };

export const getLandings = (l: Locale) => all[l];
export const getLanding = (l: Locale, slug: string) => all[l].find((x) => x.slug === slug);
export const getLandingById = (l: Locale, id: LandingId) => all[l].find((x) => x.id === id);
export type { Landing, LandingId };
