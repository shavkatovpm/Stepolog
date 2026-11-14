import { Bot } from "grammy";
import { config } from "./config.ts";
import { registerAdmin } from "./admin.ts";
import { registerMenu } from "./menu.ts";
import { registerSubs, checkExpiry } from "./subs.ts";
import { checkUserSites } from "./sites.ts";
import { fetchAll } from "./fetcher.ts";
import { scorePending, writeDrafts } from "./pipeline.ts";
import { maybeSendDigest, sendDigest } from "./digest.ts";
import { autoPublish } from "./publisher.ts";

const bot = new Bot(config.botToken);
registerAdmin(bot);
registerSubs(bot);
registerMenu(bot);
bot.catch((err) => console.error("[bot]", err.error));

// Asosiy tsikl: o'qish → saralash → yozish. Bir vaqtda faqat bittasi ishlaydi.
let busy = false;
async function cycle() {
  if (busy) return;
  busy = true;
  try {
    await fetchAll();
    await scorePending();
    await writeDrafts(bot);
    await checkUserSites(bot);
  } catch (e) {
    console.error("[cycle]", e);
  } finally {
    busy = false;
  }
}

// Test buyruqlari (faqat admin): hozir yangilash, hozir chiqarish, dayjestni o'zimga yuborish
const admin = bot.filter((ctx) => ctx.chat?.id === config.adminChatId);
admin.command("yangila", async (ctx) => {
  if (busy) return ctx.reply("Hozir ishlayapti, biroz kuting.");
  await ctx.reply("Manbalar o'qilmoqda va saralanmoqda...");
  await cycle();
  await ctx.reply("Tayyor. Yangi qoralamalar yuqorida (bo'lsa). /holat");
});
admin.command("chiqar", async (ctx) => {
  await autoPublish(bot, true);
  await ctx.reply("Navbatdagi eng yaxshi qoralama chiqarildi (bo'lsa).");
});
admin.command("dayjest", async (ctx) => {
  await sendDigest(bot, ctx.chat.id);
});

if (config.autoCycle) {
  setInterval(cycle, config.fetchEveryMin * 60_000);
  setInterval(() => autoPublish(bot).catch((e) => console.error("[publish]", e)), 5 * 60_000);
  setInterval(() => maybeSendDigest(bot).catch((e) => console.error("[digest]", e)), 5 * 60_000);
  setInterval(() => checkExpiry(bot).catch((e) => console.error("[expiry]", e)), 60 * 60_000);
  void cycle();
} else {
  console.log("Test rejimi: avtomatik tsikl o'chiq, /yangila bilan ishga tushiring");
}

for (const sig of ["SIGINT", "SIGTERM"] as const) {
  process.once(sig, async () => {
    await bot.stop().catch(() => {});
    process.exit(0);
  });
}

console.log("Stepolog bot ishga tushdi");
await bot.start({ allowed_updates: ["message", "callback_query", "my_chat_member"] });
