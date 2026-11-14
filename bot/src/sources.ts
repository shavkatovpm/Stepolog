// Boshlang'ich manbalar (RSS). Yangisini qo'shib, `npm run db:init` qiling.
import type { Tier } from "./criteria.ts";

// tier: official = kompaniyaning o'zi, media = ishonchli OAV, blog = blog yoki agregator (qattiqroq tekshiriladi)
export type Source = { field: string; name: string; feed: string; lang: "en" | "ru"; tier: Tier };

export const SOURCES: Source[] = [
  // Reklama platformalari va rasmiy bloglar
  { field: "marketing", name: "Google Ads & Commerce", feed: "https://blog.google/products/ads-commerce/rss/", lang: "en", tier: "official" },
  { field: "marketing", name: "Meta Newsroom", feed: "https://about.fb.com/feed/", lang: "en", tier: "official" },
  { field: "marketing", name: "PPC Land", feed: "https://ppc.land/rss/", lang: "en", tier: "blog" },
  { field: "marketing", name: "Search Engine Journal", feed: "https://www.searchenginejournal.com/feed/", lang: "en", tier: "media" },
  // SMM va ijtimoiy tarmoqlar
  { field: "marketing", name: "Social Media Today", feed: "https://www.socialmediatoday.com/feeds/news/", lang: "en", tier: "media" },
  { field: "marketing", name: "Social Media Examiner", feed: "https://www.socialmediaexaminer.com/feed/", lang: "en", tier: "blog" },
  { field: "marketing", name: "TechCrunch Social", feed: "https://techcrunch.com/category/social/feed/", lang: "en", tier: "media" },
  // Umumiy marketing
  { field: "marketing", name: "Marketing Dive", feed: "https://www.marketingdive.com/feeds/news/", lang: "en", tier: "media" },
  { field: "marketing", name: "Adweek", feed: "https://www.adweek.com/feed/", lang: "en", tier: "media" },
  { field: "marketing", name: "HubSpot Marketing", feed: "https://blog.hubspot.com/marketing/rss.xml", lang: "en", tier: "blog" },
  // Rus tilidagi
  { field: "marketing", name: "Cossa", feed: "https://www.cossa.ru/rss/", lang: "ru", tier: "media" },
  { field: "marketing", name: "Sostav", feed: "https://www.sostav.ru/rss", lang: "ru", tier: "media" },
];
