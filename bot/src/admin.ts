// Admin guruh: postni tasdiqlash, tahrirlash, o'chirish
import { InlineKeyboard, type Bot } from "grammy";
import { db, kvGet, kvSet } from "./db/index.ts";
import { config, FIELD_NAMES } from "./config.ts";
import { esc } from "./format.ts";
import { approvePost, channelFor, channelSubs, isAuto, publishToChannel } from "./publisher.ts";
import { FIELD_SUBS, subName } from "./criteria.ts";

export const draftKeyboard = (id: number) =>
  new InlineKeyboard().text("✅ Tasdiqlash", `ok:${id}`).text("📢 Kanalga", `pub:${id}`).row().text("❌ Kerak emas", `rej:${id}`);

type PostRow = { id: number; field: string; text: string; status: string; admin_msg_id: number | null };

const getPost = async (id: number) =>
  (await db.query<PostRow>("SELECT id, field, text, status, admin_msg_id FROM posts WHERE id = $1", [id])).rows[0];

export function registerAdmin(bot: Bot) {
  // Egasi botni kanalga admin qilsa: qaysi yo'nalishning qaysi kanali ekani so'raladi (ochiq yoki yopiq)
  bot.on("my_chat_member", async (ctx) => {
    const u = ctx.myChatMember;
    if (u.chat.type !== "channel" || u.from.id !== config.adminChatId) return;
    const title = u.chat.title;
    if (u.new_chat_member.status === "administrator") {
      if (!u.new_chat_member.can_post_messages) {
        return ctx.api.sendMessage(config.adminChatId, `"${title}" kanalida botga "Xabar joylash" huquqini bering.`);
      }
      const kb = new InlineKeyboard();
      for (const f of config.fields) {
        kb.text(`🌐 ${FIELD_NAMES[f] ?? f} · ochiq (bepul)`, `chk:public:${f}:${u.chat.id}`).row()
          .text(`🔒 ${FIELD_NAMES[f] ?? f} · yopiq (Pro)`, `chk:pro:${f}:${u.chat.id}`).row();
      }
      await ctx.api.sendMessage(config.adminChatId, `"${title}" kanaliga qo'shildim. Bu qaysi kanal?`, { reply_markup: kb });
    } else if (["left", "kicked", "member"].includes(u.new_chat_member.status)) {
      const { rows } = await db.query<{ key: string }>("DELETE FROM kv WHERE key LIKE 'channel:%' AND value = $1 RETURNING key", [String(u.chat.id)]);
      for (const r of rows) await db.query("DELETE FROM kv WHERE key = $1", [r.key.replace(/^channel:/, "channel_link:")]);
      if (rows.length) await ctx.api.sendMessage(config.adminChatId, `"${title}" kanali uzildi.`);
    }
  });

  bot.callbackQuery(/^chk:(public|pro):([a-z]+):(-?\d+)$/, async (ctx) => {
    if (ctx.from.id !== config.adminChatId) return ctx.answerCallbackQuery();
    const [, kind, field, chatId] = ctx.match;
    await kvSet(`channel:${field}:${kind}`, chatId);
    let note = "barcha postlar chiqishi bilan shu yerga chiqadi";
    if (kind === "public") {
      const chat = await ctx.api.getChat(Number(chatId));
      const link = "username" in chat && chat.username ? `https://t.me/${chat.username}`
        : (await ctx.api.createChatInviteLink(Number(chatId), { name: "Stepolog: ochiq" })).invite_link;
      await kvSet(`channel_link:${field}:public`, link);
      note = "har kuni 20:00 da dayjest shu yerga chiqadi, userlarga havolasi beriladi";
    }
    await ctx.editMessageText(`✅ ${FIELD_NAMES[field] ?? field} · ${kind === "public" ? "ochiq kanal" : "yopiq kanal (Pro)"} ulandi: ${note}.`);
    await ctx.answerCallbackQuery("Ulandi");
  });

  const admin = bot.filter((ctx) => ctx.chat?.id === config.adminChatId);

  // ✅ Tasdiqlash: userlarga (Pro va dayjest) boradi, kanalga navbat bilan chiqadi
  admin.callbackQuery(/^ok:(\d+)$/, async (ctx) => {
    const ok = await approvePost(ctx.api, Number(ctx.match[1]));
    await ctx.answerCallbackQuery(ok ? "Tasdiqlandi" : "Allaqachon ko'rib chiqilgan");
  });

  // 📢 Kanalga: hozir kanalga chiqaradi (va tasdiqlaydi)
  admin.callbackQuery(/^pub:(\d+)$/, async (ctx) => {
    const r = await publishToChannel(ctx.api, Number(ctx.match[1])).catch((e) => {
      console.error("[pub]", e);
      return "error" as const;
    });
    const msg = { published: "Kanalga chiqdi", approved: "Tasdiqlandi (kanal ulanmagan)", busy: "Allaqachon ko'rib chiqilgan", error: "Kanalga chiqmadi: bot huquqlarini tekshiring" }[r];
    await ctx.answerCallbackQuery({ text: msg, show_alert: r === "error" });
  });

  admin.callbackQuery(/^del:(\d+)$/, async (ctx) => {
    const { rows: [p] } = await db.query<{ field: string; channel_msg_id: string | null }>(
      "SELECT field, channel_msg_id FROM posts WHERE id = $1", [Number(ctx.match[1])]);
    if (p?.channel_msg_id) {
      await ctx.api.deleteMessage(await channelFor(p.field), Number(p.channel_msg_id)).catch(() => {});
    }
    await db.query("UPDATE posts SET status = 'deleted' WHERE id = $1", [Number(ctx.match[1])]);
    await ctx.editMessageReplyMarkup({ reply_markup: undefined }).catch(() => {});
    await ctx.answerCallbackQuery("Kanaldan o'chirildi");
  });

  admin.command("avto", async (ctx) => {
    await kvSet("mode", "auto");
    await ctx.reply("Avtomatik rejim: qoralama 30 daqiqada o'zi tasdiqlanadi (shu vaqt ichida ❌ bosib to'xtatishingiz mumkin). Kanalga 09:00-21:00 orasida, 2 soat oraliq bilan, kuniga 5 tagacha chiqadi.");
  });

  admin.command("qolda", async (ctx) => {
    await kvSet("mode", "manual");
    await ctx.reply("Qo'lda rejim: postlar faqat ✅ bosganingizda userlarga va kanalga boradi.");
  });

  admin.callbackQuery(/^rej:(\d+)$/, async (ctx) => {
    const id = Number(ctx.match[1]);
    const { rowCount } = await db.query("UPDATE posts SET status = 'rejected' WHERE id = $1 AND status IN ('draft', 'approved')", [id]);
    if (!rowCount) {
      const p = await getPost(id);
      return ctx.answerCallbackQuery({ text: p?.status === "published" ? "Post kanalga chiqib bo'lgan: 🗑 tugmasi bilan o'chiring" : "Allaqachon ko'rib chiqilgan", show_alert: true });
    }
    await ctx.deleteMessage().catch(() => {});
    await ctx.answerCallbackQuery("Bekor qilindi");
  });

  // Tahrirlash: qoralama xabariga javob (reply) qilib yangi matn yozasiz.
  // Birinchi qator sarlavha bo'ladi, "Manba" qatori avtomatik saqlanadi.
  admin.on("message:text", async (ctx, next) => {
    const replyTo = ctx.message.reply_to_message?.message_id;
    if (!replyTo || ctx.message.text.startsWith("/")) return next(); // buyruqlar tahrir emas
    const { rows } = await db.query<PostRow>(
      "SELECT id, field, text, status, admin_msg_id FROM posts WHERE admin_msg_id = $1 AND status IN ('draft', 'approved')",
      [replyTo],
    );
    const post = rows[0];
    if (!post) return next();

    // Oxirgi blok: "· Manba: ..." va sana qatori (o'zgarmaydi)
    const source = post.text.split("\n\n").find((p) => p.startsWith("· Manba:") || p.startsWith("Manba:")) ?? "";
    const [first, ...rest] = ctx.message.text.trim().split("\n");
    const html = [`<b>${esc(first)}</b>`, esc(rest.join("\n").trim()), source].filter(Boolean).join("\n\n");

    await db.query("UPDATE posts SET text = $2 WHERE id = $1", [post.id, html]);
    await ctx.api.editMessageText(config.adminChatId, replyTo, `${html}\n\n<i>Tahrirlandi · #${post.id}</i>`, {
      parse_mode: "HTML",
      link_preview_options: { is_disabled: true },
      reply_markup: draftKeyboard(post.id),
    });
    if (post.status === "approved") await db.query("UPDATE posts SET status = 'draft' WHERE id = $1 AND status = 'approved'", [post.id]);
    await ctx.reply("✏️ Yangilandi. Tasdiqlash uchun ✅ ni bosing.");
  });

  // Namuna yangiliklarga baho: ✅ kerak / ❌ kerak emas (filtrni sozlash uchun)
  admin.callbackQuery(/^fb:(\d+):([01])$/, async (ctx) => {
    const [, id, v] = ctx.match;
    await db.query(
      "INSERT INTO feedback (article_id, useful) VALUES ($1, $2) ON CONFLICT (article_id) DO UPDATE SET useful = $2, created_at = now()",
      [Number(id), v === "1"],
    );
    await ctx.editMessageReplyMarkup({
      reply_markup: new InlineKeyboard().text(v === "1" ? "✅ Kerak · belgilandi" : "✅ Kerak", `fb:${id}:1`).text(v === "0" ? "❌ Kerak emas · belgilandi" : "❌ Kerak emas", `fb:${id}:0`),
    });
    await ctx.answerCallbackQuery(v === "1" ? "Kerak deb belgilandi" : "Kerak emas deb belgilandi");
  });

  // Kanalga qaysi mavzular chiqishini sozlash: /kanal smm,brand,target
  admin.command("kanal", async (ctx) => {
    const field = config.fields[0];
    const all = FIELD_SUBS[field].map((c) => c.id);
    const want = ctx.match.split(/[\s,]+/).filter(Boolean);
    if (!want.length) {
      const cur = await channelSubs(field);
      return ctx.reply(`Kanalga chiqadigan mavzular: ${cur.map(subName).join(", ")}\n\nO'zgartirish: /kanal ${all.join(",")}\n(keraklilarini vergul bilan yozing)`);
    }
    const bad = want.filter((w) => !all.includes(w));
    if (bad.length) return ctx.reply(`Noma'lum: ${bad.join(", ")}. Mavjudlari: ${all.join(", ")}`);
    await kvSet(`channel_subs:${field}`, want.join(","));
    await ctx.reply(`✅ Kanalga endi faqat shular chiqadi: ${want.map(subName).join(", ")}`);
  });

  admin.command("admin", (ctx) =>
    ctx.reply(`Admin buyruqlari:

/holat · bugungi statistika
/pro @username 12 · userga Pro berish (oxirgi raqam: necha oy)
/prooff @username · Pro'ni o'chirish
/prolist · faol Pro obunachilar
/avto · qoralamalar 30 daqiqada o'zi tasdiqlanadi
/qolda · faqat ✅ bilan
/yangila · manbalarni hozir tekshirish
/chiqar · navbatdagi postni hozir chiqarish
/dayjest · dayjestni o'zimga yuborish
/kanal · kanalga qaysi mavzular chiqishi`));

  admin.command("holat", async (ctx) => {
    const { rows: [s] } = await db.query<Record<string, string>>(`
      SELECT
        (SELECT count(*) FROM articles WHERE created_at > now() - interval '24 hours') AS seen,
        (SELECT count(*) FROM articles WHERE verdict = 'keep' AND created_at > now() - interval '24 hours') AS kept,
        (SELECT count(*) FROM posts WHERE status = 'draft') AS drafts,
        (SELECT count(*) FROM posts WHERE status = 'approved' AND approved_at > now() - interval '24 hours') AS approved,
        (SELECT count(*) FROM posts WHERE status = 'published' AND published_at > now() - interval '24 hours') AS published,
        (SELECT count(*) FROM users WHERE NOT blocked) AS users,
        (SELECT count(*) FROM sources WHERE last_error IS NOT NULL) AS broken`);
    await ctx.reply(
      `Rejim: ${(await isAuto()) ? "avtomatik (/qolda)" : "qo'lda (/avto)"}\n\nSo'nggi 24 soat:\nKo'rildi: ${s.seen}\nMuhim: ${s.kept}\nTasdiqlangan (userlarga): ${s.approved}\nKanalga chiqdi: ${s.published}\nKutayotgan qoralama: ${s.drafts}\n\nFoydalanuvchilar: ${s.users}\nIshlamayotgan manba: ${s.broken}`,
    );
  });
}
