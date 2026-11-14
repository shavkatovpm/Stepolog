// Pullik kanal obunasi: chekni admin tasdiqlaydi → bir martalik havola; muddat tugashi oldidan eslatma, tugaganda chiqarish
import { GrammyError, InlineKeyboard, type Api, type Bot } from "grammy";
import { db } from "./db/index.ts";
import { config, FIELD_NAMES, som } from "./config.ts";
import { channelFor } from "./publisher.ts";

type Sub = { id: number; tg_id: string; field: string; product: string; months: number; amount: number; status: string; receipt_file_id: string | null; ends_at: Date | null };
const getSub = async (id: number) => (await db.query<Sub>("SELECT * FROM subscriptions WHERE id = $1", [id])).rows[0];
const monthsLabel = (m: number) => (m === 12 ? "1 yil" : `${m} oy`);
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
    const channel = s.product === "channel" ? await channelFor(s.field) : 0;
    if (s.product === "channel" && !channel) return ctx.answerCallbackQuery({ text: "Kanal ulanmagan", show_alert: true });

    // Faol obuna bo'lsa, muddat uning oxiridan uzayadi
    const { rows: [prev] } = await db.query<{ ends_at: Date }>(
      "SELECT ends_at FROM subscriptions WHERE tg_id = $1 AND field = $2 AND product = $3 AND status = 'active' AND ends_at > now() ORDER BY ends_at DESC LIMIT 1",
      [s.tg_id, s.field, s.product],
    );
    const start = prev ? new Date(prev.ends_at) : new Date();
    const end = new Date(start); end.setMonth(end.getMonth() + s.months);
    if (prev) await db.query("UPDATE subscriptions SET status = 'extended' WHERE tg_id = $1 AND field = $2 AND product = $3 AND status = 'active'", [s.tg_id, s.field, s.product]);
    await db.query("UPDATE subscriptions SET status = 'active', starts_at = now(), ends_at = $2, reminded = false WHERE id = $1", [s.id, end]);

    const name = subName(s);
    if (prev) {
      await ctx.api.sendMessage(s.tg_id, `✅ To'lov tasdiqlandi. ${name} <b>${fmtDate(end)}</b> gacha uzaytirildi.`, { parse_mode: "HTML" });
    } else if (s.product === "pro") {
      await ctx.api.sendMessage(s.tg_id, `🎉 <b>${name} faol!</b>\n\n<b>${fmtDate(end)}</b> gacha barcha saralangan yangiliklar chiqishi bilan shu yerga keladi.`, { parse_mode: "HTML" });
    } else {
      const link = await ctx.api.createChatInviteLink(channel, {
        member_limit: 1, expire_date: Math.floor(Date.now() / 1000) + 7 * 86400, name: `sub ${s.id}`,
      });
      await ctx.api.sendMessage(s.tg_id, `🎉 <b>Obuna faol!</b>\n\n${name} · <b>${fmtDate(end)}</b> gacha.\n\nKirish havolasi faqat siz uchun, bir martalik, 7 kun amal qiladi.`, {
        parse_mode: "HTML",
        reply_markup: new InlineKeyboard().url("➡️ Kanalga kirish", link.invite_link),
      });
    }
    await ctx.editMessageCaption({ caption: `${ctx.callbackQuery.message?.caption ?? ""}\n\n✅ Tasdiqlandi · ${fmtDate(end)} gacha` });
    await ctx.answerCallbackQuery("Tasdiqlandi");
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
    const channel = s.product === "channel" ? await channelFor(s.field) : 0;
    if (channel) {
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
