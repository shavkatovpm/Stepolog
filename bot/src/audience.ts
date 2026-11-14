// Auditoriya: postlar qaysi tilda yoziladi va kimga moslanadi.
// Stepolog faqat O'zbekiston uchun emas: keyin rus va ingliz auditoriyasi qo'shiladi (yangi yozuv + AUDIENCE env).
export type Audience = {
  id: string;
  lang: string; // post tili (promptda)
  writeAs: string; // tabiiy yozish uchun ko'rsatma
  market: string; // o'quvchilar bozori
  platforms: string; // shu bozorda asosiy va ishlamaydigan platformalar
};

export const AUDIENCES: Record<string, Audience> = {
  uz: {
    id: "uz",
    lang: "o'zbek tili (lotin yozuvi, o' va g' da oddiy apostrof ')",
    writeAs: "O'zbek odami qanday gapirsa, shunday yozing.",
    market: "O'zbekiston",
    platforms: "Asosiy platformalar: Instagram, Telegram, Meta Ads, Google Ads, YouTube, TikTok. Ishlamaydiganlari: Amazon, Walmart, eBay, Etsy, Shopify reklamalari, AQSh retail media.",
  },
  // ru: { ... }, en: { ... } — keyinroq
};

export const AUDIENCE = AUDIENCES[process.env.AUDIENCE ?? "uz"];
