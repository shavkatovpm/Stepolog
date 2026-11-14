// Oddiy foydalanuvchilar: /start, /stop
import { InlineKeyboard, type Bot } from "grammy";
import { db } from "./db/index.ts";
import { config, FIELD_NAMES } from "./config.ts";

// Matn hech bir sohaga bog'lanmaydi: Stepolog istalgan soha uchun. Ochiq sohalar ro'yxati configdan olinadi.
const START = () => `Salom! Men Stepolog.

Xorijiy saytlarda sohangiz bo'yicha chiqqan eng muhim yangiliklarni saralab, har kuni soat 20:00 da o'zbek tilida qisqa qilib yuboraman.

Hozir ochiq: ${config.fields.map((f) => FIELD_NAMES[f] ?? f).join(", ")}. Yangi sohalar qo'shilib boradi.

Dayjestni to'xtatish: /stop`;

export function registerUsers(bot: Bot) {
  const priv = bot.chatType("private");

  priv.command("start", async (ctx) => {
    await db.query(
      `INSERT INTO users (tg_id, first_name, username) VALUES ($1, $2, $3)
       ON CONFLICT (tg_id) DO UPDATE SET first_name = $2, username = $3, blocked = false, digest = true`,
      [ctx.from.id, ctx.from.first_name, ctx.from.username ?? null],
    );
    const link = config.channelLinks[config.fields[0]];
    await ctx.reply(START(), {
      reply_markup: link ? new InlineKeyboard().url("Barcha yangiliklar kanalda", link) : undefined,
    });
  });

  priv.command("stop", async (ctx) => {
    await db.query("UPDATE users SET digest = false WHERE tg_id = $1", [ctx.from.id]);
    await ctx.reply("Kunlik dayjest to'xtatildi. Qayta yoqish: /start");
  });
}
