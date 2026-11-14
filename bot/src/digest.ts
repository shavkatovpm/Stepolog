// Kunlik dayjest: har kuni kun oxirida (20:00) bugungi eng muhim postlar
import { GrammyError, InlineKeyboard, type Bot } from "grammy";
import { db, kvGet, kvSet } from "./db/index.ts";
import { config, FIELD_NAMES, DIGEST_TIMES } from "./config.ts";

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

// onlyTo berilsa, faqat o'sha chatga yuboriladi (test uchun)
export async function sendDigest(bot: Bot, onlyTo?: number, slot = "20:00") {
  for (const field of config.fields) {
    const { rows: posts } = await db.query<{ text: string }>(
      `SELECT text FROM posts WHERE field = $1 AND status = 'published' AND published_at > now() - interval '24 hours'
       ORDER BY score DESC, published_at DESC LIMIT 2`,
      [field],
    );
    if (!posts.length) continue;

    const users = onlyTo
      ? [{ tg_id: String(onlyTo) }]
      : (await db.query<{ tg_id: string }>(
          `SELECT tg_id FROM users u WHERE digest AND NOT blocked AND $1 = ANY(fields)
             AND NOT EXISTS (SELECT 1 FROM subscriptions s WHERE s.tg_id = u.tg_id AND s.field = $1 AND s.product = 'pro'
                             AND s.status = 'active' AND s.ends_at > now())`, // Pro obunachilari hammasini allaqachon oladi
          [field],
        )).rows;
    const kb = new InlineKeyboard().text("📢 Barcha yangiliklar: kanal", `o:ch:${field}`);
    const head = `<b>${FIELD_NAMES[field] ?? field}: bugungi eng muhimi</b>`;

    let sent = 0;
    for (const u of users) {
      try {
        await bot.api.sendMessage(u.tg_id, head, { parse_mode: "HTML" });
        for (let i = 0; i < posts.length; i++) {
          await bot.api.sendMessage(u.tg_id, posts[i].text, {
            parse_mode: "HTML",
            link_preview_options: { is_disabled: true },
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
    console.log(`[digest] ${field}: ${sent}/${users.length}`);
  }
}
