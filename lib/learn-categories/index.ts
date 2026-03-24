export interface LearnCategory {
  slug: string;
  number: string;
  title: string;
  description: string;
  topics: string[];
}

export function getLearnCategories(locale: string = "uz"): LearnCategory[] {
  if (locale === "ru") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("./ru").learnCategories;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("./uz").learnCategories;
}
