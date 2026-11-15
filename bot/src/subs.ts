// Pullik kanal obunasi: chekni admin tasdiqlaydi → bir martalik havola; muddat tugashi oldidan eslatma, tugaganda chiqarish
import { GrammyError, InlineKeyboard, type Api, type Bot } from "grammy";
import { db } from "./db/index.ts";
import { config, FIELD_NAMES, som } from "./config.ts";
import { channelFor } from "./publisher.ts";

type Sub = { id: number; tg_id: string; field: string; product: string; slots: number; months: number; amount: number; status: string; receipt_file_id: string | null; ends_at: Date | null };
const getSub = async (id: number) => (await db.query<Sub>("SELECT * FROM subscriptions WHERE id = $1", [id])).rows[0];
const monthsLabel = (m: number) => `${m} oy`;
const subName = (s: Sub) => (s.product === "pro" ? "Dayjest Pro" : `${FIELD_NAMES[s.field] ?? s.field} kanali`);
const fmtDate = (d: Date) => new Intl.DateTimeFormat("uz-UZ", { timeZone: config.tz, day: "2-digit", month: "2-digit", year: "numeric" }).format(d);

export async function notifyAdminReceipt(api: Api, subId: number) {
  const s = await getSub(subId);
  const { rows: [u] } = await db.query<{ first_name: string | null; username: string | null }>("SELECT first_name, username FROM users WHERE tg_id = $1", [s.tg_id]);
  const who = `${u?.first_name ?? ""}${u?.username ? ` @${u.username}` : ""} (id ${s.tg_id})`;
  const msg = await api.sendPhoto(config.adminChatId, s.receipt_file_id!, {
    caption: `🧾 Yangi to'lov #${s.id}\n\n${who}\n${subName(s)} · ${monthsLabel(s.months)}\nSumma: ${som(s.amount)}`,
    reply_markup: new InlineKeyboard().text("✅ Tasdiqlash", `sub_ok:${s.id}`).text("❌ Rad etish", `sub_no:${s.id}`),
  });
  await db.query("UPDATE subscriptions SET admin_msg_id = $2 WHERE id = $1", [s.id, msg.message_id]);
}

