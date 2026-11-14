function need(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`.env da ${name} yo'q`);
  return v;
}

export const config = {
  botToken: need("BOT_TOKEN"),
  databaseUrl: need("DATABASE_URL"),
  adminChatId: Number(need("ADMIN_CHAT_ID")), // tasdiqlash guruhi
  channels: { marketing: Number(need("CHANNEL_MARKETING")) } as Record<string, number>,
  channelLinks: { marketing: process.env.CHANNEL_MARKETING_LINK ?? "" } as Record<string, string>,
  // ANTHROPIC_API_KEY ni SDK o'zi o'qiydi

  models: {
    filter: "claude-haiku-5-5", // saralash: arzon
    writer: "claude-sonnet-5-5", // o'zbekcha post: sifatli
  },
  minScore: Number(process.env.MIN_SCORE ?? 7), // shu balldan yuqorisi post bo'ladi
  fetchEveryMin: Number(process.env.FETCH_EVERY_MIN ?? 20),
  digestHour: 20, // Toshkent vaqti
  tz: "Asia/Tashkent",
};

export const FIELD_NAMES: Record<string, string> = { marketing: "Marketing" };
