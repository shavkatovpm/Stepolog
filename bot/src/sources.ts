// Boshlang'ich manbalar (RSS). Yangisini qo'shib, `npm run db:init` qiling.
export type Source = { field: string; name: string; feed: string; lang: "en" | "ru" };

export const SOURCES: Source[] = [
  // Reklama platformalari va rasmiy bloglar
  { field: "marketing", name: "Google Ads & Commerce", feed: "https://blog.google/products/ads-commerce/rss/", lang: "en" },
  { field: "marketing", name: "Meta Newsroom", feed: "https://about.fb.com/feed/", lang: "en" },
  { field: "marketing", name: "PPC Land", feed: "https://ppc.land/rss/", lang: "en" },
  { field: "marketing", name: "Search Engine Journal", feed: "https://www.searchenginejournal.com/feed/", lang: "en" },
  // SMM va ijtimoiy tarmoqlar
  { field: "marketing", name: "Social Media Today", feed: "https://www.socialmediatoday.com/feeds/news/", lang: "en" },
  { field: "marketing", name: "Social Media Examiner", feed: "https://www.socialmediaexaminer.com/feed/", lang: "en" },
  { field: "marketing", name: "TechCrunch Social", feed: "https://techcrunch.com/category/social/feed/", lang: "en" },
  // Umumiy marketing
  { field: "marketing", name: "Marketing Dive", feed: "https://www.marketingdive.com/feeds/news/", lang: "en" },
  { field: "marketing", name: "Adweek", feed: "https://www.adweek.com/feed/", lang: "en" },
  { field: "marketing", name: "HubSpot Marketing", feed: "https://blog.hubspot.com/marketing/rss.xml", lang: "en" },
  // Rus tilidagi
  { field: "marketing", name: "Cossa", feed: "https://www.cossa.ru/rss/", lang: "ru" },
  { field: "marketing", name: "Sostav", feed: "https://www.sostav.ru/rss", lang: "ru" },
];