export function registerSubs(bot: Bot) {
  const admin = bot.filter((ctx) => ctx.chat?.id === config.adminChatId);

  admin.callbackQuery(/^sub_ok:(\d+)$/, async (ctx) => {
    const s = await getSub(Number(ctx.match[1]));
    if (!s || s.status !== "pending") return ctx.answerCallbackQuery("Allaqachon ko'rib chiqilgan");
    if (s.product === "channel" && !(await channelFor(s.field))) return ctx.answerCallbackQuery({ text: "Kanal ulanmagan", show_alert: true });
    const end = await activateSub(ctx.api, s);
    await ctx.editMessageCaption({ caption: `${ctx.callbackQuery.message?.caption ?? ""}\n\n✅ Tasdiqlandi · ${fmtDate(end)} gacha` });
    await ctx.answerCallbackQuery("Tasdiqlandi");
  });

  // Admin istalgan userga Pro beradi: /pro @username 12  yoki  /pro 123456789 1
  admin.command("pro", async (ctx) => {
    const [who, m = "1"] = ctx.match.trim().split(/\s+/);
    const months = Number(m);
    if (!who || !Number.isInteger(months) || months < 1 || months > 36) {
      return ctx.reply("Foydalanish: /pro @username 12\nyoki: /pro 123456789 1\n(oxirgi raqam: necha oy, odatda 1)");
    }
    const u = await findUser(who);
    if (!u) return ctx.reply("Bu user topilmadi. U avval botda /start bosgan bo'lishi kerak.");
    const { rows: [sub] } = await db.query<Sub>(
      `INSERT INTO subscriptions (tg_id, field, product, months, amount, slots, status)
       VALUES ($1, 'all', 'pro', $2, 0, GREATEST(3, $3), 'pending') RETURNING *`,
      [u.tg_id, months, u.fields.filter((f) => config.fields.includes(f)).length],
    );
    const end = await activateSub(ctx.api, sub, "🎁 Admin sizga Dayjest Pro'ni taqdim etdi.");
    await ctx.reply(`✅ ${label(u)} uchun Dayjest Pro yoqildi: ${fmtDate(end)} gacha.`);
  });

  // Pro'ni o'chirish: /prooff @username
  admin.command("prooff", async (ctx) => {
    const u = await findUser(ctx.match.trim());
    if (!u) return ctx.reply("Foydalanish: /prooff @username yoki /prooff 123456789");
    const { rowCount } = await db.query("UPDATE subscriptions SET ends_at = now() WHERE tg_id = $1 AND product = 'pro' AND status = 'active'", [u.tg_id]);
    if (!rowCount) return ctx.reply(`${label(u)} da faol Pro yo'q.`);
    await checkExpiry(bot);
    await ctx.reply(`${label(u)} uchun Pro o'chirildi.`);
  });

  // Faol Pro obunachilar ro'yxati
  admin.command("prolist", async (ctx) => {
    const { rows } = await db.query<{ tg_id: string; first_name: string | null; username: string | null; ends_at: Date; amount: number }>(
      `SELECT s.tg_id, u.first_name, u.username, s.ends_at, s.amount FROM subscriptions s JOIN users u ON u.tg_id = s.tg_id
       WHERE s.product = 'pro' AND s.status = 'active' ORDER BY s.ends_at`,
    );
    if (!rows.length) return ctx.reply("Faol Pro obunachi yo'q.");
    await ctx.reply(`Faol Pro: ${rows.length} ta\n\n` + rows.map((r) =>
      `${r.first_name ?? ""}${r.username ? ` @${r.username}` : ""} (${r.tg_id}) · ${fmtDate(r.ends_at)} gacha${r.amount ? "" : " · sovg'a"}`).join("\n"));
  });

  admin.callbackQuery(/^sub_no:(\d+)$/, async (ctx) => {
    const s = await getSub(Number(ctx.match[1]));
    if (!s || s.status !== "pending") return ctx.answerCallbackQuery("Allaqachon ko'rib chiqilgan");
    await db.query("UPDATE subscriptions SET status = 'rejected' WHERE id = $1", [s.id]);
    await ctx.api.sendMessage(s.tg_id, "❌ To'lov tasdiqlanmadi. Chek yoki summa noto'g'ri bo'lishi mumkin. Qayta urinish: /start");
    await ctx.editMessageCaption({ caption: `${ctx.callbackQuery.message?.caption ?? ""}\n\n❌ Rad etildi` });
    await ctx.answerCallbackQuery("Rad etildi");
  });
}

type UserRow = { tg_id: string; first_name: string | null; username: string | null; fields: string[] };
const label = (u: UserRow) => `${u.first_name ?? ""}${u.username ? ` @${u.username}` : ""} (${u.tg_id})`.trim();

async function findUser(who: string): Promise<UserRow | undefined> {
  if (!who) return undefined;
  const q = /^\d+$/.test(who)
    ? await db.query<UserRow>("SELECT tg_id, first_name, username, fields FROM users WHERE tg_id = $1", [who])
    : await db.query<UserRow>("SELECT tg_id, first_name, username, fields FROM users WHERE lower(username) = lower($1)", [who.replace(/^@/, "")]);
  return q.rows[0];
}

