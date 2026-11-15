// Dayjest Pro obunasi: chekni admin tasdiqlaydi → yopiq kanalga bir martalik havola;
// muddat tugashidan oldin eslatma, tugaganda yopiq kanaldan chiqarish.
import { GrammyError, InlineKeyboard, type Api, type Bot } from "grammy";
import { db } from "./db/index.ts";
import { config, FIELD_NAMES, som, PRO_SLOTS, FREE_SUBS } from "./config.ts";
import { channelFor } from "./publisher.ts";
import { sendSafe } from "./tg.ts";

type Sub = {
  id: number; tg_id: string; field: string; product: string; slots: number; months: number; amount: number;
  status: string; receipt_file_id: string | null; receipt_kind: string; ends_at: Date | null;
};
const getSub = async (id: number) => (await db.query<Sub>("SELECT * FROM subscriptions WHERE id = $1", [id])).rows[0];
const monthsLabel = (m: number) => `${m} oy`;
const subName = (s: Sub) => (s.product === "pro" ? "Dayjest Pro" : `${FIELD_NAMES[s.field] ?? s.field} kanali`);
const fmtDate = (d: Date) => new Intl.DateTimeFormat("uz-UZ", { timeZone: config.tz, day: "2-digit", month: "2-digit", year: "numeric" }).format(d);

// Chek rasm yoki fayl bo'lishi mumkin: ikkalasi ham adminga yetib boradi
export async function notifyAdminReceipt(api: Api, subId: number) {
  const s = await getSub(subId);
  const { rows: [u] } = await db.query<{ first_name: string | null; username: string | null }>("SELECT first_name, username FROM users WHERE tg_id = $1", [s.tg_id]);
  const who = `${u?.first_name ?? ""}${u?.username ? ` @${u.username}` : ""} (id ${s.tg_id})`;
  const opts = {
    caption: `🧾 Yangi to'lov #${s.id}\n\n${who}\n${subName(s)} · ${monthsLabel(s.months)}\nSumma: ${som(s.amount)}`,
    reply_markup: new InlineKeyboard().text("✅ Tasdiqlash", `sub_ok:${s.id}`).text("❌ Rad etish", `sub_no:${s.id}`),
  };
  const msg = s.receipt_kind === "document"
    ? await api.sendDocument(config.adminChatId, s.receipt_file_id!, opts)
    : await api.sendPhoto(config.adminChatId, s.receipt_file_id!, opts);
  await db.query("UPDATE subscriptions SET admin_msg_id = $2 WHERE id = $1", [s.id, msg.message_id]);
}

type UserRow = { tg_id: string; first_name: string | null; username: string | null };
const label = (u: UserRow) => `${u.first_name ?? ""}${u.username ? ` @${u.username}` : ""} (${u.tg_id})`.trim();

async function findUser(who: string): Promise<UserRow | undefined> {
  if (!who) return undefined;
  const q = /^\d+$/.test(who)
    ? await db.query<UserRow>("SELECT tg_id, first_name, username FROM users WHERE tg_id = $1", [who])
    : await db.query<UserRow>("SELECT tg_id, first_name, username FROM users WHERE lower(username) = lower($1)", [who.replace(/^@/, "")]);
  return q.rows[0];
}

// Yopiq kanallarga bir martalik havolalar (7 kun). Havola yaratib bo'lmasa, sababi qaytariladi
async function inviteLinks(api: Api, subId: number) {
  const kb = new InlineKeyboard();
  const errors: string[] = [];
  for (const f of config.fields) {
    const ch = await channelFor(f, "pro");
    if (!ch) continue;
    try {
      const link = await api.createChatInviteLink(ch, { member_limit: 1, expire_date: Math.floor(Date.now() / 1000) + 7 * 86400, name: `pro ${subId}` });
      kb.url(`🔒 ${FIELD_NAMES[f] ?? f} · yopiq kanal`, link.invite_link).row();
    } catch (e) {
      errors.push(`${FIELD_NAMES[f] ?? f}: ${e instanceof GrammyError ? e.description : String(e)}`);
    }
  }
  return { kb, count: kb.inline_keyboard.length, errors };
}

