// "Maxsus yo'nalish": user o'zi tanlagan manbalar. Uch xil manba qo'llanadi:
//   1) RSS lentasi (sayt sahifasidan yoki odatiy manzillardan topiladi)        feed_url = "https://.../feed"
//   2) Ochiq Telegram kanal (t.me/kanal yoki @kanal), t.me/s/ sahifasi orqali    feed_url = "tg:kanal"
//   3) RSS'siz sayt: sayt xaritasi (sitemap.xml) orqali yangi sahifalar         feed_url = "sitemap:https://.../sitemap.xml"
// Yangi maqolalar AI filtridan o'tadi (userning mavzulari bo'yicha), o'tganlari to'liq matn bilan qisqa post bo'ladi.
import Parser from "rss-parser";
import type { Bot } from "grammy";
import { db } from "./db/index.ts";
import { SITE_DAILY } from "./config.ts";
import { scoreForUser, writeUserItem } from "./ai.ts";
import { esc, fmtNewsDate } from "./format.ts";
import { fetchText } from "./net.ts";
import { fetchArticleText } from "./article.ts";
import { sendSafe } from "./tg.ts";
import { subName } from "./criteria.ts";

const USER_MIN_SCORE = 6; // shu balldan pasti userga yuborilmaydi
const PER_CYCLE = 6; // bir aylanishda bitta user uchun ko'riladigan maqola

type Item = { url: string; title: string; excerpt: string; date: Date | null };

const parser = new Parser();
const decode = (s = "") =>
  s.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
const clean = (s = "") => decode(s).replace(/\s+/g, " ").trim().slice(0, 1500);

// ---------- 1. RSS ----------
async function rssItems(url: string): Promise<Item[]> {
  const r = await fetchText(url, 8000);
  if (!r) throw new Error("lenta ochilmadi");
  const f = await parser.parseString(r.text);
  return f.items.filter((i) => i.link && i.title).map((i) => ({
    url: i.link!.trim(), title: clean(i.title), excerpt: clean(i.contentSnippet || i.content || i.summary), date: i.isoDate ? new Date(i.isoDate) : null,
  }));
}

// ---------- 2. Telegram kanal (ochiq) ----------
const tgName = (input: string) => input.trim().match(/^(?:@|(?:https?:\/\/)?(?:t\.me|telegram\.me)\/(?:s\/)?)([A-Za-z0-9_]{4,32})\/?$/)?.[1];

async function tgItems(channel: string): Promise<{ title: string; items: Item[] }> {
  const r = await fetchText(`https://t.me/s/${channel}`, 10000);
  if (!r) throw new Error("kanal ochilmadi");
  const title = decode(r.text.match(/<meta property="og:title" content="([^"]+)"/)?.[1] ?? channel);
  const blocks = r.text.split('<div class="tgme_widget_message_wrap').slice(1);
  const items: Item[] = [];
  for (const b of blocks) {
    const post = b.match(/data-post="([^"]+)"/)?.[1];
    const html = b.match(/<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/)?.[1];
    if (!post || !html) continue; // matnsiz (faqat rasm/video) postlar o'tkaziladi
    const text = decode(html).replace(/[ \t]+/g, " ").trim();
    const time = b.match(/<time[^>]*datetime="([^"]+)"/)?.[1];
    items.push({ url: `https://t.me/${post}`, title: text.split("\n")[0].slice(0, 120), excerpt: text.slice(0, 1500), date: time ? new Date(time) : null });
  }
  return { title, items };
}

// ---------- 3. Sayt xaritasi (sitemap) ----------
export async function sitemapItems(url: string, depth = 0): Promise<Item[]> {
  const r = await fetchText(url, 10000);
  if (!r || !/<(urlset|sitemapindex)/i.test(r.text)) throw new Error("sayt xaritasi ochilmadi");
  const entries = [...r.text.matchAll(/<(url|sitemap)>([\s\S]*?)<\/\1>/gi)].map((m) => ({
    loc: decode(m[2].match(/<loc>([\s\S]*?)<\/loc>/i)?.[1] ?? "").trim(),
    mod: m[2].match(/<lastmod>([\s\S]*?)<\/lastmod>/i)?.[1]?.trim(),
  })).filter((e) => e.loc);
  if (/<sitemapindex/i.test(r.text)) {
    if (depth > 0 || !entries.length) return [];
    // Ichki xaritalardan maqolalar xaritasini tanlaymiz: kategoriya/teg/muallif xaritalari emas, eng yangisi birinchi
    const junk = /categor|tag|region|author|page|static|image|video|product|brand/i;
    const isNews = (l: string) => Number(/news|post|article|blog|yangilik|novost/i.test(l));
    const cands = entries.filter((e) => !junk.test(e.loc)).sort((a, b) =>
      (Date.parse(b.mod ?? "") || 0) - (Date.parse(a.mod ?? "") || 0) || isNews(b.loc) - isNews(a.loc));
    let fallback: Item[] = [];
    for (const c of cands.slice(0, 3)) {
      const items = await sitemapItems(c.loc, depth + 1).catch(() => [] as Item[]);
      if (items.some((i) => i.date)) return items; // sanali maqolalar topildi
      if (!fallback.length) fallback = items;
    }
    return fallback;
  }
  const sorted = entries.some((e) => e.mod)
    ? [...entries].sort((a, b) => (Date.parse(b.mod ?? "") || 0) - (Date.parse(a.mod ?? "") || 0))
    : entries.slice(-30).reverse();
  return sorted.slice(0, 30).map((e) => ({ url: e.loc, title: "", excerpt: "", date: e.mod ? new Date(e.mod) : null }));
}

