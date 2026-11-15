// Manbalarni o'qib, yangi maqolalarni bazaga yozadi. AI bu yerda ishlamaydi (tekin).
import Parser from "rss-parser";
import { db } from "./db/index.ts";
import { config } from "./config.ts";

const parser = new Parser({
  timeout: 15000,
  headers: { "User-Agent": "Mozilla/5.0 (compatible; StepologBot/1.0; +https://www.stepolog.uz)" },
});


const clean = (s = "") =>
  s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/\s+/g, " ").trim().slice(0, 1200);

export async function fetchAll() {
  const { rows: sources } = await db.query<{ id: number; name: string; feed_url: string }>(
    "SELECT id, name, feed_url FROM sources WHERE active",
  );
  let added = 0;

  for (const s of sources) {
    try {
      const feed = await parser.parseURL(s.feed_url);
      for (const it of feed.items) {
        const url = it.link?.trim();
        if (!url || !it.title) continue;
        const date = it.isoDate ? new Date(it.isoDate) : null;
        if (date && Date.now() - date.getTime() > config.maxAgeH * 3600_000) continue;

        const r = await db.query(
          `INSERT INTO articles (source_id, url, title, excerpt, published_at)
           VALUES ($1, $2, $3, $4, $5) ON CONFLICT (url) DO NOTHING`,
          [s.id, url, clean(it.title), clean(it.contentSnippet || it.content || it.summary), date],
        );
        added += r.rowCount ?? 0;
      }
      await db.query("UPDATE sources SET last_error = NULL WHERE id = $1", [s.id]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await db.query("UPDATE sources SET last_error = $2 WHERE id = $1", [s.id, msg.slice(0, 300)]);
      console.warn(`[fetch] ${s.name}: ${msg}`);
    }
  }
  if (added) console.log(`[fetch] ${added} ta yangi maqola`);
  return added;
}
