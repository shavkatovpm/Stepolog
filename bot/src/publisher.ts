// Kanalga chiqarish: qo'lda (✅) yoki avtomatik navbat bilan
import { InlineKeyboard, type Api, type Bot } from "grammy";
import { db, kvGet } from "./db/index.ts";
import { config } from "./config.ts";

const GAP_MIN = 120; // kanalda postlar orasidagi eng kam vaqt (2 soat)
const MAX_PER_DAY = 5; // kanalga kuniga ko'pi bilan
const HOURS = [9, 21]; // faqat kunduzi chiqadi (Toshkent vaqti)

const tashkentHour = () =>
  Number(new Intl.DateTimeFormat("en-GB", { timeZone: config.tz, hour: "2-digit", hourCycle: "h23" }).format(new Date()));
const MAX_AGE_H = 24; // bundan eski qoralama avtomatik chiqmaydi
const PER_SOURCE = 2; // bitta manbadan kuniga ko'pi bilan

export const isAuto = async () => (await kvGet("mode")) !== "manual";

export async function channelFor(field: string) {
  return config.channels[field] || Number(await kvGet(`channel:${field}`)) || 0;
}

export const publishedKeyboard = (id: number) => new InlineKeyboard().text("🗑 Kanaldan o'chirish", `del:${id}`);

type Post = { id: number; field: string; text: string; admin_msg_id: string | number | null };

// Postni kanalga chiqaradi va admindagi xabarni yangilaydi. Kanal bo'lmasa faqat bazada belgilanadi.
export async function publishPost(api: Api, post: Post) {
  const channel = await channelFor(post.field);
  let channelMsgId: number | null = null;
  if (channel) {
    const msg = await api.sendMessage(channel, post.text, { parse_mode: "HTML", link_preview_options: { is_disabled: true } });
    channelMsgId = msg.message_id;
  }
  await db.query("UPDATE posts SET status = 'published', channel_msg_id = $2, published_at = now() WHERE id = $1", [post.id, channelMsgId]);
  if (post.admin_msg_id) {
    await api
      .editMessageReplyMarkup(config.adminChatId, Number(post.admin_msg_id), {
        reply_markup: channelMsgId ? publishedKeyboard(post.id) : undefined,
      })
      .catch(() => {});
  }
  return Boolean(channel);
}

// Har 5 daqiqada: navbatdagi eng yuqori balli qoralamani chiqaradi (oraliq va kunlik limit bilan)
export async function autoPublish(bot: Bot) {
  if (!(await isAuto())) return;
  const h = tashkentHour();
  if (h < HOURS[0] || h >= HOURS[1]) return;
  for (const field of config.fields) {
    if (!(await channelFor(field))) continue;
    const { rows: [s] } = await db.query<{ last: Date | null; today: string }>(
      `SELECT max(published_at) AS last,
              count(*) FILTER (WHERE published_at > now() - interval '24 hours') AS today
       FROM posts WHERE field = $1 AND status = 'published' AND channel_msg_id IS NOT NULL`,
      [field],
    );
    if (s.last && Date.now() - new Date(s.last).getTime() < GAP_MIN * 60_000) continue;
    if (Number(s.today) >= MAX_PER_DAY) continue;

    const { rows: [post] } = await db.query<Post>(
      `SELECT p.id, p.field, p.text, p.admin_msg_id FROM posts p
       JOIN articles a ON a.id = p.article_id
       WHERE p.field = $1 AND p.status = 'draft' AND p.created_at > now() - make_interval(hours => $2)
         AND (SELECT count(*) FROM posts p2 JOIN articles a2 ON a2.id = p2.article_id
              WHERE a2.source_id = a.source_id AND p2.status = 'published'
                AND p2.published_at > now() - interval '24 hours') < $3
       ORDER BY p.score DESC, p.id LIMIT 1`,
      [field, MAX_AGE_H, PER_SOURCE],
    );
    if (!post) continue;
    await publishPost(bot.api, post);
    console.log(`[publish] #${post.id} kanalga chiqdi`);
  }
}
