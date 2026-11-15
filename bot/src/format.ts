import type { PostDraft } from "./ai.ts";

export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const MONTH_UZ = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentyabr", "oktyabr", "noyabr", "dekabr"];

// Yangilik manbada chiqqan sana: "15-noyabr 2026" (Toshkent vaqti)
export function fmtNewsDate(d: Date | string | null | undefined) {
  if (!d) return "";
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tashkent", year: "numeric", month: "numeric", day: "numeric" }).formatToParts(new Date(d));
  const g = (t: string) => Number(p.find((x) => x.type === t)!.value);
  return `${g("day")}-${MONTH_UZ[g("month") - 1]} ${g("year")}`;
}

// Kanal posti (Telegram HTML). Oxirida ikki qator: "· Manba: ..." va "· 13-noyabr 2026" (yangilik chiqqan sana)
export function renderPost(p: PostDraft, source: string, url: string, date?: Date | string | null) {
  const d = fmtNewsDate(date);
  return [
    `<b>${esc(p.title)}</b>`,
    esc(p.body),
    esc(p.takeaway),
    [`· Manba: <a href="${esc(url)}">${esc(source)}</a>`, d ? `· ${d}` : ""].filter(Boolean).join("\n"),
  ].join("\n\n");
}
