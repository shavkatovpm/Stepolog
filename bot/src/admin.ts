// Admin guruh: postni tasdiqlash, tahrirlash, o'chirish
import { InlineKeyboard, type Bot } from "grammy";
import { db } from "./db/index.ts";
import { config } from "./config.ts";
import { esc } from "./format.ts";

export const draftKeyboard = (id: number) =>
  new InlineKeyboard().text("✅ Chiqarish", `pub:${id}`).text("❌ Kerak emas", `rej:${id}`);

type PostRow = { id: number; field: string; text: string; status: string; admin_msg_id: number | null };

const getPost = async (id: number) =>
  (await db.query<PostRow>("SELECT id, field, text, status, admin_msg_id FROM posts WHERE id = $1", [id])).rows[0];

export function registerAdmin(bot: Bot) {
  const admin = bot.filter((ctx) => ctx.chat?.id === config.adminChatId);

  admin.callbackQuery(/^pub:(\d+)$/, async (ctx) => {
    const post = await getPost(Number(ctx.match[1]));
    if (!post || post.status !== "draft") return ctx.answerCallbackQuery("Allaqachon ko'rib chiqilgan");
    const channel = config.channels[post.field];
    const msg = await ctx.api.sendMessage(channel, post.text, { parse_mode: "HTML", link_preview_options: { is_disabled: true } });
    await db.query("UPDATE posts SET status = 'published', channel_msg_id = $2, published_at = now() WHERE id = $1", [post.id, msg.message_id]);
    await ctx.editMessageReplyMarkup({ reply_markup: undefined });
    await ctx.reply(`✅ #${post.id} kanalga chiqdi`, { reply_parameters: { message_id: ctx.callbackQuery.message!.message_id } });
    await ctx.answerCallbackQuery("Chiqdi");
  });

  admin.callbackQuery(/^rej:(\d+)$/, async (ctx) => {
    const id = Number(ctx.match[1]);
    await db.query("UPDATE posts SET status = 'rejected' WHERE id = $1 AND status = 'draft'", [id]);
    await ctx.deleteMessage().catch(() => {});
    await ctx.answerCallbackQuery("O'chirildi");
  });

  // Tahrirlash: qoralama xabariga javob (reply) qilib yangi matn yozasiz.
  // Birinchi qator sarlavha bo'ladi, "Manba" qatori avtomatik saqlanadi.
  admin.on("message:text", async (ctx, next) => {
    const replyTo = ctx.message.reply_to_message?.message_id;
    if (!replyTo) return next();
    const { rows } = await db.query<PostRow>(
      "SELECT id, field, text, status, admin_msg_id FROM posts WHERE admin_msg_id = $1 AND status = 'draft'",
      [replyTo],
    );
    const post = rows[0];
    if (!post) return next();

    const source = post.text.split("\n\n").find((p) => p.startsWith("Manba:")) ?? "";
    const [first, ...rest] = ctx.message.text.trim().split("\n");
    const html = [`<b>${esc(first)}</b>`, esc(rest.join("\n").trim()), source].filter(Boolean).join("\n\n");

    await db.query("UPDATE posts SET text = $2 WHERE id = $1", [post.id, html]);
    await ctx.api.editMessageText(config.adminChatId, replyTo, `${html}\n\n<i>Tahrirlandi · #${post.id}</i>`, {
      parse_mode: "HTML",
      link_preview_options: { is_disabled: true },
      reply_markup: draftKeyboard(post.id),
    });
    await ctx.reply("✏️ Yangilandi. Tasdiqlash uchun ✅ ni bosing.");
  });

  admin.command("holat", async (ctx) => {
    const { rows: [s] } = await db.query<Record<string, string>>(`
      SELECT
        (SELECT count(*) FROM articles WHERE created_at > now() - interval '24 hours') AS seen,
        (SELECT count(*) FROM articles WHERE verdict = 'keep' AND created_at > now() - interval '24 hours') AS kept,
        (SELECT count(*) FROM posts WHERE status = 'draft') AS drafts,
        (SELECT count(*) FROM posts WHERE status = 'published' AND published_at > now() - interval '24 hours') AS published,
        (SELECT count(*) FROM users WHERE NOT blocked) AS users,
        (SELECT count(*) FROM sources WHERE last_error IS NOT NULL) AS broken`);
    await ctx.reply(
      `So'nggi 24 soat:\nKo'rildi: ${s.seen}\nMuhim: ${s.kept}\nKanalga chiqdi: ${s.published}\nKutayotgan qoralama: ${s.drafts}\n\nFoydalanuvchilar: ${s.users}\nIshlamayotgan manba: ${s.broken}`,
    );
  });
}
