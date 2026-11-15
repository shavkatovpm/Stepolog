// Telegram'ga xavfsiz yuborish: 429 (juda ko'p so'rov) bo'lsa kutib qayta urinadi, 403 (bot bloklangan) bo'lsa userni belgilaydi
import { GrammyError, type Api } from "grammy";
import { db } from "./db/index.ts";

type Opts = Parameters<Api["sendMessage"]>[2];
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function sendSafe(api: Api, chatId: number | string, text: string, opts?: Opts): Promise<boolean> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      await api.sendMessage(chatId, text, opts);
      return true;
    } catch (e) {
      if (e instanceof GrammyError && e.error_code === 429 && attempt === 0) {
        await sleep(((e.parameters?.retry_after ?? 3) + 1) * 1000);
        continue;
      }
      if (e instanceof GrammyError && e.error_code === 403) {
        await db.query("UPDATE users SET blocked = true WHERE tg_id = $1", [chatId]).catch(() => {});
        return false;
      }
      console.warn(`[send] ${chatId}:`, e instanceof Error ? e.message : e);
      return false;
    }
  }
  return false;
}
