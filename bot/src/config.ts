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
  ["smm", "SMM"], ["ai", "Sun'iy intellekt"], ["it", "Dasturlash"], ["ecommerce", "E-commerce"], ["design", "Dizayn"],
];

// Tariflar: oylik narx va muddat bo'yicha chegirma (sayt bilan bir xil)
export const PRICING = {
  monthly: Number(process.env.PRICE_MONTHLY ?? 27000),
  discounts: { 1: 0, 3: 5, 6: 10, 12: 30 } as Record<number, number>,
};
export const priceFor = (months: number) => Math.round(PRICING.monthly * months * (1 - PRICING.discounts[months] / 100));
export const som = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";

export const DIGEST_TIMES = ["08:00", "13:00", "20:00", "22:00"];
export const SITE_LIMIT = Number(process.env.SITE_LIMIT ?? 2); // bepul tarifda kuzatiladigan sayt
export const SITE_DAILY = 10; // bitta userga saytlardan kuniga ko'pi bilan
export const PAY_CARD = process.env.PAY_CARD ?? ""; // to'lov uchun karta raqami
export const SUPPORT = process.env.SUPPORT ?? ""; // yordam uchun @username
