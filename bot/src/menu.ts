// Foydalanuvchi kabineti: bitta xabar, tugma bosilganda joyida almashadi.
// Callback ma'lumotlari: "m:<ekran>[:arg]" — ekranni ochish, "a:<amal>[:arg]" — amal bajarib, ekranni yangilash.
import { InlineKeyboard, type Bot, type Context } from "grammy";
import { db } from "./db/index.ts";
import { config, FIELD_NAMES, SOON_FIELDS, SITE_LIMIT, PAY_CARD, SUPPORT, PRICING, priceFor, som, PRO_INCLUDED, PRO_EXTRA, proExtraCount, proPrice } from "./config.ts";
import { addSite } from "./sites.ts";
import { publicLink } from "./publisher.ts";
import { FIELD_SUBS, subName } from "./criteria.ts";
import { notifyAdminReceipt } from "./subs.ts";

type User = {
  tg_id: string; fields: string[]; subs: string[]; digest: boolean; digest_time: string; state: string | null; autopost_wait: boolean;
};
type Screen = { text: string; kb: InlineKeyboard };

const fieldName = (f: string) => FIELD_NAMES[f] ?? SOON_FIELDS.find(([k]) => k === f)?.[1] ?? f;
const monthsLabel = (m: number) => `${m} oy`;

// ---------- Ma'lumot ----------
async function getUser(ctx: Context): Promise<User> {
  const f = ctx.from!;
  const { rows } = await db.query<User>(
    `INSERT INTO users (tg_id, first_name, username) VALUES ($1, $2, $3)
     ON CONFLICT (tg_id) DO UPDATE SET first_name = $2, username = $3, blocked = false
     RETURNING tg_id, fields, subs, digest, digest_time, state, autopost_wait`,
    [f.id, f.first_name, f.username ?? null],
  );
  return rows[0];
}
const votes = async (id: string) =>
  new Set((await db.query<{ field: string }>("SELECT field FROM field_votes WHERE tg_id = $1", [id])).rows.map((r) => r.field));
// product: "pro" = Dayjest Pro (yopiq kanal + yangiliklar chiqishi bilan). "channel" eski, ishlatilmaydi
type Product = "channel" | "pro";
const PRODUCT_NAME = (p: string, field: string) => (p === "pro" ? "Dayjest Pro" : `${fieldName(field)} kanali`);
// Narx: kanal uchun oddiy tarif, Pro uchun tanlangan yo'nalishlar soniga qarab
const amountFor = (u: User, product: string, months: number) => (product === "pro" ? proPrice(months, u.subs.length) : priceFor(months));
const activeSub = async (id: string, field: string, product: Product = "channel") =>
  (await db.query<{ id: number; months: number; status: string; ends_at: Date | null }>(
    `SELECT id, months, status, ends_at FROM subscriptions WHERE tg_id = $1 AND field = $2 AND product = $3 AND status IN ('pending', 'active')
     ORDER BY id DESC LIMIT 1`, [id, field, product])).rows[0];
const sites = async (id: string) =>
  (await db.query<{ id: number; url: string; title: string }>("SELECT id, url, title FROM user_sites WHERE tg_id = $1 ORDER BY id", [id])).rows;

const fmtDate = (d: Date) => new Intl.DateTimeFormat("uz-UZ", { timeZone: config.tz, day: "2-digit", month: "2-digit", year: "numeric" }).format(d);

// Pullik xizmat ekrani (kanal yoki Dayjest Pro): faol / tekshirilmoqda / sotib olish
async function subScreen(u: User, product: Product, field: string): Promise<Screen> {
  const s = await activeSub(u.tg_id, field, product);
  const name = PRODUCT_NAME(product, field);
  const back = product === "pro" ? "m:digest" : "m:channels";
  const what = product === "pro"
    ? "Oddiy dayjest kun yakunida bir marta keladi. Pro'da kuniga 5 tagacha muhim yangilikni chiqishi bilan ko'rasiz."
    : "Barcha saralangan yangiliklar chiqishi bilan kanalda, har birida amaliy izoh. Dushanba: haftalik xulosa.";
  if (s?.status === "active") {
    return {
      text: `${product === "pro" ? "⚡" : "📢"} <b>${name}</b>\n\n✅ Faol: <b>${fmtDate(s.ends_at!)}</b> gacha.\nTugashidan 3 kun oldin eslatma yuboraman.`,
      kb: new InlineKeyboard().text("🔁 Muddatni uzaytirish", `m:tariffs:${product}:${field}`).row().text("← Orqaga", back),
    };
  }
  if (s) {
    return { text: `${product === "pro" ? "⚡" : "📢"} <b>${name}</b>\n\n⏳ Chekingiz tekshirilmoqda. Tasdiqlangach shu yerga xabar keladi.`, kb: new InlineKeyboard().text("← Orqaga", back) };
  }
  return {
    text: `${product === "pro" ? "⚡" : "📢"} <b>${name}</b>\n\n${what}\n\nOyiga ${som(PRICING.monthly)}.`,
    kb: new InlineKeyboard().text("💳 Tarifni tanlash", `m:tariffs:${product}:${field}`).row().text("← Orqaga", back),
  };
}