// Manba turiga qarab maqolalar ro'yxati
async function sourceItems(feed: string): Promise<Item[]> {
  if (feed.startsWith("tg:")) return (await tgItems(feed.slice(3))).items;
  if (feed.startsWith("sitemap:")) return sitemapItems(feed.slice(8));
  return rssItems(feed);
}

// ---------- Manba topish ----------
function normalize(input: string): URL | null {
  const raw = input.trim().replace(/\s+/g, "");
  try {
    const u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return u.hostname.includes(".") ? u : null;
  } catch {
    return null;
  }
}

async function discover(u: URL): Promise<{ feed: string; title: string } | null> {
  const tryRss = async (url: string) => {
    try {
      return (await rssItems(url)).length ? url : null;
    } catch {
      return null;
    }
  };
  let siteTitle = u.hostname;
  const direct = await tryRss(u.href);
  if (direct) return { feed: direct, title: siteTitle };

  const page = await fetchText(u.href, 8000).catch(() => null);
  if (page) {
    siteTitle = decode(page.text.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim().slice(0, 80) || u.hostname;
    const links = [...page.text.matchAll(/<link[^>]+type=["']application\/(?:rss|atom)\+xml["'][^>]*>/gi)]
      .map((m) => m[0].match(/href=["']([^"']+)["']/i)?.[1]).filter(Boolean) as string[];
    for (const l of links) {
      const r = await tryRss(new URL(l, page.url).href);
      if (r) return { feed: r, title: siteTitle };
    }
  }
  const guesses = await Promise.all(["/feed", "/rss", "/feed.xml", "/rss.xml", "/atom.xml", "/index.xml", "/blog/feed"].map((p) => tryRss(new URL(p, u.origin).href)));
  const g = guesses.find(Boolean);
  if (g) return { feed: g, title: siteTitle };

  // RSS yo'q: sayt xaritasi
  for (const p of ["/sitemap.xml", "/sitemap_index.xml", "/news-sitemap.xml", "/sitemap-news.xml"]) {
    const url = new URL(p, u.origin).href;
    const items = await sitemapItems(url).catch(() => []);
    if (items.length) return { feed: `sitemap:${url}`, title: siteTitle };
  }
  return null;
}

export async function addSite(tgId: number, input: string): Promise<{ ok: true; title: string; kind: string } | { ok: false; error: string }> {
  let feed: string, title: string, url: string, kind: string, items: Item[];
  const tg = tgName(input);
  if (tg) {
    const r = await tgItems(tg).catch(() => null);
    if (!r || !r.items.length) return { ok: false, error: "Bu Telegram kanal topilmadi yoki yopiq. Faqat ochiq kanallarni kuzata olaman." };
    [feed, title, url, kind, items] = [`tg:${tg}`, r.title, `https://t.me/${tg}`, "Telegram kanal", r.items];
  } else {
    const u = normalize(input);
    if (!u) return { ok: false, error: "Bu sayt yoki kanal manziliga o'xshamaydi. Masalan: techcrunch.com yoki t.me/kanal" };
    const found = await discover(u);
    if (!found) return { ok: false, error: "Bu saytdan yangiliklarni o'qib bo'lmadi: unda lenta ham, sayt xaritasi ham topilmadi yoki sayt botlarni bloklaydi." };
    [feed, title, url] = [found.feed, found.title, u.origin];
    kind = feed.startsWith("sitemap:") ? "sayt xaritasi orqali" : "RSS orqali";
    items = await sourceItems(feed).catch(() => []);
  }
  const { rows: [site] } = await db.query<{ id: number }>(
    `INSERT INTO user_sites (tg_id, url, feed_url, title) VALUES ($1, $2, $3, $4)
     ON CONFLICT (tg_id, feed_url) DO UPDATE SET title = $4 RETURNING id`,
    [tgId, url, feed, title.slice(0, 120)],
  );
  // Hozirgi maqolalar "ko'rilgan": faqat bundan keyingilari yuboriladi
  for (const it of items) {
    await db.query("INSERT INTO user_site_items (site_id, url, title, sent) VALUES ($1, $2, $3, true) ON CONFLICT DO NOTHING", [site.id, it.url, it.title || it.url]);
  }
  return { ok: true, title, kind };
}

// ---------- Asosiy tsiklda: yangi maqolalarni yig'ish, saralash, yozish, yuborish ----------
export async function checkUserSites(bot: Bot) {
  const { rows: feeds } = await db.query<{ feed_url: string; ids: number[] }>(
    "SELECT s.feed_url, array_agg(s.id) AS ids FROM user_sites s JOIN users u ON u.tg_id = s.tg_id WHERE NOT u.blocked GROUP BY s.feed_url",
  );
  for (const f of feeds) {
    let items: Item[] = [];
    try {
      items = (await sourceItems(f.feed_url)).slice(0, 20);
      await db.query("UPDATE user_sites SET last_error = NULL WHERE feed_url = $1", [f.feed_url]);
    } catch (e) {
      await db.query("UPDATE user_sites SET last_error = $2 WHERE feed_url = $1", [f.feed_url, String(e).slice(0, 200)]);
      continue;
    }
    for (const id of f.ids) {
      for (const it of items) {
        await db.query(
          "INSERT INTO user_site_items (site_id, url, title, excerpt) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
          [id, it.url, it.title || it.url, it.excerpt],
        );
      }
    }
  }

  // Limitga yetgan yoki botni bloklagan userlarning maqolalari "o'tkazildi" (boshqalarni to'smaydi, AI sarflanmaydi)
  await db.query(
    `UPDATE user_site_items i SET sent = true FROM user_sites s, users u
     WHERE s.id = i.site_id AND u.tg_id = s.tg_id AND NOT i.sent
       AND (u.blocked OR (SELECT count(*) FROM user_site_items x JOIN user_sites y ON y.id = x.site_id
                          WHERE y.tg_id = s.tg_id AND x.delivered_at > now() - interval '24 hours') >= $1)`,
    [SITE_DAILY],
  );

  type P = { id: number; tg_id: string; subs: string[]; title: string; excerpt: string; url: string; site: string; feed: string; created_at: Date };
  const { rows: pending } = await db.query<P>(
    `SELECT id, tg_id, subs, title, excerpt, url, site, feed, created_at FROM (
       SELECT i.id, s.tg_id, u.subs, i.title, i.excerpt, i.url, s.title AS site, s.feed_url AS feed, i.created_at,
              row_number() OVER (PARTITION BY s.tg_id ORDER BY i.id) AS n
       FROM user_site_items i JOIN user_sites s ON s.id = i.site_id JOIN users u ON u.tg_id = s.tg_id
       WHERE NOT i.sent AND NOT u.blocked) t
     WHERE n <= $1 ORDER BY id LIMIT 120`,
    [PER_CYCLE],
  );
  const byUser = new Map<string, P[]>();
  for (const p of pending) byUser.set(p.tg_id, [...(byUser.get(p.tg_id) ?? []), p]);

  for (const [tgId, list] of byUser) {
    await db.query("UPDATE user_site_items SET sent = true WHERE id = ANY($1)", [list.map((p) => p.id)]);

    // Sayt xaritasidan kelganlarda sarlavha yo'q: sahifadan olinadi
    for (const p of list) {
      if (p.feed.startsWith("sitemap:") && (!p.title || p.title === p.url)) {
        const page = await fetchText(p.url, 8000).catch(() => null);
        const t = page?.text ?? "";
        p.title = decode(t.match(/<meta property="og:title" content="([^"]+)"/i)?.[1] ?? t.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim();
        p.excerpt = decode(t.match(/<meta (?:name|property)="(?:og:)?description" content="([^"]+)"/i)?.[1] ?? "");
      }
    }
    const usable = list.filter((p) => p.title && p.title !== p.url);
    if (!usable.length) continue;

    let verdicts: { id: number; score: number }[] = [];
    try {
      verdicts = await scoreForUser(list[0].subs.map(subName), usable.map((p) => ({ id: p.id, title: p.title, excerpt: p.excerpt, source: p.site })));
    } catch (e) {
      console.warn(`[sites] filtr ${tgId}:`, e instanceof Error ? e.message : e);
      continue;
    }
    for (const p of usable) {
      const v = verdicts.find((x) => x.id === p.id);
      if (!v || v.score < USER_MIN_SCORE) continue;
      try {
        // To'liq matn: saytda sahifadan, Telegram'da postning o'zi
        const text = p.feed.startsWith("tg:") ? p.excerpt : (await fetchArticleText(p.url)) || p.excerpt;
        const post = await writeUserItem({ title: p.title, text });
        if (!post) continue;
        const ok = await sendSafe(bot.api, tgId,
          `<b>${esc(post.title)}</b>\n\n${esc(post.body)}\n\n· Manba: <a href="${esc(p.url)}">${esc(p.site)}</a>\n· ${fmtNewsDate(p.created_at)}`,
          { parse_mode: "HTML", link_preview_options: { is_disabled: true } });
        if (ok) await db.query("UPDATE user_site_items SET delivered_at = now(), score = $2 WHERE id = $1", [p.id, Math.round(v.score)]);
      } catch (e) {
        console.warn(`[sites] ${p.id}:`, e instanceof Error ? e.message : e);
      }
    }
  }
}
