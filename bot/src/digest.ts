// Kunlik dayjest: har kuni kun oxirida (20:00) bugungi eng muhim postlar
import { GrammyError, InlineKeyboard, type Bot } from "grammy";
import { db, kvGet, kvSet } from "./db/index.ts";
import { config, FIELD_NAMES, DIGEST_TIMES } from "./config.ts";
import { channelFor, channelSubs } from "./publisher.ts";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function tashkentNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: config.tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  return { date: `${get("year")}-${get("month")}-${get("day")}`, hour: Number(get("hour")) };
}

export async function maybeSendDigest(bot: Bot) {
  const { date, hour } = tashkentNow();
  for (const slot of DIGEST_TIMES) {
    const h = Number(slot.slice(0, 2));
    if (hour < h || hour >= h + 2) continue; // kechikib ishga tushsa, eski vaqtdagi dayjest yuborilmaydi
    const key = `digest:${date}:${slot}`;
    if (await kvGet(key)) continue;
    await kvSet(key, "sending");
    await sendDigest(bot, undefined, slot);
    await kvSet(key, "done");
  }
}

// Har bir userga o'z sub-yo'nalishlari bo'yicha bugungi eng muhim postlar (bepulda birinchi 3 ta sub-yo'nalish).
// Ochiq (bepul) kanalga ham kunning eng muhimlari chiqadi. onlyTo berilsa, faqat o'sha chatga (test).
const PER_USER = 3;

export async function sendDigest(bot: Bot, onlyTo?: number, _slot = "20:00") {
  const users = onlyTo
    ? (await db.query<{ tg_id: string; subs: string[] }>("SELECT tg_id, subs FROM users WHERE tg_id = $1", [onlyTo])).rows
    : (await db.query<{ tg_id: string; subs: string[] }>(
        `SELECT tg_id, subs FROM users u WHERE digest AND NOT blocked
           AND NOT EXISTS (SELECT 1 FROM subscriptions s WHERE s.tg_id = u.tg_id AND s.product = 'pro'
                           AND s.status = 'active' AND s.ends_at > now())`, // Pro obunachilar hammasini allaqachon oladi
      )).rows;

  const kb = new InlineKeyboard().text("⚡ Hammasi chiqishi bilan: Dayjest Pro", "o:pro:all");
  let sent = 0;
  for (const u of users) {
    const { rows: posts } = await db.query<{ text: string }>(
      `SELECT text FROM posts WHERE status NOT IN ('rejected', 'deleted') AND created_at > now() - interval '24 hours'
         AND sub = ANY($1) ORDER BY score DESC, id DESC LIMIT $2`,
      [u.subs.slice(0, 3), PER_USER],
    );
    if (!posts.length) continue;
    try {
      await bot.api.sendMessage(u.tg_id, "<b>Bugungi eng muhimi</b>", { parse_mode: "HTML" });
      for (let i = 0; i < posts.length; i++) {
        await bot.api.sendMessage(u.tg_id, posts[i].text, {
          parse_mode: "HTML", link_preview_options: { is_disabled: true },
          reply_markup: i === posts.length - 1 ? kb : undefined,
        });
      }
      sent++;
    } catch (e) {
      if (e instanceof GrammyError && e.error_code === 403) {
        await db.query("UPDATE users SET blocked = true WHERE tg_id = $1", [u.tg_id]);
      } else console.warn(`[digest] ${u.tg_id}:`, e instanceof Error ? e.message : e);
    }
    await sleep(120); // Telegram limiti: sekundiga ~30 xabar
  }
  console.log(`[digest] ${sent}/${users.length}`);

  // Ochiq (bepul) kanallar: har yo'nalish bo'yicha kunning eng muhim 2 ta posti
  if (onlyTo) return;
  for (const field of config.fields) {
    const pub = await channelFor(field, "public");
    if (!pub) continue;
    const { rows: top } = await db.query<{ text: string }>(
      `SELECT text FROM posts WHERE field = $1 AND status NOT IN ('rejected', 'deleted') AND created_at > now() - interval '24 hours'
         AND sub = ANY($2) ORDER BY score DESC LIMIT 2`,
      [field, await channelSubs(field)],
    );
    if (!top.length) continue;
    try {
      await bot.api.sendMessage(pub, `<b>${FIELD_NAMES[field] ?? field}: bugungi eng muhimi</b>`, { parse_mode: "HTML" });
      for (const p of top) await bot.api.sendMessage(pub, p.text, { parse_mode: "HTML", link_preview_options: { is_disabled: true } });
    } catch (e) {
      console.warn(`[digest] ochiq kanal ${field}:`, e instanceof Error ? e.message : e);
    }
  }
}
