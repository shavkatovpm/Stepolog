// Server tomonda (metadata uchun) lug'atlarni olish
import en from "./en";
import uz from "./uz";
import ru from "./ru";

export const LOCALES = ["en", "uz", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const getDict = (l: Locale) => ({ en, uz, ru })[l];
export const isLocale = (x: string): x is Locale => (LOCALES as readonly string[]).includes(x);
