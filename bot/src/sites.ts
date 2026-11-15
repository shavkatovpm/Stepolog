// User o'zi tanlagan saytlarni kuzatish: RSS topiladi, yangi maqola o'zbekcha qisqa qilib yuboriladi
import Parser from "rss-parser";
import type { Bot } from "grammy";
import { db } from "./db/index.ts";
import { SITE_DAILY } from "./config.ts";
import { summarizeShort } from "./ai.ts";
import { esc } from "./format.ts";
import { fetchText } from "./net.ts";
import { sendSafe } from "./tg.ts";

const parser = new Parser();
// RSS'ni xavfsiz o'qish: faqat ochiq internet manzillari, hajm chegarasi bilan
async function parseFeed(url: string) {
  const r = await fetchText(url, 8000);
  if (!r) throw new Error("manzil ochilmadi yoki ruxsat etilmagan");
  return parser.parseString(r.text);
}
const clean = (s = "") => s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/\s+/g, " ").trim().slice(0, 1200);

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
      const f = await parseFeed(url);
      return f.items?.length ? { feed: url, title: (f.title || u.hostname).trim() } : null;
    } catch {
      return null;
    }
  };
  const direct = await tryFeed(u.href);
  if (direct) return direct;

  try {
    const res = await fetchText(u.href, 8000);
    if (!res) throw new Error("ochilmadi");
    const html = res.text;
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
  const f = await parseFeed(found.feed);
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
      items = (await parseFeed(f.feed_url)).items;
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

  // Yuborish: har userga kuniga ko'pi bilan SITE_DAILY ta, bir aylanishda har userga 3 tadan (hammaga navbat bilan).
  // Limitga yetgan user maqolalari "o'tkazildi" deb belgilanadi, boshqalarni to'sib qo'ymaydi. Bloklaganlar uchun AI ishlatilmaydi.
  await db.query(
    `UPDATE user_site_items i SET sent = true FROM user_sites s, users u
     WHERE s.id = i.site_id AND u.tg_id = s.tg_id AND NOT i.sent
       AND (u.blocked OR (SELECT count(*) FROM user_site_items x JOIN user_sites y ON y.id = x.site_id
                          WHERE y.tg_id = s.tg_id AND x.delivered_at > now() - interval '24 hours') >= $1)`,
    [SITE_DAILY],
  );
  const { rows: pending } = await db.query<{ id: number; tg_id: string; title: string; excerpt: string; url: string; site: string }>(
    `SELECT id, tg_id, title, excerpt, url, site FROM (
       SELECT i.id, s.tg_id, i.title, i.excerpt, i.url, s.title AS site,
              row_number() OVER (PARTITION BY s.tg_id ORDER BY i.id) AS n
       FROM user_site_items i JOIN user_sites s ON s.id = i.site_id JOIN users u ON u.tg_id = s.tg_id
       WHERE NOT i.sent AND NOT u.blocked) t
     WHERE n <= 3 ORDER BY id LIMIT 60`,
  );
  for (const p of pending) {
    await db.query("UPDATE user_site_items SET sent = true WHERE id = $1", [p.id]);
    try {
      const sum = await summarizeShort({ title: p.title, excerpt: p.excerpt });
      const ok = await sendSafe(bot.api, p.tg_id, `<b>${esc(sum.title)}</b>\n\n${esc(sum.body)}\n\n🌐 <a href="${esc(p.url)}">${esc(p.site)}</a>`, {
        parse_mode: "HTML", link_preview_options: { is_disabled: true },
      });
      if (ok) await db.query("UPDATE user_site_items SET delivered_at = now() WHERE id = $1", [p.id]);
    } catch (e) {
      console.warn(`[sites] ${p.id}:`, e instanceof Error ? e.message : e);
    }
  }
}
