// Post oqimi:
//   draft     → AI yozdi, admin ko'rib chiqishi mumkin
//   approved  → admin ✅ bosdi yoki avtomatik rejimda HOLD_MIN o'tdi (❌ bosilmagan bo'lsa)
//   published → egasining kanaliga chiqdi
// Userlarga (Pro va kunlik dayjest) faqat approved/published postlar boradi.
import { InlineKeyboard, type Api, type Bot } from "grammy";
import { db, kvGet } from "./db/index.ts";
import { config } from "./config.ts";
import { FIELD_SUBS } from "./criteria.ts";
import { sendSafe } from "./tg.ts";

const GAP_MIN = 120; // kanalda postlar orasidagi eng kam vaqt (2 soat)
const MAX_PER_DAY = 5; // kanalga kuniga ko'pi bilan
const HOURS = [9, 21]; // kanalga faqat kunduzi (Toshkent vaqti)
const PRO_HOURS = [8, 23]; // Pro userlarga kechasi xabar yuborilmaydi
const PRO_DAILY = 5; // bitta Pro userga kuniga ko'pi bilan (menyuda "kuniga 5 tagacha" deyilgan)
const HOLD_MIN = 30; // avtomatik rejimda admin ❌ bosishi uchun vaqt
const MAX_AGE_H = 24; // bundan eski post kanalga ham, Pro'ga ham chiqmaydi
const PER_SOURCE = 2; // bitta manbadan kanalga kuniga ko'pi bilan
const TODAY = "(date_trunc('day', now() AT TIME ZONE 'Asia/Tashkent') AT TIME ZONE 'Asia/Tashkent')";

export const READY = ["approved", "published"]; // userlarga ko'rinadigan holatlar

const tashkentHour = () =>
  Number(new Intl.DateTimeFormat("en-GB", { timeZone: config.tz, hour: "2-digit", hourCycle: "h23" }).format(new Date()));

export const isAuto = async () => (await kvGet("mode")) !== "manual";

// Har yo'nalishning ikki kanali: "pro" = yopiq (barcha postlar), "public" = ochiq (bepul, kunlik dayjest)
export type ChannelKind = "pro" | "public";
export async function channelFor(field: string, kind: ChannelKind = "pro") {
  if (kind === "pro" && config.channels[field]) return config.channels[field];
  return Number(await kvGet(`channel:${field}:${kind}`)) || (kind === "pro" ? Number(await kvGet(`channel:${field}`)) : 0) || 0;
}
export const publicLink = (field: string) => kvGet(`channel_link:${field}:public`);

// Kanalga qaysi mavzular chiqadi (egasi /kanal bilan sozlaydi). Standart: SEO'dan boshqa hammasi
export async function channelSubs(field: string): Promise<string[]> {
  const v = await kvGet(`channel_subs:${field}`);
  return v ? v.split(",") : (FIELD_SUBS[field] ?? []).map((c) => c.id).filter((id) => id !== "seo");
}

export const publishedKeyboard = (id: number) => new InlineKeyboard().text("🗑 Kanaldan o'chirish", `del:${id}`);
export const approvedKeyboard = (id: number) => new InlineKeyboard().text("📢 Kanalga chiqarish", `pub:${id}`).text("❌ Bekor qilish", `rej:${id}`);

type Post = { id: number; field: string; sub: string | null; text: string; admin_msg_id: string | number | null };

const setAdminKb = (api: Api, post: Post, kb?: InlineKeyboard) =>
  post.admin_msg_id
    ? api.editMessageReplyMarkup(config.adminChatId, Number(post.admin_msg_id), { reply_markup: kb }).catch(() => {})
    : Promise.resolve();

// Tasdiqlash (kanalga chiqarmasdan). Faqat draft bo'lsa ishlaydi: ikki marta bosilsa ham bir marta bajariladi
export async function approvePost(api: Api, id: number) {
  const { rows: [p] } = await db.query<Post>(
    "UPDATE posts SET status = 'approved', approved_at = now() WHERE id = $1 AND status = 'draft' RETURNING id, field, sub, text, admin_msg_id",
    [id],
  );
  if (p) await setAdminKb(api, p, approvedKeyboard(p.id));
  return Boolean(p);
}

// Kanalga chiqarish. Avval post "egallanadi" (publishing), shunda bir vaqtda ikki joydan chiqarilmaydi
export async function publishToChannel(api: Api, id: number): Promise<"published" | "approved" | "busy"> {
  const { rows: [p] } = await db.query<Post & { prev: string }>(
    `UPDATE posts SET status = 'publishing', approved_at = COALESCE(approved_at, now())
     WHERE id = $1 AND status IN ('draft', 'approved') RETURNING id, field, sub, text, admin_msg_id`,
    [id],
  );
  if (!p) return "busy";
  const channel = await channelFor(p.field);
  if (!channel) {
    await db.query("UPDATE posts SET status = 'approved' WHERE id = $1", [p.id]);
    await setAdminKb(api, p, approvedKeyboard(p.id));
    return "approved";
  }
  try {
    const msg = await api.sendMessage(channel, p.text, { parse_mode: "HTML", link_preview_options: { is_disabled: true } });
    await db.query("UPDATE posts SET status = 'published', channel_msg_id = $2, published_at = now() WHERE id = $1", [p.id, msg.message_id]);
  } catch (e) {
    await db.query("UPDATE posts SET status = 'approved' WHERE id = $1", [p.id]); // keyin qayta urinish mumkin
    throw e;
  }
  await setAdminKb(api, p, publishedKeyboard(p.id));
  return "published";
}