// Obunani faollashtiradi (to'lov tasdiqlanganda yoki admin sovg'a qilganda) va userga xabar/havola yuboradi
async function activateSub(api: Api, s: Sub, intro = "✅ To'lov tasdiqlandi."): Promise<Date> {
  // Faol obuna bo'lsa, muddat uning oxiridan uzayadi
  const { rows: [prev] } = await db.query<{ ends_at: Date }>(
    "SELECT ends_at FROM subscriptions WHERE tg_id = $1 AND field = $2 AND product = $3 AND status = 'active' AND ends_at > now() ORDER BY ends_at DESC LIMIT 1",
    [s.tg_id, s.field, s.product],
  );
  const end = new Date(prev ? prev.ends_at : Date.now());
  end.setMonth(end.getMonth() + s.months);
  if (prev) await db.query("UPDATE subscriptions SET status = 'extended' WHERE tg_id = $1 AND field = $2 AND product = $3 AND status = 'active'", [s.tg_id, s.field, s.product]);
  await db.query("UPDATE subscriptions SET status = 'active', starts_at = now(), ends_at = $2, reminded = false WHERE id = $1", [s.id, end]);

  const name = subName(s);
  if (prev) {
    await api.sendMessage(s.tg_id, `${intro} ${name} <b>${fmtDate(end)}</b> gacha uzaytirildi.`, { parse_mode: "HTML" });
  } else if (s.product === "pro") {
    // Userning yo'nalishlari (to'langan soniga qadar) bo'yicha yopiq kanallarga bir martalik havolalar
    const { rows: [u] } = await db.query<{ fields: string[] }>("SELECT fields FROM users WHERE tg_id = $1", [s.tg_id]);
    const dirs = (u?.fields ?? []).filter((f) => config.fields.includes(f)).slice(0, s.slots);
    const kb = new InlineKeyboard();
    for (const f of dirs) {
      const ch = await channelFor(f, "pro");
      if (!ch) continue;
      const link = await api.createChatInviteLink(ch, { member_limit: 1, expire_date: Math.floor(Date.now() / 1000) + 7 * 86400, name: `pro ${s.id}` });
      kb.url(`🔒 ${FIELD_NAMES[f] ?? f} · yopiq kanal`, link.invite_link).row();
    }
    await api.sendMessage(s.tg_id, `${intro}\n\n⚡ <b>${name} faol!</b> <b>${fmtDate(end)}</b> gacha muhim yangiliklar chiqishi bilan keladi.\n\nYopiq kanalga kirish havolasi faqat siz uchun, bir martalik, 7 kun amal qiladi.`, { parse_mode: "HTML", reply_markup: kb });
  } else {
    const link = await api.createChatInviteLink(await channelFor(s.field), { member_limit: 1, expire_date: Math.floor(Date.now() / 1000) + 7 * 86400, name: `sub ${s.id}` });
    await api.sendMessage(s.tg_id, `${intro}\n\n${name} · <b>${fmtDate(end)}</b> gacha.\n\nKirish havolasi faqat siz uchun, bir martalik, 7 kun amal qiladi.`, {
      parse_mode: "HTML", reply_markup: new InlineKeyboard().url("➡️ Kanalga kirish", link.invite_link),
    });
  }
  return end;
}

// Har soatda: 3 kun qolganda eslatma, muddat tugaganda kanaldan chiqarish
export async function checkExpiry(bot: Bot) {
  const { rows: soon } = await db.query<Sub>(
    "SELECT * FROM subscriptions WHERE status = 'active' AND NOT reminded AND ends_at < now() + interval '3 days' AND ends_at > now()",
  );
  for (const s of soon) {
    await bot.api.sendMessage(s.tg_id, `🔔 ${subName(s)} obunangiz ${fmtDate(new Date(s.ends_at!))} da tugaydi.\n\nUzaytirish: /start`).catch(() => {});
    await db.query("UPDATE subscriptions SET reminded = true WHERE id = $1", [s.id]);
  }

  const { rows: expired } = await db.query<Sub>("SELECT * FROM subscriptions WHERE status = 'active' AND ends_at <= now()");
  for (const s of expired) {
    const channels = s.product === "pro"
      ? (await Promise.all(config.fields.map((f) => channelFor(f, "pro")))).filter(Boolean)
      : [await channelFor(s.field)].filter(Boolean);
    for (const channel of channels) {
      try {
        await bot.api.banChatMember(channel, Number(s.tg_id));
        await bot.api.unbanChatMember(channel, Number(s.tg_id), { only_if_banned: true });
      } catch (e) {
        if (!(e instanceof GrammyError)) throw e;
        console.warn(`[expiry] ${s.tg_id}: ${e.description}`);
      }
    }
    await db.query("UPDATE subscriptions SET status = 'expired' WHERE id = $1", [s.id]);
    await bot.api.sendMessage(s.tg_id, `${subName(s)} obunangiz tugadi. Qayta obuna: /start`).catch(() => {});
  }
}
