// Maqolaning to'liq matnini oladi: post yozuvchi RSS'dagi qisqa parcha bilan cheklanib qolmasligi uchun.
// Oddiy usul: <article> (bo'lmasa butun sahifa) ichidagi <p> va <li> matnlari.
import { fetchText } from "./net.ts";
const MAX = 7000; // AI'ga beriladigan matn chegarasi (belgi)

const decode = (s: string) =>
  s.replace(/&nbsp;/g, " ").replace(/&#x27;|&#39;|&apos;|&rsquo;|&lsquo;/g, "'").replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&mdash;|&ndash;/g, "-")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

export async function fetchArticleText(url: string): Promise<string> {
  try {
    const res = await fetchText(url, 12000); // ochiq internet, 2 MB gacha
    if (!res || !res.type.includes("html")) return "";
    let html = res.text;
    html = html.replace(/<(script|style|noscript|svg|nav|footer|header|aside|form)[\s\S]*?<\/\1>/gi, " ");
    const art = html.match(/<article[\s\S]*?<\/article>/i)?.[0] ?? html;
    const parts = [...art.matchAll(/<(p|li|h2|h3)[^>]*>([\s\S]*?)<\/\1>/gi)]
      .map((m) => decode(m[2].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim())
      .filter((t) => t.length > 40 && !/cookie|subscribe|newsletter|sign up|all rights reserved/i.test(t));
    return [...new Set(parts)].join("\n").slice(0, MAX);
  } catch {
    return "";
  }
}
