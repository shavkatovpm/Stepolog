import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/content";
import { getCareers } from "@/lib/careers";

const BASE_URL = "https://stepolog.uz";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["uz", "ru"] as const;
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const prefix = locale === "uz" ? "" : "/ru";
    const blogSlugs = getAllSlugs("blog", locale);
    const learnSlugs = getAllSlugs("learn", locale);
    const careerList = getCareers(locale);

    // Static pages
    entries.push(
      { url: `${BASE_URL}${prefix}`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
      { url: `${BASE_URL}${prefix}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
      { url: `${BASE_URL}${prefix}/about/missiya`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
      { url: `${BASE_URL}${prefix}/about/bilim`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
      { url: `${BASE_URL}${prefix}/about/hamjamiyat`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
      { url: `${BASE_URL}${prefix}/about/yol-xarita`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
      { url: `${BASE_URL}${prefix}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
      { url: `${BASE_URL}${prefix}/learn`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
      { url: `${BASE_URL}${prefix}/kasblar`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    );

    // Blog pages
    for (const slug of blogSlugs) {
      entries.push({
        url: `${BASE_URL}${prefix}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    // Learn pages
    for (const slug of learnSlugs) {
      entries.push({
        url: `${BASE_URL}${prefix}/learn/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    // Career pages
    for (const career of careerList) {
      entries.push({
        url: `${BASE_URL}${prefix}/kasblar/${career.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