// Obunani faollashtiradi. Oldingi faol obuna bo'lsa (muddati o'tgan-o'tmaganidan qat'i nazar) u almashtiriladi,
// yangi muddat oldingisining oxiridan (yoki hozirdan) boshlanadi. Xabar yuborishdagi xato faollashtirishni bekor qilmaydi.
async function activateSub(api: Api, s: Sub, intro = "✅ To'lov tasdiqlandi."): Promise<{ end: Date; problems: string[] }> {
  const { rows: [prev] } = await db.query<{ ends_at: Date | null }>(
    "SELECT max(ends_at) AS ends_at FROM subscriptions WHERE tg_id = $1 AND product = $2 AND status = 'active' AND id <> $3",
    [s.tg_id, s.product, s.id],
  );
  const base = prev?.ends_at && new Date(prev.ends_at) > new Date() ? new Date(prev.ends_at) : new Date();
  const end = new Date(base);
  end.setMonth(end.getMonth() + s.months);
  await db.query("UPDATE subscriptions SET status = 'extended' WHERE tg_id = $1 AND product = $2 AND status = 'active' AND id <> $3", [s.tg_id, s.product, s.id]);
  await db.query("UPDATE subscriptions SET status = 'active', starts_at = now(), ends_at = $2, reminded = false WHERE id = $1", [s.id, end]);

  const problems: string[] = [];
  const links = await inviteLinks(api, s.id); // uzaytirishda ham yangi havola: eski havola muddati o'tgan bo'lishi mumkin
  problems.push(...links.errors);
  const renewed = Boolean(prev?.ends_at && new Date(prev.ends_at) > new Date());
  const text = renewed
    ? `${intro} ${subName(s)} <b>${fmtDate(end)}</b> gacha uzaytirildi.${links.count ? "\n\nKanalda bo'lmasangiz, quyidagi havola orqali qayta kiring." : ""}`
    : `${intro}\n\n⚡ <b>${subName(s)} faol!</b> <b>${fmtDate(end)}</b> gacha muhim yangiliklar chiqishi bilan keladi.${links.count ? "\n\nYopiq kanalga kirish havolasi faqat siz uchun, bir martalik, 7 kun amal qiladi." : ""}`;
  const ok = await sendSafe(api, s.tg_id, text, { parse_mode: "HTML", reply_markup: links.count ? links.kb : undefined });
  if (!ok) problems.push("userga xabar yetib bormadi (botni bloklagan bo'lishi mumkin)");
  return { end, problems };
}

