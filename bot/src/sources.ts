// Boshlang'ich manbalar (RSS). Yangisini qo'shib, `npm run db:init` qiling.
import type { Tier } from "./criteria.ts";

// tier: official = kompaniyaning o'zi, media = ishonchli OAV, blog = blog yoki agregator (qattiqroq tekshiriladi)
export type Source = { field: string; name: string; feed: string; lang: "en" | "ru"; tier: Tier; active?: boolean };

export const SOURCES: Source[] = [
  // Reklama platformalari va rasmiy bloglar
  { field: "marketing", name: "Google Ads & Commerce", feed: "https://blog.google/products/ads-commerce/rss/", lang: "en", tier: "official" },
  { field: "marketing", name: "Meta Newsroom", feed: "https://about.fb.com/feed/", lang: "en", tier: "official" },
  { field: "marketing", name: "YouTube Official Blog", feed: "https://blog.youtube/rss/", lang: "en", tier: "official" },
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
  { field: "marketing", name: "Digiday", feed: "https://digiday.com/feed/", lang: "en", tier: "media" },
  // AI (marketingga ta'siri: 5A, 5C turlari)
  { field: "marketing", name: "OpenAI News", feed: "https://openai.com/news/rss.xml", lang: "en", tier: "official" },
  { field: "marketing", name: "Google AI Blog", feed: "https://blog.google/technology/ai/rss/", lang: "en", tier: "official" },
  { field: "marketing", name: "TechCrunch AI", feed: "https://techcrunch.com/category/artificial-intelligence/feed/", lang: "en", tier: "media" },
  // Rus tilidagi
  { field: "marketing", name: "Cossa", feed: "https://www.cossa.ru/rss/", lang: "ru", tier: "media" },
  { field: "marketing", name: "Sostav", feed: "https://www.sostav.ru/rss", lang: "ru", tier: "media", active: false } // shovqin: 40 tadan 0 tasi o'tdi,
];