// ---------- Ekranlar ----------
const S: Record<string, (u: User, arg?: string) => Promise<Screen>> = {
  async root() {
    return {
      text: "Salom! Men Stepolog 👋\n\nHar kuni siz uchun kerakli ma'lumotlarni qidiraman, ular orasidan eng muhimlarini saralab yuborib turaman.\n\nSiz esa xizmatlarimdan qaysilari kerakligini tanlang. Pastdagi tugmalar orqali 👇",
      kb: new InlineKeyboard().text("📰 Dayjest", "m:digest").text("📣 Avtopost", "m:autopost").row().text("❓ Yordam", "m:help"),
    };
  },

  async digest(u) {
    const pro = await activeSub(u.tg_id, "all", "pro");
    const kb = new InlineKeyboard().text("🗂 Yo'nalishlar", "m:fields").row();
    kb.text(pro?.status === "active" ? "⚡ Dayjest Pro · faol" : "⚡ Dayjest Pro", "m:pro:all");
    u.digest ? kb.text("🔕 O'chirish", "a:digest:off") : kb.text("🔔 Yoqish", "a:digest:on");
    return {
      text: `📰 <b>Kunlik dayjest</b>\n\nKun davomida yangiliklarni men kuzataman. Siz esa kun yakunida eng muhimlarini bitta xabarda olasiz.\n\nPastdan yo'nalishlarni tanlang.${u.digest ? "" : "\n\nHozir dayjest o'chiq."}`,
      kb: kb.row().text("← Orqaga", "m:root"),
    };
  },

  async fields(u) {
    const v = await votes(u.tg_id);
    const kb = new InlineKeyboard();
    for (const f of config.fields) {
      const n = u.subs.filter((x) => FIELD_SUBS[f]?.some((c) => c.id === x)).length;
      kb.text(`📢 ${fieldName(f)} · ${n} ta tanlangan ›`, `m:subs:${f}`);
      const link = await publicLink(f);
      if (link) kb.url("Kanali", link);
      kb.row();
    }
    for (const [k, n] of SOON_FIELDS) kb.text(v.has(k) ? `✓ ${n} · kutyapsiz` : `🔔 ${n} · tez orada`, `a:vote:${k}`).row();
    return {
      text: "🗂 <b>Yo'nalishlar</b>\n\nYo'nalishni oching va o'zingizga kerakli mavzularni belgilang. Yopiq yo'nalishlar uchun 🔔 bosing: ochilganda birinchi bo'lib xabar olasiz.",
      kb: kb.row().text(`✨ Maxsus · o'z saytlaringiz (${(await sites(u.tg_id)).length})`, "m:sites").row().text("← Orqaga", "m:digest"),
    };
  },

  async subs(u, field = config.fields[0]) {
    const kb = new InlineKeyboard();
    for (const c of FIELD_SUBS[field] ?? []) {
      const i = u.subs.indexOf(c.id);
      kb.text(i >= 0 ? `✅ ${c.name}` : `⬜️ ${c.name}`, `a:sub:${c.id}:${field}`).row();
    }
    const chosen = u.subs.filter((x) => FIELD_SUBS[field]?.some((c) => c.id === x));
    const extra = proExtraCount(chosen.length);
    return {
      text: `📢 <b>${fieldName(field)}</b>\n\nQaysi mavzular bo'yicha yuboray? Bot faqat siz belgilagan mavzulardagi yangiliklarni yuboradi.\n\n• Bepul dayjestda ${PRO_INCLUDED} tagacha mavzu\n• Dayjest Pro'da ${PRO_INCLUDED} tasi narxga kiradi, har bir qo'shimchasi +${som(PRO_EXTRA[1])} / oy${extra ? `\n\nSiz ${chosen.length} ta belgiladingiz: bepul dayjestga birinchi ${PRO_INCLUDED} tasi keladi.` : ""}`,
      kb: kb.text("← Orqaga", "m:fields"),
    };
  },


  async pro(u, field = "all") {
    return subScreen(u, "pro", field);
  },

  async tariffs(u, arg = "") {
    const [product, field] = arg.split(":");
    const kb = new InlineKeyboard();
    for (const m of Object.keys(PRICING.discounts).map(Number)) {
      const d = PRICING.discounts[m];
      kb.text(`${monthsLabel(m)} · ${som(amountFor(u, product, m))}${d ? ` (−${d}%)` : ""}`, `m:pay:${product}:${field}:${m}`).row();
    }
    const dirs = u.subs;
    const extra = proExtraCount(dirs.length);
    const note = product === "pro"
      ? `\n\nMavzular: <b>${dirs.map(subName).join(", ") || "tanlanmagan"}</b>\n${PRO_INCLUDED} tagacha narxga kiradi${extra ? `, qo'shimcha ${extra} ta: +${som(PRO_EXTRA[1] * extra)} / oy` : ""}.`
      : "";
    return { text: `💳 <b>${PRODUCT_NAME(product, field)}</b>${note}\n\nMuddatni tanlang:`, kb: kb.text("← Orqaga", `m:${product === "pro" ? "pro" : "ch"}:${field}`) };
  },

  async pay(u, arg = "") {
    const [product, field, m] = arg.split(":");
    const months = Number(m);
    const price = amountFor(u, product, months);
    const after = product === "pro" ? "Dayjest Pro yoqiladi" : "kanal havolasi keladi";
    const kb = new InlineKeyboard();
    if (PAY_CARD) kb.text("🧾 Chek yuborishga tayyorman", `a:receipt:${product}:${field}:${months}`).row();
    return {
      text: PAY_CARD
        ? `💳 <b>${PRODUCT_NAME(product, field)} · ${monthsLabel(months)}</b>\n\n1. Shu kartaga <b>${som(price)}</b> o'tkazing:\n<code>${PAY_CARD}</code>\n\n2. "Chek yuborishga tayyorman" tugmasini bosib, chek rasmini yuboring.\n\n3. Admin tasdiqlagach, ${after}.\n\nClick va Payme tez orada qo'shiladi.`
        : `💳 <b>${PRODUCT_NAME(product, field)} · ${monthsLabel(months)} · ${som(price)}</b>\n\nTo'lov tez orada ochiladi.${SUPPORT ? ` Hozir obuna bo'lish uchun yozing: ${SUPPORT}` : ""}`,
      kb: kb.text("← Orqaga", `m:tariffs:${product}:${field}`),
    };
  },

  async sites(u) {
    const list = await sites(u.tg_id);
    return {
      text: `✨ <b>Maxsus yo'nalish</b>\n\nO'zingizga alohida yo'nalish tuzing: kuzatmoqchi bo'lgan saytlaringizni qo'shing. Ularda yangi maqola chiqsa, qisqa qilib yuboraman.\n\nSaytlaringiz: <b>${list.length} ta</b> · ${SITE_LIMIT} tagacha`,
      kb: new InlineKeyboard().text("➕ Sayt qo'shish", "a:site_add").text("📋 Saytlarim", "m:site_list").row().text("← Orqaga", "m:fields"),
    };
  },

  async site_list(u) {
    const list = await sites(u.tg_id);
    const kb = new InlineKeyboard();
    for (const s of list) kb.text(`🗑 ${s.title.slice(0, 40)}`, `a:site_del:${s.id}`).row();
    return {
      text: list.length ? "📋 <b>Kuzatilayotgan saytlar</b>\n\n" + list.map((s, i) => `${i + 1}. ${s.title}\n${s.url}`).join("\n\n") + "\n\nO'chirish uchun bosing:" : "Hali sayt qo'shilmagan.",
      kb: kb.text("← Orqaga", "m:sites"),
    };
  },

  async autopost(u) {
    return {
      text: "📣 <b>Kanalim uchun avtopost</b> · tez orada\n\nStepolog'ni kanalingizga admin qilasiz. U siz aytgan yo'nalish bo'yicha yangiliklarni kanalingiz uslubida yozib, jadval bo'yicha joylab boradi.",
      kb: new InlineKeyboard()
        .text(u.autopost_wait ? "✓ Navbatdasiz · bekor qilish" : "🔔 Ochilganda xabar bering", "a:wait").row()
        .text("← Orqaga", "m:root"),
    };
  },

  async help() {
    return {
      text: `❓ <b>Yordam</b>\n\nStepolog xorijiy saytlardagi muhim yangiliklarni saralab, o'zbek tilida qisqa qilib yetkazadi.\n\n• Dayjest: har kuni kun oxirida eng muhim yangiliklar, bepul\n• Dayjest Pro: muhim yangiliklar chiqishi bilan botga\n• Kanallar: muhim yangiliklar chiqishi bilan kanalda\n• Maxsus yo'nalish: o'zingiz tanlagan saytlar\n• Avtopost: kanalingizga post, tez orada\n\nKabinetni ochish: /start${SUPPORT ? `\nSavol va taklif: ${SUPPORT}` : ""}`,
      kb: new InlineKeyboard().text("← Orqaga", "m:root"),
    };
  },
};