export function registerSubs(bot: Bot) {
  const admin = bot.filter((ctx) => ctx.chat?.id === config.adminChatId);

  admin.callbackQuery(/^sub_ok:(\d+)$/, async (ctx) => {
    // Atomik: ikki marta bosilsa ham bir marta faollashadi
    const { rows: [s] } = await db.query<Sub>("UPDATE subscriptions SET status = 'approving' WHERE id = $1 AND status = 'pending' RETURNING *", [Number(ctx.match[1])]);
    if (!s) return ctx.answerCallbackQuery("Allaqachon ko'rib chiqilgan");
    const { end, problems } = await activateSub(ctx.api, s);
    const note = problems.length ? `\n\n⚠️ ${problems.join("\n⚠️ ")}` : "";
    await ctx.editMessageCaption({ caption: `${ctx.callbackQuery.message?.caption ?? ""}\n\n✅ Tasdiqlandi · ${fmtDate(end)} gacha${note}` }).catch(() => {});
    await ctx.answerCallbackQuery({ text: problems.length ? "Tasdiqlandi, lekin muammo bor: izohni o'qing" : "Tasdiqlandi", show_alert: problems.length > 0 });
  });

  admin.callbackQuery(/^sub_no:(\d+)$/, async (ctx) => {
    const { rows: [s] } = await db.query<Sub>("UPDATE subscriptions SET status = 'rejected' WHERE id = $1 AND status = 'pending' RETURNING *", [Number(ctx.match[1])]);
    if (!s) return ctx.answerCallbackQuery("Allaqachon ko'rib chiqilgan");
    await sendSafe(ctx.api, s.tg_id, "❌ To'lov tasdiqlanmadi. Chek yoki summa noto'g'ri bo'lishi mumkin. Qayta urinish: /start");
    await ctx.editMessageCaption({ caption: `${ctx.callbackQuery.message?.caption ?? ""}\n\n❌ Rad etildi` }).catch(() => {});
    await ctx.answerCallbackQuery("Rad etildi");
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
       VALUES ($1, 'all', 'pro', $2, 0, $3, 'approving') RETURNING *`,
      [u.tg_id, months, PRO_SLOTS],
    );
    const { end, problems } = await activateSub(ctx.api, sub, "🎁 Admin sizga Dayjest Pro'ni taqdim etdi.");
    await ctx.reply(`✅ ${label(u)} uchun Dayjest Pro yoqildi: ${fmtDate(end)} gacha.${problems.length ? `\n\n⚠️ ${problems.join("\n⚠️ ")}` : ""}`);
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
}

// Har soatda: 3 kun qolganda eslatma, muddat tugaganda yopiq kanaldan chiqarish.
// Userda shu mahsulot bo'yicha boshqa faol obuna bo'lsa, chiqarilmaydi (uzaytirilgan).
export async function checkExpiry(bot: Bot) {
  const { rows: soon } = await db.query<Sub>(
    `SELECT * FROM subscriptions s WHERE status = 'active' AND NOT reminded AND ends_at < now() + interval '3 days' AND ends_at > now()
       AND NOT EXISTS (SELECT 1 FROM subscriptions o WHERE o.tg_id = s.tg_id AND o.product = s.product AND o.id <> s.id
                       AND o.status = 'active' AND o.ends_at > s.ends_at)`,
  );
  for (const s of soon) {
    await sendSafe(bot.api, s.tg_id, `🔔 ${subName(s)} obunangiz ${fmtDate(new Date(s.ends_at!))} da tugaydi.\n\nUzaytirish: /start → Dayjest → ⚡ Dayjest Pro`);
    await db.query("UPDATE subscriptions SET reminded = true WHERE id = $1", [s.id]);
  }

  const { rows: expired } = await db.query<Sub & { still: boolean }>(
    `SELECT s.*, EXISTS (SELECT 1 FROM subscriptions o WHERE o.tg_id = s.tg_id AND o.product = s.product AND o.id <> s.id
                         AND o.status = 'active' AND o.ends_at > now()) AS still
     FROM subscriptions s WHERE status = 'active' AND ends_at <= now()`,
  );
  for (const s of expired) {
    await db.query("UPDATE subscriptions SET status = 'expired' WHERE id = $1", [s.id]);
    if (s.still) continue; // boshqa faol obunasi bor
    const channels = (await Promise.all(config.fields.map((f) => channelFor(f, "pro")))).filter(Boolean);
    for (const channel of channels) {
      try {
        await bot.api.banChatMember(channel, Number(s.tg_id));
        await bot.api.unbanChatMember(channel, Number(s.tg_id), { only_if_banned: true });
      } catch (e) {
        if (!(e instanceof GrammyError)) throw e;
        console.warn(`[expiry] ${s.tg_id}: ${e.description}`);
      }
    }
    // Pro tugadi: bepul tarif bo'yicha birinchi 3 ta mavzu qoladi, menyu va dayjest bir xil bo'lishi uchun
    if (s.product === "pro") await db.query("UPDATE users SET subs = subs[1:$2] WHERE tg_id = $1", [s.tg_id, FREE_SUBS]);
    await sendSafe(bot.api, s.tg_id, `${subName(s)} obunangiz tugadi. Endi bepul dayjest ${FREE_SUBS} ta mavzu bo'yicha keladi.\n\nQayta obuna: /start → Dayjest → ⚡ Dayjest Pro`);
  }
}
