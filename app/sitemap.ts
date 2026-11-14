import type { MetadataRoute } from "next";
import { landings } from "@/content/landing/uz";

const SITE = "https://www.stepolog.uz";
const homeLangs = { en: SITE, uz: `${SITE}/uz`, ru: `${SITE}/ru` };

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const home = Object.values(homeLangs).map((url, i) => ({
    url,
    lastModified: now,
    priority: i === 0 ? 1 : 0.9,
    alternates: { languages: homeLangs },
  }));
  const pages = landings.map((l) => ({
    url: `${SITE}/uz/${l.slug}`,
    lastModified: now,
    priority: l.status === "open" ? 0.8 : 0.6,
  }));
  return [...home, ...pages];
}
