export interface RoadmapStep {
  level: string;
  title: string;
  skills: string[];
  duration: string;
  salary: string;
}

export interface Career {
  slug: string;
  title: string;
  description: string;
  level: string;
  skills: string[];
  whatDoes: string[];
  companyRole: string;
  roadmap: RoadmapStep[];
}

export const levelColor: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-500",
  middle: "bg-yellow-500/10 text-yellow-500",
  advanced: "bg-red-500/10 text-red-500",
};

export function getCareers(locale: string): Career[] {
  if (locale === "ru") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("./ru").careers;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("./uz").careers;
}

export function getLevelLabels(locale: string): Record<string, string> {
  if (locale === "ru") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("./ru").levelLabels;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("./uz").levelLabels;
}

export function getCareerBySlug(
  slug: string,
  locale: string = "uz"
): Career | undefined {
  const careers = getCareers(locale);
  return careers.find((c) => c.slug === slug);
}
