import type { Settings } from "./types";

export const STORAGE_KEY = "stepolog_moded";

export const DEFAULT_PROMPT_ROLE = `Sen professional SEO va GEO (AI optimizatsiya) mutaxassisi sifatida quyidagi maqolani yozishingiz kerak.`;

export const DEFAULT_PROMPT_SEO = `- Asosiy keyword sarlavha, birinchi paragraf va H2 larda ishlatilsin
- Qo'shimcha keywordlar matn ichida tabiiy tarzda ishlatilsin
- Maqola ichida tegishli internal linklar avtomatik qo'shilsin`;

export const DEFAULT_PROMPT_GEO = `- Ishonchli manbalardan foydalanilsin (gov.uz, lex.uz, stat.uz)
- Faktlar va statistikalar aniq manbalar bilan boyitilsin
- Brand nomi maqolada organik tarzda tilga olinsin
- AI tizimlar uchun qisqa va aniq javoblar berilsin`;

export const DEFAULT_PROMPT_WRITING = `- Maqola o'zbek tilida, professional va tushunarli uslubda yozilsin
- H1, H2, H3 sarlavhalar to'g'ri ishlatilsin (SEO uchun)
- Paragraflar qisqa va o'qishga qulay bo'lsin
- Faktlar va statistikalar bilan boyitilsin
- Kamida 1500 so'z bo'lsin
- CTA (call-to-action) qo'shilsin
- Markdown formatida yoz`;

export const DEFAULT_SETTINGS: Settings = {
  promptRole: DEFAULT_PROMPT_ROLE,
  promptSeo: DEFAULT_PROMPT_SEO,
  promptGeo: DEFAULT_PROMPT_GEO,
  promptWriting: DEFAULT_PROMPT_WRITING,
  adminLogin: "stepologad",
  adminPassword: "stepologad321",
};

export const INTENT_LABELS: Record<string, string> = {
  informational: "Informational",
  commercial: "Commercial",
  navigational: "Navigational",
};

export const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  planned: { label: "Rejada", color: "var(--m-yellow)", icon: "📋" },
  ready: { label: "Tayyor", color: "var(--m-blue)", icon: "✅" },
  published: { label: "Joylashtirildi", color: "var(--m-green)", icon: "🚀" },
};

export const COLORS = [
  "color-1", "color-2", "color-3", "color-4", "color-5",
  "color-6", "color-7", "color-8", "color-9", "color-10",
];

export const COLOR_HEX: Record<string, string> = {
  "color-1": "#FFFFFF", "color-2": "#888888", "color-3": "#A0522D",
  "color-4": "#FFDE59", "color-5": "#FF8A4C", "color-6": "#43D08A",
  "color-7": "#5B9CF6", "color-8": "#C084FC", "color-9": "#F472B6",
  "color-10": "#FF5F5F",
};

export const MONTH_NAMES = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];
export const WEEKDAYS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
