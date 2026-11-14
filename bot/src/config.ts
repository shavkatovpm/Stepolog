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