// Har 2 daqiqada: avtomatik rejimda vaqti o'tgan qoralamalar tasdiqlanadi, juda eskilari tashlanadi
export async function autoApprove(api: Api) {
  if (await isAuto()) {
    const { rows } = await db.query<Post>(
      `UPDATE posts SET status = 'approved', approved_at = now()
       WHERE status = 'draft' AND created_at < now() - make_interval(mins => $1) RETURNING id, field, sub, text, admin_msg_id`,
      [HOLD_MIN],
    );
    for (const p of rows) await setAdminKb(api, p, approvedKeyboard(p.id));
  }
  await db.query("UPDATE posts SET status = 'expired' WHERE status = 'draft' AND created_at < now() - interval '48 hours'");
}

// Kanalga navbat: kuniga 5 tagacha, 2 soat oraliq, kunduzi, bitta manbadan 2 tagacha, faqat kanal mavzulari
// force: /chiqar uchun vaqt, oraliq va kunlik limitni e'tiborsiz qoldiradi (qoralamani ham oladi)
export async function autoPublish(bot: Bot, force = false) {
  if (!force && !(await isAuto())) return;
  const h = tashkentHour();
  if (!force && (h < HOURS[0] || h >= HOURS[1])) return;
  for (const field of config.fields) {
    if (!(await channelFor(field))) continue;
    const { rows: [s] } = await db.query<{ last: Date | null; today: string }>(
      `SELECT max(published_at) AS last, count(*) FILTER (WHERE published_at >= ${TODAY}) AS today
       FROM posts WHERE field = $1 AND status = 'published' AND channel_msg_id IS NOT NULL`,
      [field],
    );
    if (!force && s.last && Date.now() - new Date(s.last).getTime() < GAP_MIN * 60_000) continue;
    if (!force && Number(s.today) >= MAX_PER_DAY) continue;

    const { rows: [next] } = await db.query<{ id: number }>(
      `SELECT p.id FROM posts p JOIN articles a ON a.id = p.article_id
       WHERE p.field = $1 AND p.status = ANY($5) AND p.created_at > now() - make_interval(hours => $2)
         AND (SELECT count(*) FROM posts p2 JOIN articles a2 ON a2.id = p2.article_id
              WHERE a2.source_id = a.source_id AND p2.status = 'published' AND p2.published_at >= ${TODAY}) < $3
         AND p.sub = ANY($4)
       ORDER BY p.score DESC, p.id LIMIT 1`,
      [field, MAX_AGE_H, PER_SOURCE, await channelSubs(field), force ? ["draft", "approved"] : ["approved"]],
    );
    if (!next) continue;
    const r = await publishToChannel(bot.api, next.id);
    if (r === "published") console.log(`[publish] #${next.id} kanalga chiqdi`);
  }
}

// Har 2 daqiqada: tasdiqlangan postlar Pro userlarga (o'z mavzulari bo'yicha, kuniga 5 tagacha, kechasi emas)
export async function deliverProQueue(api: Api) {
  const h = tashkentHour();
  if (h < PRO_HOURS[0] || h >= PRO_HOURS[1]) return;
  const { rows: posts } = await db.query<{ id: number; sub: string; text: string }>(
    `UPDATE posts SET pro_sent = true WHERE id IN (
       SELECT id FROM posts WHERE status = ANY($1) AND NOT pro_sent AND sub IS NOT NULL
         AND created_at > now() - make_interval(hours => $2) ORDER BY score DESC, id LIMIT 20 FOR UPDATE SKIP LOCKED)
     RETURNING id, sub, text`,
    [READY, MAX_AGE_H],
  );
  for (const post of posts) {
    const { rows } = await db.query<{ tg_id: string }>(
      `SELECT DISTINCT u.tg_id FROM subscriptions s JOIN users u ON u.tg_id = s.tg_id
       WHERE s.product = 'pro' AND s.status = 'active' AND s.ends_at > now() AND NOT u.blocked
         AND $1 = ANY(u.subs[1:s.slots])
         AND (SELECT count(*) FROM pro_deliveries d WHERE d.tg_id = u.tg_id AND d.sent_at >= ${TODAY}) < $2`,
      [post.sub, PRO_DAILY],
    );
    for (const r of rows) {
      const ok = await sendSafe(api, r.tg_id, post.text, { parse_mode: "HTML", link_preview_options: { is_disabled: true } });
      if (ok) await db.query("INSERT INTO pro_deliveries (tg_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [r.tg_id, post.id]);
      await new Promise((res) => setTimeout(res, 50));
    }
    if (rows.length) console.log(`[pro] #${post.id} → ${rows.length} ta obunachi`);
  }
}
