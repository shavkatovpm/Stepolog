import { Bot } from "grammy";
import { config } from "./config.ts";
import { registerAdmin } from "./admin.ts";
import { registerUsers } from "./users.ts";
import { fetchAll } from "./fetcher.ts";
import { scorePending, writeDrafts } from "./pipeline.ts";
import { maybeSendDigest } from "./digest.ts";

const bot = new Bot(config.botToken);
registerAdmin(bot);
registerUsers(bot);
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
  } catch (e) {
    console.error("[cycle]", e);
  } finally {
    busy = false;
  }
}

setInterval(cycle, config.fetchEveryMin * 60_000);
setInterval(() => maybeSendDigest(bot).catch((e) => console.error("[digest]", e)), 5 * 60_000);
void cycle();

for (const sig of ["SIGINT", "SIGTERM"] as const) {
  process.once(sig, async () => {
    await bot.stop().catch(() => {});
    process.exit(0);
  });
}

console.log("Stepolog bot ishga tushdi");
await bot.start({ allowed_updates: ["message", "callback_query"] });
