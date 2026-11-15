import { Bot } from "grammy";
import { run, sequentialize } from "@grammyjs/runner";
import { db } from "./db/index.ts";
import { config } from "./config.ts";
import { registerAdmin } from "./admin.ts";
import { registerMenu } from "./menu.ts";
import { registerSubs, checkExpiry } from "./subs.ts";
import { checkUserSites } from "./sites.ts";
import { fetchAll } from "./fetcher.ts";
import { scorePending, writeDrafts } from "./pipeline.ts";
import { maybeSendDigest, sendDigest } from "./digest.ts";
import { autoPublish, autoApprove, deliverProQueue } from "./publisher.ts";

const bot = new Bot(config.botToken);
// Bir vaqtda ko'p userga javob beradi; bitta chat ichida esa xabarlar navbat bilan (ikki marta bosish poygasi bo'lmaydi)
bot.use(sequentialize((ctx) => String(ctx.chat?.id ?? ctx.from?.id ?? "")));
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
  await ctx.reply("Manbalar o'qilmoqda va saralanmoqda... Tugagach xabar beraman.");
  // Kutib turmaymiz: bot boshqa userlarga javob berishda davom etadi
  void cycle().then(() => ctx.reply("Tayyor. Yangi qoralamalar yuqorida (bo'lsa). /holat").catch(() => {}));
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
  setInterval(() => autoApprove(bot.api).then(() => deliverProQueue(bot.api)).catch((e) => console.error("[approve/pro]", e)), 2 * 60_000);
  // Tashlab ketilgan to'lov qoralamalari (chek yuborilmagan) tozalanadi
  setInterval(() => db.query("DELETE FROM subscriptions WHERE status = 'draft' AND created_at < now() - interval '7 days'").catch(() => {}), 6 * 3600_000);
  setInterval(() => maybeSendDigest(bot).catch((e) => console.error("[digest]", e)), 5 * 60_000);
  setInterval(() => checkExpiry(bot).catch((e) => console.error("[expiry]", e)), 60 * 60_000);
  void cycle();
} else {
  console.log("Test rejimi: avtomatik tsikl o'chiq, /yangila bilan ishga tushiring");
}

await bot.init();
const runner = run(bot, { runner: { fetch: { allowed_updates: ["message", "callback_query", "my_chat_member"] } } });
console.log("Stepolog bot ishga tushdi");

for (const sig of ["SIGINT", "SIGTERM"] as const) {
  process.once(sig, () => {
    setTimeout(() => process.exit(0), 5000).unref(); // 5 soniyada to'xtamasa, majburan chiqadi
    void (runner.isRunning() ? runner.stop() : Promise.resolve()).finally(() => process.exit(0));
  });
}
