// Maqolaning to'liq matnini oladi: post yozuvchi RSS'dagi qisqa parcha bilan cheklanib qolmasligi uchun.
// Oddiy usul: <article> (bo'lmasa butun sahifa) ichidagi <p> va <li> matnlari.
const UA = "Mozilla/5.0 (compatible; StepologBot/1.0; +https://www.stepolog.uz)";
const MAX = 7000; // AI'ga beriladigan matn chegarasi (belgi)

const decode = (s: string) =>
  s.replace(/&nbsp;/g, " ").replace(/&#x27;|&#39;|&apos;|&rsquo;|&lsquo;/g, "'").replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&mdash;|&ndash;/g, "-")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

export async function fetchArticleText(url: string): Promise<string> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(12000), redirect: "follow" });
    if (!res.ok || !(res.headers.get("content-type") ?? "").includes("html")) return "";
    let html = await res.text();
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
