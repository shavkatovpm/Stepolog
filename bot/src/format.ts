import type { PostDraft } from "./ai.ts";

export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Kanal posti (Telegram HTML)
export function renderPost(p: PostDraft, source: string, url: string) {
  return [
    `<b>${esc(p.title)}</b>`,
    esc(p.body),
    `<b>Siz uchun:</b> ${esc(p.forYou)}`,
    `Manba: <a href="${esc(url)}">${esc(source)}</a>`,
  ].join("\n\n");
}
