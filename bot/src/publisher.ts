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

// Har yo'nalishning ikki kanali: "pro" = yopiq (barcha postlar chiqishi bilan), "public" = ochiq (bepul, kunlik dayjest)
export type ChannelKind = "pro" | "public";
export async function channelFor(field: string, kind: ChannelKind = "pro") {
  if (kind === "pro" && config.channels[field]) return config.channels[field];
  return Number(await kvGet(`channel:${field}:${kind}`)) || (kind === "pro" ? Number(await kvGet(`channel:${field}`)) : 0) || 0;
}
export const publicLink = (field: string) => kvGet(`channel_link:${field}:public`);

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
  await deliverPro(api, post);
  if (post.admin_msg_id) {
    await api
      .editMessageReplyMarkup(config.adminChatId, Number(post.admin_msg_id), {
        reply_markup: channelMsgId ? publishedKeyboard(post.id) : undefined,
      })
      .catch(() => {});
  }
  return Boolean(channel);
}

// Dayjest Pro obunachilariga post chiqishi bilan botga yuboriladi
async function deliverPro(api: Api, post: Post) {
  const { rows } = await db.query<{ tg_id: string }>(
    `SELECT DISTINCT s.tg_id FROM subscriptions s JOIN users u ON u.tg_id = s.tg_id
     WHERE s.product = 'pro' AND s.status = 'active' AND s.ends_at > now() AND NOT u.blocked
       AND $1 = ANY(u.fields[1:s.slots])`, // to'langan yo'nalishlar soni bo'yicha
    [post.field],
  );
  for (const r of rows) {
    await api.sendMessage(r.tg_id, post.text, { parse_mode: "HTML", link_preview_options: { is_disabled: true } })
      .catch((e) => console.warn(`[pro] ${r.tg_id}:`, e?.description ?? e));
    await new Promise((res) => setTimeout(res, 50));
  }
  if (rows.length) console.log(`[pro] #${post.id} → ${rows.length} ta obunachi`);
}

// Har 5 daqiqada: navbatdagi eng yuqori balli qoralamani chiqaradi (oraliq va kunlik limit bilan)
// force: test uchun vaqt, oraliq va kunlik limitni e'tiborsiz qoldiradi
export async function autoPublish(bot: Bot, force = false) {
  if (!force && !(await isAuto())) return;
  const h = tashkentHour();
  if (!force && (h < HOURS[0] || h >= HOURS[1])) return;
  for (const field of config.fields) {
    if (!force && !(await channelFor(field))) continue;
    const { rows: [s] } = await db.query<{ last: Date | null; today: string }>(
      `SELECT max(published_at) AS last,
              count(*) FILTER (WHERE published_at > now() - interval '24 hours') AS today
       FROM posts WHERE field = $1 AND status = 'published' AND channel_msg_id IS NOT NULL`,
      [field],
    );
    if (!force && s.last && Date.now() - new Date(s.last).getTime() < GAP_MIN * 60_000) continue;
    if (!force && Number(s.today) >= MAX_PER_DAY) continue;

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
