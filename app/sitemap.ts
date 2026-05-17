import type { MetadataRoute } from "next";
import { getAllLearnSlugsWithCategory, getAllSlugs } from "@/lib/content";
import { getCareers } from "@/lib/careers";
import { getLearnCategories } from "@/lib/learn-categories";
import { getAgencies, getCategories } from "@/lib/agencies";

const BASE_URL = "https://stepolog.uz";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["uz", "ru"] as const;
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const prefix = locale === "uz" ? "" : "/ru";
    const blogSlugs = getAllSlugs("blog", locale);
    const learnCategories = getLearnCategories(locale);
    const learnArticles = getAllLearnSlugsWithCategory(locale);
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
      { url: `${BASE_URL}${prefix}/agentliklar`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.95 },
    );

    // Agency category and Top 10 pages
    const agencyCategories = getCategories(locale);
    for (const cat of agencyCategories) {
      entries.push(
        {
          url: `${BASE_URL}${prefix}/agentliklar/${cat.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.9,
        },
        {
          url: `${BASE_URL}${prefix}/agentliklar/top/${cat.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.95,
        }
      );
    }

    // Agency profile pages
    const agencyList = getAgencies(locale);
    for (const agency of agencyList) {
      entries.push({
        url: `${BASE_URL}${prefix}/agentliklar/${agency.primaryCategory}/${agency.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    // Blog pages
    for (const slug of blogSlugs) {
      entries.push({
        url: `${BASE_URL}${prefix}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    // Learn category pages
    for (const cat of learnCategories) {
      entries.push({
        url: `${BASE_URL}${prefix}/learn/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    // Learn article pages
    for (const item of learnArticles) {
      entries.push({
        url: `${BASE_URL}${prefix}/learn/${item.category}/${item.slug}`,
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
