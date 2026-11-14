// Saralash → post yozish → admin guruhga tasdiqlashga yuborish
import type { Bot } from "grammy";
import { db } from "./db/index.ts";
import { config } from "./config.ts";
import { scoreArticles, writePost, type Candidate } from "./ai.ts";
import { renderPost } from "./format.ts";
import { draftKeyboard } from "./admin.ts";
import { finalScore, fieldCheck, type Flags, type Tier } from "./criteria.ts";

const BATCH = 20;

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
     WHERE a.verdict = 'pending' ORDER BY s.tier = 'official' DESC, a.id LIMIT 100`,
  );
  const byField = new Map<string, Row[]>();
  for (const r of rows) byField.set(r.field, [...(byField.get(r.field) ?? []), r]);

  for (const [field, list] of byField) {
    for (let i = 0; i < list.length; i += BATCH) {
      const chunk = list.slice(i, i + BATCH);
      const verdicts = await scoreArticles(field, chunk, await recentKept(field));
      const seen = new Set<number>();
      for (const v of verdicts) {
        const art = chunk.find((c) => c.id === v.id);
        if (!art || seen.has(v.id)) continue;
        seen.add(v.id);
        const { id, score: base, reason, category, hype, ...flags } = v;
        const f = fieldCheck(field, category, hype, base);
        const g = finalScore(f.score, flags, art.tier);
        const reject = g.reject ?? f.reject;
        const score = reject ? 0 : g.score;
        const keep = !reject && score >= config.minScore;
        await db.query(
          "UPDATE articles SET verdict = $2, score = $3, base_score = $4, flags = $5, reason = $6 WHERE id = $1",
          [id, keep ? "keep" : "skip", score, Math.round(base), JSON.stringify({ ...flags, category, hype }), reject ? `${reject}. ${reason}` : reason],
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
  const { rows } = await db.query<Row & { score: number; flags: Flags | null }>(
    `SELECT a.id, a.title, a.excerpt, a.url, a.score, a.flags, s.name AS source, s.field, s.tier
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
      const msg = await bot.api.sendMessage(config.adminChatId, `${html}\n\n<i>Ball: ${a.score}/10 · ${statusLabel(a.flags)} · #${post.id}</i>`, {
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
