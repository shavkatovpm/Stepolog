// Eski Stepolog (v1, archive/v1 branch) URL'lari.
// Google ularni indeksdan tezroq olib tashlashi uchun 410 Gone qaytaramiz.
// Kamida 2027-11 gacha saqlansin. Yangi sahifa shu yo'llardan birini egallasa,
// uni bu ro'yxatdan olib tashlang.

// Mavzusi yangi mahsulotga yaqin sahifalar: 410 o'rniga 301.
// /marketing kanal sahifasi ochilganda manzilni "/marketing" ga o'zgartiring.
export const LEGACY_REDIRECTS: Record<string, string> = {
  "/learn/marketing": "/",
  "/learn/marketing/seo-0-dan-google-1-orin": "/",
  "/learn/marketing/telegram-marketing-1000-100000-obunaga": "/",
};

// Butunlay yopilgan bo'limlar: shu prefiks bilan boshlangan har qanday yo'l 410.
const GONE_PREFIXES = ["/kasblar", "/agentliklar", "/modad", "/test"];

// Yangi saytda qayta ishlatilishi mumkin bo'lgan bo'limlar: faqat aniq yo'llar 410.
const GONE_EXACT = new Set<string>([
  "/blog",
  "/blog/ai-bilan-pul-ishlash-2026",
  "/blog/internetdan-pul-ishlash-ozbekistonda",
  "/blog/it-park-rezidentligi-ariza-imtiyozlar-2026",
  "/blog/kasbni-ozgartirish-it-yol-xarita",
  "/blog/ozbekistonda-eng-yuqori-maosh-beruvchi-it-kasblar",
  "/blog/ozbekistonda-startap-ochish",
  "/blog/ozbekistonda-startapni-0-dan-boshlash",
  "/blog/telegram-bot-bilan-biznes-ozbekiston",
  "/blog/xorijdan-masofadan-ishlash-ozbekiston",
  "/learn",
  "/learn/bozor-tushunish",
  "/learn/bozor-tushunish/target-audience-mijoz-portreti",
  "/learn/goya-topish",
  "/learn/goya-topish/ozbekistonda-25-startap-goyasi-2026",
  "/learn/goya-topish/startap-goya-topish",
  "/learn/monetizatsiya",
  "/learn/monetizatsiya/saas-pricing-ozbekiston-narx-belgilash",
  "/learn/mvp",
  "/learn/mvp/mvp-nima-va-qanday-qurish",
  "/learn/mvp/no-code-mvp-tilda-bubble-glide",
  "/learn/product-market-fit",
  "/learn/product-market-fit/mvpdan-keyingi-bosqich",
  "/learn/scaling",
  "/learn/scaling/pre-seed-seed-investitsiya-ozbekiston",
  "/learn/startup-nima",
  "/learn/startup-nima/founder-mindset-muvaffaqiyatli-asoschilar",
  "/learn/startup-nima/startap-nima-va-oddiy-biznesdan-farqi",
  "/learn/texnologiya",
  "/learn/texnologiya/tech-stack-tanlash-2026",
  "/about",
  "/about/bilim",
  "/about/hamjamiyat",
  "/about/missiya",
  "/about/yol-xarita",
]);

export type LegacyResult =
  | { type: "redirect"; to: string }
  | { type: "gone" }
  | null;

export function matchLegacy(rawPath: string): LegacyResult {
  let path = rawPath.replace(/\/+$/, "") || "/";

  // v1: o'zbekcha prefikssiz, ruscha /ru/... edi.
  // v2: "/" inglizcha, "/uz" va "/ru" yangi sahifalar. Shuning uchun faqat aniq eski yo'llar ushlanadi.
  const isRu = path.startsWith("/ru/");
  if (isRu) path = path.slice(3);

  if (LEGACY_REDIRECTS[path]) return { type: "redirect", to: isRu ? "/ru" : "/uz" };
  if (GONE_EXACT.has(path)) return { type: "gone" };
  if (GONE_PREFIXES.some((p) => path === p || path.startsWith(p + "/"))) {
    return { type: "gone" };
  }
  return null;
}
