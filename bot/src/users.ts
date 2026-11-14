// Oddiy foydalanuvchilar: /start, /stop
import { InlineKeyboard, type Bot } from "grammy";
import { db } from "./db/index.ts";
import { config } from "./config.ts";

const START = `Salom! Men Stepolog botiman.

Marketing bo'yicha xorijiy saytlarni kuzatib, eng muhim 1-2 yangilikni har kuni soat 20:00 da o'zbek tilida yuboraman.

Barcha yangiliklar darhol kerak bo'lsa, pullik kanalimiz bor.

Dayjestni to'xtatish: /stop`;

export function registerUsers(bot: Bot) {
  const priv = bot.chatType("private");

  priv.command("start", async (ctx) => {
    await db.query(
      `INSERT INTO users (tg_id, first_name, username) VALUES ($1, $2, $3)
       ON CONFLICT (tg_id) DO UPDATE SET first_name = $2, username = $3, blocked = false, digest = true`,
      [ctx.from.id, ctx.from.first_name, ctx.from.username ?? null],
    );
    const link = config.channelLinks.marketing;
    await ctx.reply(START, {
      reply_markup: link ? new InlineKeyboard().url("Pullik kanal haqida", link) : undefined,
    });
  });

  priv.command("stop", async (ctx) => {
    await db.query("UPDATE users SET digest = false WHERE tg_id = $1", [ctx.from.id]);
    await ctx.reply("Kunlik dayjest to'xtatildi. Qayta yoqish: /start");
  });
}
