// Saralash → post yozish → admin guruhga tasdiqlashga yuborish
import type { Bot } from "grammy";
import { db } from "./db/index.ts";
import { config } from "./config.ts";
import { scoreArticles, writePost, type Candidate } from "./ai.ts";
import { renderPost } from "./format.ts";
import { draftKeyboard } from "./admin.ts";
import { fetchArticleText } from "./article.ts";
import { BudgetError } from "./usage.ts";
import { subName } from "./criteria.ts";
import { finalScore, fieldCheck, type Flags, type Tier } from "./criteria.ts";

const BATCH = 20;
const MAX_ATTEMPTS = 3; // AI xatosida shuncha urinishdan keyin maqola o'tkazib yuboriladi

type Row = Candidate & { url: string; field: string; tier: Tier };

const recentKept = async (field: string) =>
  (await db.query<{ id: number; title: string }>(
    `SELECT a.id, a.title FROM articles a JOIN sources s ON s.id = a.source_id
     WHERE s.field = $1 AND a.verdict = 'keep' AND a.created_at > now() - interval '48 hours'
     ORDER BY a.id DESC LIMIT 60`,
    [field],
  )).rows;

export async function scorePending() {
  const { rows } = await db.query<Row>(
    `SELECT a.id, a.title, a.excerpt, a.url, s.name AS source, s.field, s.tier
     FROM articles a JOIN sources s ON s.id = a.source_id
     WHERE a.verdict = 'pending' ORDER BY s.tier = 'official' DESC, a.id DESC LIMIT $1`,
    [config.scoreLimit],
  );
  const byField = new Map<string, Row[]>();
  for (const r of rows) byField.set(r.field, [...(byField.get(r.field) ?? []), r]);

  for (const [field, list] of byField) {
    for (let i = 0; i < list.length; i += BATCH) {
      const chunk = list.slice(i, i + BATCH);
      let verdicts: Awaited<ReturnType<typeof scoreArticles>>;
      try {
        verdicts = await scoreArticles(field, chunk, await recentKept(field));
      } catch (e) {
        if (e instanceof BudgetError) return; // byudjet tugadi: maqolalar ertaga baholanadi (urinish hisoblanmaydi)
        // Bitta guruhdagi xato butun tsiklni to'xtatmasin; ko'p marta xato bo'lsa, maqola o'tkaziladi
        console.error(`[score] ${field}:`, e instanceof Error ? e.message : e);
        await db.query(
          `UPDATE articles SET attempts = attempts + 1,
             verdict = CASE WHEN attempts + 1 >= $2 THEN 'skip' ELSE verdict END,
             reason = CASE WHEN attempts + 1 >= $2 THEN 'baholashda xato' ELSE reason END
           WHERE id = ANY($1)`,
          [chunk.map((c) => c.id), MAX_ATTEMPTS],
        );
        continue;
      }
      const seen = new Set<number>();
      for (const v of verdicts) {
        const art = chunk.find((c) => c.id === v.id);
        if (!art || seen.has(v.id)) continue;
        seen.add(v.id);
        const { id, score: base, reason, sub, uz_fit, hype, ...flags } = v;
        const f = fieldCheck(field, sub, hype, base, uz_fit);
        const g = finalScore(f.score, flags, art.tier);
        const reject = g.reject ?? f.reject;
        const score = reject ? 0 : g.score;
        const keep = !reject && score >= config.minScore;
        await db.query(
          "UPDATE articles SET verdict = $2, score = $3, base_score = $4, flags = $5, reason = $6 WHERE id = $1",
          [id, keep ? "keep" : "skip", score, Math.round(base), JSON.stringify({ ...flags, sub, uz_fit, hype }), reject ? `${reject}. ${reason}` : reason],
        );
      }
      // AI javob bermagan maqolalar qayta-qayta aylanmasligi uchun o'tkazib yuboriladi
      for (const c of chunk) {
        if (!seen.has(c.id)) await db.query("UPDATE articles SET verdict = 'skip', reason = 'baholanmadi' WHERE id = $1", [c.id]);
      }
    }
  }
  if (rows.length) console.log(`[score] ${rows.length} ta maqola baholandi`);
}

const CONF: Record<string, string> = { official: "rasmiy", reported: "OAV xabari", rumor: "tasdiqlanmagan" };
const statusLabel = (f: Flags | null) => [f ? CONF[f.confirmation] : "", f?.testing ? "test" : ""].filter(Boolean).join(", ") || "-";

export async function writeDrafts(bot: Bot) {
  const { rows } = await db.query<Row & { score: number; flags: Flags | null; published_at: Date }>(
    `SELECT a.id, a.title, a.excerpt, a.url, a.score, a.flags, COALESCE(a.published_at, a.created_at) AS published_at, s.name AS source, s.field, s.tier
     FROM articles a JOIN sources s ON s.id = a.source_id
     LEFT JOIN posts p ON p.article_id = a.id
     WHERE a.verdict = 'keep' AND p.id IS NULL AND a.created_at > now() - interval '48 hours'
     ORDER BY a.score DESC LIMIT $1`,
    [config.writeLimit],
  );

  for (const a of rows) {
    try {
      const fullText = await fetchArticleText(a.url);
      const draft = await writePost({ ...a, fullText });
      if (!draft) {
        await db.query("UPDATE articles SET verdict = 'skip', reason = 'yozishga arziydigan fakt yo''q' WHERE id = $1", [a.id]);
        continue;
      }
      const html = renderPost(draft, a.source, a.url, a.published_at);
      const sub = (a.flags as { sub?: string } | null)?.sub ?? null;
      const { rows: [post] } = await db.query<{ id: number }>(
        `INSERT INTO posts (article_id, field, sub, text, original_text, score) VALUES ($1, $2, $3, $4, $4, $5) RETURNING id`,
        [a.id, a.field, sub, html, a.score],
      );
      // Admin xabari darhol: post userlarga faqat tasdiqlangach boradi (✅ yoki avtomatik rejimda 30 daqiqadan keyin)
      const msg = await bot.api.sendMessage(config.adminChatId, `${html}\n\n<i>${sub ? subName(sub) : "-"} · Ball: ${a.score}/10 · ${statusLabel(a.flags)} · #${post.id}</i>`, {
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
        reply_markup: draftKeyboard(post.id),
      });
      await db.query("UPDATE posts SET admin_msg_id = $2 WHERE id = $1", [post.id, msg.message_id]);
    } catch (e) {
      if (e instanceof BudgetError) return; // byudjet tugadi: ertaga yoziladi
      console.error(`[write] ${a.id}:`, e instanceof Error ? e.message : e);
      await db.query(
        `UPDATE articles SET attempts = attempts + 1,
           verdict = CASE WHEN attempts + 1 >= $2 THEN 'skip' ELSE verdict END,
           reason = CASE WHEN attempts + 1 >= $2 THEN 'yozishda xato' ELSE reason END
         WHERE id = $1`,
        [a.id, MAX_ATTEMPTS],
      );
    }
  }
}
