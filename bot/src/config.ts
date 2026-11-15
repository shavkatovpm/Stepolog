function need(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`.env da ${name} yo'q`);
  return v;
}

export const config = {
  botToken: need("BOT_TOKEN"),
  databaseUrl: need("DATABASE_URL"),
  adminChatId: Number(need("ADMIN_CHAT_ID")), // hozircha egasining shaxsiy chati, keyin guruh
  fields: ["marketing"],
  // Kanal hali yo'q bo'lsa bo'sh qoladi: tasdiqlangan post faqat bazada belgilanadi
  channels: { marketing: Number(process.env.CHANNEL_MARKETING) || 0 } as Record<string, number>,
  channelLinks: { marketing: process.env.CHANNEL_MARKETING_LINK ?? "" } as Record<string, string>,
  // ANTHROPIC_API_KEY ni SDK o'zi o'qiydi

  models: {
    filter: "claude-haiku-5-5", // saralash: arzon
    writer: "claude-sonnet-5-5", // o'zbekcha post: sifatli
  },
  minScore: Number(process.env.MIN_SCORE ?? 7), // shu balldan yuqorisi post bo'ladi
  fetchEveryMin: Number(process.env.FETCH_EVERY_MIN ?? 20),
  // Test (lokal) uchun tejamkor sozlamalar
  autoCycle: process.env.AUTO_CYCLE !== "0", // 0 bo'lsa faqat /yangila bilan ishlaydi
  scoreLimit: Number(process.env.SCORE_LIMIT ?? 100), // bir aylanishda baholanadigan maqola
  writeLimit: Number(process.env.WRITE_LIMIT ?? 10), // bir aylanishda yoziladigan post
  maxAgeH: Number(process.env.MAX_AGE_H ?? 48), // bundan eski maqola olinmaydi
  digestHour: 20, // Toshkent vaqti
  tz: "Asia/Tashkent",
};

export const FIELD_NAMES: Record<string, string> = { marketing: "Marketing" };

// Hali ochilmagan sohalar: userlar "menga kerak" deb ovoz beradi
export const SOON_FIELDS: [string, string][] = [
  ["it", "Dasturlash va IT"], ["design", "Dizayn"], ["business", "Biznes va startaplar"], ["finance", "Moliya"], ["edu", "Ta'lim"],
];

// Tariflar: aniq narxlar (so'm) va ko'rsatiladigan chegirma (sayt bilan bir xil bo'lishi kerak)
export const PRICING = {
  monthly: 27000,
  plans: { 1: 27000, 12: 226000 } as Record<number, number>,
  discounts: { 1: 0, 12: 30 } as Record<number, number>,
};
export const priceFor = (months: number) => PRICING.plans[months];

// Mavzular: bepulda 3 tagacha, Dayjest Pro'da yo'nalishdagi hammasi (qo'shimcha to'lovsiz)
export const FREE_SUBS = 3;
export const PRO_SLOTS = 99;
export const som = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";

export const DIGEST_TIMES = ["20:00"]; // dayjest hammaga bir vaqtda, kun oxirida (user tanlamaydi)
export const SITE_LIMIT = Number(process.env.SITE_LIMIT ?? 2); // bepul tarifda kuzatiladigan sayt
export const SITE_DAILY = 10; // bitta userga saytlardan kuniga ko'pi bilan
export const PAY_CARD = process.env.PAY_CARD ?? ""; // to'lov uchun karta raqami
export const SUPPORT = process.env.SUPPORT ?? ""; // yordam uchun @username
