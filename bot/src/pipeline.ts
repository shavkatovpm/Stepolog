// Saralash → post yozish → admin guruhga tasdiqlashga yuborish
import type { Bot } from "grammy";
import { db } from "./db/index.ts";
import { config } from "./config.ts";
import { scoreArticles, writePost, type Candidate } from "./ai.ts";
import { renderPost } from "./format.ts";
import { draftKeyboard } from "./admin.ts";

const BATCH = 20;

type Row = Candidate & { url: string; field: string };

export async function scorePending() {
  const { rows } = await db.query<Row>(
    `SELECT a.id, a.title, a.excerpt, a.url, s.name AS source, s.field
     FROM articles a JOIN sources s ON s.id = a.source_id
     WHERE a.verdict = 'pending' ORDER BY a.id LIMIT 100`,
  );
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const verdicts = await scoreArticles(chunk);
    const seen = new Set<number>();
    for (const v of verdicts) {
      if (!chunk.some((c) => c.id === v.id)) continue;
      seen.add(v.id);
      const keep = v.score >= config.minScore;
      await db.query("UPDATE articles SET verdict = $2, score = $3, reason = $4 WHERE id = $1", [
        v.id, keep ? "keep" : "skip", Math.round(v.score), v.reason,
      ]);
    }
    // AI javob bermagan maqolalar qayta-qayta aylanmasligi uchun o'tkazib yuboriladi
    for (const c of chunk) {
      if (!seen.has(c.id)) await db.query("UPDATE articles SET verdict = 'skip', reason = 'baholanmadi' WHERE id = $1", [c.id]);
    }
  }
  if (rows.length) console.log(`[score] ${rows.length} ta maqola baholandi`);
}

export async function writeDrafts(bot: Bot) {
  const { rows } = await db.query<Row & { score: number }>(
    `SELECT a.id, a.title, a.excerpt, a.url, a.score, s.name AS source, s.field
     FROM articles a JOIN sources s ON s.id = a.source_id
     LEFT JOIN posts p ON p.article_id = a.id
     WHERE a.verdict = 'keep' AND p.id IS NULL ORDER BY a.score DESC LIMIT 10`,
  );

  for (const a of rows) {
    try {
      const draft = await writePost(a);
      const html = renderPost(draft, a.source, a.url);
      const { rows: [post] } = await db.query<{ id: number }>(
        `INSERT INTO posts (article_id, field, text, original_text, score) VALUES ($1, $2, $3, $3, $4) RETURNING id`,
        [a.id, a.field, html, a.score],
      );
      const msg = await bot.api.sendMessage(config.adminChatId, `${html}\n\n<i>Ball: ${a.score}/10 · #${post.id}</i>`, {
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
        reply_markup: draftKeyboard(post.id),
      });
      await db.query("UPDATE posts SET admin_msg_id = $2 WHERE id = $1", [post.id, msg.message_id]);
    } catch (e) {
      console.error(`[write] ${a.id}:`, e instanceof Error ? e.message : e);
    }
  }
}
