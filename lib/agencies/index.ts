export type AgencyCategory = "it" | "smm" | "dizayn" | "biznes";

export interface AgencyReview {
  rating: number;
  text: string;
  author: string;
  date?: string;
}

export interface AgencyPortfolioItem {
  title: string;
  description: string;
  url?: string;
  image?: string;
}

export interface AgencyFaq {
  question: string;
  answer: string;
}

export interface Agency {
  slug: string;
  name: string;
  slogan: string;
  about: string;
  categories: AgencyCategory[];
  primaryCategory: AgencyCategory;
  city: string;
  founded: number;
  teamSize: string;
  services: string[];
  projectsCount: number;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  logo?: string;
  cover?: string;
  contacts: {
    website?: string;
    telegram?: string;
    phone?: string;
    instagram?: string;
    email?: string;
  };
  portfolio: AgencyPortfolioItem[];
  reviews: AgencyReview[];
  faq: AgencyFaq[];
  budgetRange?: string;
}

export interface CategoryMeta {
  slug: AgencyCategory;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  faq: AgencyFaq[];
}

export function getAgencies(locale: string): Agency[] {
  if (locale === "ru") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("./ru").agencies;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("./uz").agencies;
}

export function getCategories(locale: string): CategoryMeta[] {
  if (locale === "ru") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("./ru").categories;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("./uz").categories;
}

export function getAgencyBySlug(
  slug: string,
  locale: string = "uz"
): Agency | undefined {
  return getAgencies(locale).find((a) => a.slug === slug);
}

export function getCategoryBySlug(
  slug: string,
  locale: string = "uz"
): CategoryMeta | undefined {
  return getCategories(locale).find((c) => c.slug === slug);
}

export function getAgenciesByCategory(
  category: AgencyCategory,
  locale: string = "uz"
): Agency[] {
  return getAgencies(locale).filter((a) => a.categories.includes(category));
}

export function getTopAgencies(
  category: AgencyCategory,
  locale: string = "uz",
  limit = 10
): Agency[] {
  return getAgenciesByCategory(category, locale)
    .slice()
    .sort((a, b) => {
      const ratingDiff = b.rating - a.rating;
      if (ratingDiff !== 0) return ratingDiff;
      return b.reviewsCount - a.reviewsCount;
    })
    .slice(0, limit);
}
