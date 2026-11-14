// User o'zi tanlagan saytlarni kuzatish: RSS topiladi, yangi maqola o'zbekcha qisqa qilib yuboriladi
import Parser from "rss-parser";
import type { Bot } from "grammy";
import { db } from "./db/index.ts";
import { SITE_DAILY } from "./config.ts";
import { summarizeShort } from "./ai.ts";
import { esc } from "./format.ts";

const UA = "Mozilla/5.0 (compatible; StepologBot/1.0; +https://www.stepolog.uz)";
const parser = new Parser({ timeout: 8000, headers: { "User-Agent": UA } });
const clean = (s = "") => s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().slice(0, 1200);

function normalize(input: string): URL | null {
  const raw = input.trim().replace(/\s+/g, "");
  try {
    const u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (!u.hostname.includes(".")) return null;
    return u;
  } catch {
    return null;
  }
}

// Sahifadagi <link rel="alternate"> yoki odatiy manzillardan RSS qidiradi
async function discoverFeed(u: URL): Promise<{ feed: string; title: string } | null> {
  const tryFeed = async (url: string) => {
    try {
      const f = await parser.parseURL(url);
      return f.items?.length ? { feed: url, title: (f.title || u.hostname).trim() } : null;
    } catch {
      return null;
    }
  };
  const direct = await tryFeed(u.href);
  if (direct) return direct;

  try {
    const res = await fetch(u.href, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(8000), redirect: "follow" });
    const html = await res.text();
    const links = [...html.matchAll(/<link[^>]+type=["']application\/(?:rss|atom)\+xml["'][^>]*>/gi)]
      .map((m) => m[0].match(/href=["']([^"']+)["']/i)?.[1]).filter(Boolean) as string[];
    for (const l of links) {
      const r = await tryFeed(new URL(l, res.url).href);
      if (r) return r;
    }
  } catch {
    /* sahifa ochilmadi: odatiy manzillarni sinaymiz */
  }
  // Odatiy manzillar parallel tekshiriladi
  const guesses = await Promise.all(["/feed", "/rss", "/feed.xml", "/rss.xml", "/atom.xml", "/index.xml", "/blog/feed"].map((p) => tryFeed(new URL(p, u.origin).href)));
  return guesses.find(Boolean) ?? null;
}

export async function addSite(tgId: number, input: string): Promise<{ ok: true; title: string } | { ok: false; error: string }> {
  const u = normalize(input);
  if (!u) return { ok: false, error: "Bu sayt manziliga o'xshamaydi. Masalan: techcrunch.com" };
  const found = await discoverFeed(u);
  if (!found) return { ok: false, error: "Bu saytda yangiliklar lentasi (RSS) topilmadi. Hozircha faqat RSS'i bor saytlarni kuzata olaman." };

  const { rows: [site] } = await db.query<{ id: number }>(
    `INSERT INTO user_sites (tg_id, url, feed_url, title) VALUES ($1, $2, $3, $4)
     ON CONFLICT (tg_id, feed_url) DO UPDATE SET title = $4 RETURNING id`,
    [tgId, u.origin, found.feed, found.title.slice(0, 120)],
  );
  // Hozirgi maqolalar "ko'rilgan" deb belgilanadi: faqat bundan keyingilari yuboriladi
  const f = await parser.parseURL(found.feed);
  for (const it of f.items) {
    if (!it.link || !it.title) continue;
    await db.query("INSERT INTO user_site_items (site_id, url, title, sent) VALUES ($1, $2, $3, true) ON CONFLICT DO NOTHING", [site.id, it.link, clean(it.title)]);
  }
  return { ok: true, title: found.title };
}

// Asosiy tsiklda: barcha user saytlarini tekshirib, yangilarini yuboradi
export async function checkUserSites(bot: Bot) {
  const { rows: feeds } = await db.query<{ feed_url: string; ids: number[] }>(
    "SELECT feed_url, array_agg(id) AS ids FROM user_sites GROUP BY feed_url",
  );
  for (const f of feeds) {
    let items: Parser.Item[] = [];
    try {
      items = (await parser.parseURL(f.feed_url)).items;
      await db.query("UPDATE user_sites SET last_error = NULL WHERE feed_url = $1", [f.feed_url]);
    } catch (e) {
      await db.query("UPDATE user_sites SET last_error = $2 WHERE feed_url = $1", [f.feed_url, String(e).slice(0, 200)]);
      continue;
    }
    for (const id of f.ids) {
      for (const it of items.slice(0, 20)) {
        if (!it.link || !it.title) continue;
        await db.query("INSERT INTO user_site_items (site_id, url, title, excerpt) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
          [id, it.link, clean(it.title), clean(it.contentSnippet || it.content || it.summary)]);
      }
    }
  }

  // Yuborish: har userga kuniga ko'pi bilan SITE_DAILY ta
  const { rows: pending } = await db.query<{ id: number; tg_id: string; title: string; excerpt: string; url: string; site: string }>(
    `SELECT i.id, s.tg_id, i.title, i.excerpt, i.url, s.title AS site
     FROM user_site_items i JOIN user_sites s ON s.id = i.site_id
     WHERE NOT i.sent ORDER BY i.id LIMIT 30`,
  );
  for (const p of pending) {
    const { rows: [c] } = await db.query<{ n: string }>(
      `SELECT count(*) AS n FROM user_site_items i JOIN user_sites s ON s.id = i.site_id
       WHERE s.tg_id = $1 AND i.sent AND i.excerpt <> '' AND i.created_at > now() - interval '24 hours'`, [p.tg_id]);
    if (Number(c.n) >= SITE_DAILY) continue;
    try {
      const sum = await summarizeShort({ title: p.title, excerpt: p.excerpt });
      await bot.api.sendMessage(p.tg_id, `<b>${esc(sum.title)}</b>\n\n${esc(sum.body)}\n\n🌐 <a href="${esc(p.url)}">${esc(p.site)}</a>`, {
        parse_mode: "HTML", link_preview_options: { is_disabled: true },
      });
    } catch (e) {
      console.warn(`[sites] ${p.id}:`, e instanceof Error ? e.message : e);
    }
    await db.query("UPDATE user_site_items SET sent = true WHERE id = $1", [p.id]);
  }
}