async function render(ctx: Context, screen: string, arg?: string, u?: User, fresh = false) {
  u ??= await getUser(ctx);
  const s = await (S[screen] ?? S.root)(u, arg);
  const opts = { parse_mode: "HTML" as const, reply_markup: s.kb, link_preview_options: { is_disabled: true } };
  if (ctx.callbackQuery?.message && !fresh) {
    await ctx.editMessageText(s.text, opts).catch((e) => {
      if (!String(e?.description ?? e).includes("not modified")) throw e;
    });
  } else {
    await ctx.reply(s.text, opts);
  }
}

// ---------- Ro'yxatdan o'tkazish ----------
export function registerMenu(bot: Bot) {
  const priv = bot.chatType("private");

  priv.command("start", async (ctx) => {
    const u = await getUser(ctx);
    if (u.state) await db.query("UPDATE users SET state = NULL WHERE tg_id = $1", [u.tg_id]);
    await render(ctx, "root", undefined, { ...u, state: null });
  });

  priv.command("help", (ctx) => render(ctx, "help"));

  priv.command("stop", async (ctx) => {
    await db.query("UPDATE users SET digest = false WHERE tg_id = $1", [ctx.from.id]);
    await ctx.reply("Kunlik dayjest o'chirildi. Qayta yoqish: /start → Dayjest");
  });

  // Ekran ochish
  bot.callbackQuery(/^m:([a-z_]+)(?::(.+))?$/, async (ctx) => {
    await render(ctx, ctx.match[1], ctx.match[2]);
    await ctx.answerCallbackQuery();
  });

  // Boshqa xabardan (masalan, dayjest ostidan) ekranni yangi xabarda ochish
  bot.callbackQuery(/^o:([a-z_]+)(?::(.+))?$/, async (ctx) => {
    await render(ctx, ctx.match[1], ctx.match[2], undefined, true);
    await ctx.answerCallbackQuery();
  });

  // Amallar
  bot.callbackQuery(/^a:([a-z_]+)(?::(.+))?$/, async (ctx) => {
    const [, act, arg = ""] = ctx.match;
    const u = await getUser(ctx);
    const id = u.tg_id;
    let screen = "root", sarg: string | undefined, toast = "";

    switch (act) {
      case "digest":
        await db.query("UPDATE users SET digest = $2 WHERE tg_id = $1", [id, arg === "on"]);
        screen = "digest"; toast = arg === "on" ? "Dayjest yoqildi" : "Dayjest o'chirildi";
        break;
      case "sub": {
        const [subId, field] = arg.split(":");
        if (!FIELD_SUBS[field]?.some((c) => c.id === subId)) break;
        const has = u.subs.includes(subId);
        await db.query(`UPDATE users SET subs = ${has ? "array_remove(subs, $2)" : "array_append(subs, $2)"} WHERE tg_id = $1`, [id, subId]);
        screen = "subs"; sarg = field;
        toast = has ? `${subName(subId)}: o'chirildi` : `${subName(subId)}: qo'shildi`;
        break;
      }
      case "field": {
        const has = u.fields.includes(arg);
        await db.query(`UPDATE users SET fields = ${has ? "array_remove(fields, $2)" : "array_append(fields, $2)"} WHERE tg_id = $1`, [id, arg]);
        screen = "fields";
        break;
      }
      case "vote": {
        const [field, back] = arg.split(":");
        const r = await db.query("DELETE FROM field_votes WHERE tg_id = $1 AND field = $2", [id, field]);
        if (!r.rowCount) {
          await db.query("INSERT INTO field_votes (tg_id, field) VALUES ($1, $2) ON CONFLICT DO NOTHING", [id, field]);
          toast = `${fieldName(field)} ochilganda xabar beramiz`;
        }
        screen = back === "channels" ? "channels" : "fields";
        break;
      }
      case "wait":
        await db.query("UPDATE users SET autopost_wait = NOT autopost_wait WHERE tg_id = $1", [id]);
        screen = "autopost"; toast = u.autopost_wait ? "Navbatdan chiqdingiz" : "Navbatga yozildingiz";
        break;
      case "site_add": {
        const n = (await sites(id)).length;
        if (n >= SITE_LIMIT) { screen = "site_list"; toast = `Bepul tarifda ${SITE_LIMIT} ta sayt. Avval bittasini o'chiring`; break; }
        await db.query("UPDATE users SET state = 'await_site' WHERE tg_id = $1", [id]);
        await ctx.answerCallbackQuery();
        await ctx.editMessageText("✨ Sayt manzilini yozib yuboring.\nMasalan: <b>techcrunch.com</b>\n\nBekor qilish: /start", { parse_mode: "HTML" });
        return;
      }
      case "site_del":
        await db.query("DELETE FROM user_sites WHERE id = $1 AND tg_id = $2", [Number(arg), id]);
        screen = "site_list"; toast = "Sayt o'chirildi";
        break;
      case "receipt": {
        const [product, field, m] = arg.split(":");
        const months = Number(m);
        const okField = product === "pro" ? field === "all" : config.fields.includes(field);
        if (product !== "pro" || !okField || !(months in PRICING.discounts)) break;
        const amount = amountFor(u, product, months);
        const slots = Math.max(PRO_INCLUDED, u.subs.length);
        const { rows: [sub] } = await db.query<{ id: number }>(
          "INSERT INTO subscriptions (tg_id, field, product, months, amount, slots, status) VALUES ($1, $2, $3, $4, $5, $6, 'draft') RETURNING id",
          [id, field, product, months, amount, slots],
        );
        await db.query("UPDATE users SET state = $2 WHERE tg_id = $1", [id, `await_receipt:${sub.id}`]);
        await ctx.answerCallbackQuery();
        await ctx.editMessageText(`🧾 Chek rasmini (skrinshot) shu chatga yuboring.\n\nSumma: <b>${som(amount)}</b>\n\nBekor qilish: /start`, { parse_mode: "HTML" });
        return;
      }
    }
    await render(ctx, screen, sarg);
    await ctx.answerCallbackQuery(toast || undefined);
  });

  // Kutilayotgan kiritishlar: sayt manzili yoki chek rasmi
  priv.on("message", async (ctx, next) => {
    if (ctx.message.text?.startsWith("/")) return next();
    const { rows: [u] } = await db.query<{ state: string | null }>("SELECT state FROM users WHERE tg_id = $1", [ctx.from.id]);
    const state = u?.state;
    if (!state) return next();

    if (state === "await_site") {
      const text = ctx.message.text?.trim();
      if (!text) return ctx.reply("Sayt manzilini matn ko'rinishida yuboring. Bekor qilish: /start");
      await ctx.replyWithChatAction("typing");
      const res = await addSite(ctx.from.id, text);
      if (!res.ok) return ctx.reply(`⚠️ ${res.error}\n\nBoshqa manzil yuboring yoki bekor qiling: /start`);
      await db.query("UPDATE users SET state = NULL WHERE tg_id = $1", [ctx.from.id]);
      await ctx.reply(`✅ <b>${res.title}</b> maxsus yo'nalishingizga qo'shildi.\n\nHar 30 daqiqada tekshiraman, yangi maqola chiqsa qisqa qilib yuboraman.`, { parse_mode: "HTML" });
      return render(ctx, "sites");
    }

    if (state.startsWith("await_receipt:")) {
      const photo = ctx.message.photo?.at(-1)?.file_id ?? (ctx.message.document?.mime_type?.startsWith("image/") ? ctx.message.document.file_id : undefined);
      if (!photo) return ctx.reply("Chekni rasm (skrinshot) ko'rinishida yuboring. Bekor qilish: /start");
      const subId = Number(state.split(":")[1]);
      await db.query("UPDATE subscriptions SET status = 'pending', receipt_file_id = $2 WHERE id = $1", [subId, photo]);
      await db.query("UPDATE users SET state = NULL WHERE tg_id = $1", [ctx.from.id]);
      await notifyAdminReceipt(ctx.api, subId);
      await ctx.reply("⏳ Chek qabul qilindi. Admin tekshirgach, shu yerga xabar keladi.");
      return render(ctx, "root");
    }
    return next();
  });
}

