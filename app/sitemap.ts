import type { MetadataRoute } from "next";
import { landingAlternates, landingLinks } from "@/content/landing/links";

const SITE = "https://www.stepolog.uz";
const abs = (m: Record<string, string>) => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, `${SITE}${v === "/" ? "" : v}`]));

// Sahifa qo'shilsa, sitemap keyingi deploy'da o'zi yangilanadi
export default function sitemap(): MetadataRoute.Sitemap {
  const homeLangs = abs({ en: "/", uz: "/uz", ru: "/ru" });
  const home = Object.values(homeLangs).map((url) => ({ url, priority: 1, alternates: { languages: homeLangs } }));
  const pages = landingLinks.en.flatMap((link) => {
    const langs = abs(landingAlternates(link.id));
    return Object.values(langs).map((url) => ({ url, priority: link.status === "open" ? 0.8 : 0.6, alternates: { languages: langs } }));
  });
  return [...home, ...pages];
}
