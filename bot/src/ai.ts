import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { config } from "./config.ts";
import { STYLE_RULES, EXAMPLES, findBanned, scrub, limitEmoji, normalizeUz } from "./style.ts";
import { GENERAL_RULES, fieldPrompt, FIELD_AUDIENCE } from "./criteria.ts";
import { AUDIENCE } from "./audience.ts";

const client = new Anthropic(); // ANTHROPIC_API_KEY

// ---------- 1. Saralash (Haiku) ----------

export type Candidate = { id: number; title: string; excerpt: string; source: string };

const Verdicts = z.object({
  items: z.array(
    z.object({
      id: z.number(),
      confirmation: z.enum(["official", "reported", "rumor"]),
      testing: z.boolean(),
      clickbait: z.boolean(),
      opinion: z.boolean(),
      promo: z.boolean(),
      stale: z.boolean(),
      duplicate_of: z.number().nullable(),
      category: z.string().describe("soha turlaridan birining id si yoki other"),
      hype: z.boolean(),
      score: z.number().describe("1-10, soha mezonlari bo'yicha"),
      reason: z.string().describe("bitta qisqa gap"),
    }),
  ),
});
export type Verdict = z.infer<typeof Verdicts>["items"][number];

// recent: shu sohada oxirgi 48 soatda qabul qilingan yangiliklar (takrorni aniqlash uchun)
export async function scoreArticles(field: string, list: Candidate[], recent: { id: number; title: string }[]) {
  const system = `Siz yangilik saralovchisiz. Har bir maqola uchun belgilar va ball qo'ying.\n\n${GENERAL_RULES}\n\n${fieldPrompt(field)}`;
  const prev = recent.length ? recent.map((r) => `id=${r.id}: ${r.title}`).join("\n") : "(hali yo'q)";
  const input = list.map((a) => `id=${a.id} | ${a.source}\n${a.title}\n${a.excerpt.slice(0, 500)}`).join("\n\n---\n\n");

  const res = await client.messages.parse({
    model: config.models.filter,
    max_tokens: 6000,
    output_config: { effort: "low", format: zodOutputFormat(Verdicts) },
    system,
    messages: [{ role: "user", content: `Avval qabul qilinganlar:\n${prev}\n\nYangi maqolalar:\n\n${input}` }],
  });

  if (res.stop_reason === "refusal") throw new Error("saralash: refusal");
  return res.parsed_output?.items ?? [];
}

// ---------- 2. Post (Sonnet), til auditoriyaga qarab ----------

const Post = z.object({
  title: z.string().describe("sarlavha, 12 so'zdan oshmasin, nuqtasiz"),
  body: z.string().describe("2-4 qisqa gap: nima bo'ldi va eng muhim tafsilotlar"),
  takeaway: z.string().describe("1-2 qisqa gap: yangilikni oddiy, tabiiy tilda tushuntirish (aslida nimani anglatadi). Maslahat emas, yorliqsiz"),
  skip: z.boolean().describe("manbada aniq fakt bo'lmasa true: post yozilmaydi"),
});
export type PostDraft = Omit<z.infer<typeof Post>, "skip">;

function system(field: string) {
  const ex = EXAMPLES.length ? `\n\nNamuna postlar (ohangini ushlang):\n\n${EXAMPLES.join("\n\n---\n\n")}` : "";
  return `${STYLE_RULES}\n\n${FIELD_AUDIENCE[field] ?? ""}${ex}`;
}

type WriteInput = Candidate & { url: string; field: string; fullText?: string; flags?: { confirmation?: string; testing?: boolean } | null };

// Faqat haqiqatan muhim holatlar matnda bir marta, qisqa aytiladi (ortiqcha shubha gaplari postni zaiflashtiradi)
function statusNote(f: WriteInput["flags"]) {
  const n: string[] = [];
  if (f?.confirmation === "rumor") n.push("Bu hali tasdiqlanmagan xabar: buni bitta qisqa iborada ayting (masalan, \"hali rasman e'lon qilinmagan\").");
  if (f?.testing) n.push("Funksiya hali sinov bosqichida: buni bitta qisqa iborada ayting.");
  return n.length ? `\n\nHolat: ${n.join(" ")}` : "";
}

// Gaplar soni (raqamdagi nuqta va qisqartmalarni hisobga olmaydi)
const sentences = (t: string) => t.split(/(?<=[.!?])\s+(?=[A-Z0-9А-ЯЎҚҒҲ"«'])/).filter((x) => x.trim().length > 3).length;

// Lotin yozuvidagi postga kirill harflari aralashib ketmasin
const hasCyrillic = (s: string) => /[\u0400-\u04FF]/.test(s);

async function writeOnce(a: WriteInput, extra = "") {
  const res = await client.beta.messages.parse({
    model: config.models.writer,
    max_tokens: 4000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium", format: betaZodOutputFormat(Post) },
    system: system(a.field),
    messages: [
      {
        role: "user",
        content: `Manba: ${a.source}\nHavola: ${a.url}\n\nSarlavha: ${a.title}\n\nMatn:\n${a.fullText || a.excerpt}${statusNote(a.flags)}${extra}`,
      },
    ],
  });
  if (res.stop_reason === "refusal") throw new Error("yozish: refusal");
  if (!res.parsed_output) throw new Error("yozish: javob o'qilmadi");
  return res.parsed_output;
}

// null qaytsa: manbada yozishga arziydigan fakt yo'q yoki sifatli matn chiqmadi, post bo'lmaydi
export async function writePost(a: WriteInput): Promise<PostDraft | null> {
  let p = await writeOnce(a);
  if (p.skip) return null;
  const all = (x: typeof p) => `${x.title} ${x.body} ${x.takeaway}`;
  const problems = (x: typeof p) => [
    ...findBanned(all(x)).map((b) => `taqiqlangan ibora "${b}"`),
    ...(hasCyrillic(all(x)) ? ["kirill harflari aralashgan, faqat lotin yozuvi"] : []),
    ...(sentences(x.body) > 3 ? [`asosiy matn ${sentences(x.body)} gap, ko'pi bilan 3 ta qisqa gap bo'lsin, eng muhimini qoldiring`] : []),
    ...(sentences(x.takeaway) > 2 || x.takeaway.length > 260 ? ["tushuntirish 1-2 qisqa gap bo'lsin"] : []),
  ];
  let bad = problems(p);
  if (bad.length) {
    p = await writeOnce(a, `\n\nOldingi variantda xatolar bor edi: ${bad.join("; ")}. Ularsiz qayta yozing.`);
    if (p.skip) return null;
    bad = problems(p);
    if (hasCyrillic(all(p))) return null; // ikkinchi urinishda ham bo'lsa, chiqarmaymiz
  }
  // Imlo tekshiruvi (arzon model): faqat imlo va grammatika, mazmun o'zgarmaydi
  const fixed = await proofread({ title: p.title, body: p.body, takeaway: p.takeaway }).catch(() => null);
  if (fixed && !hasCyrillic(all({ ...p, ...fixed }))) p = { ...p, ...fixed };
  if (hasCyrillic(all(p))) return null;

  // Emoji faqat amaliy izohda, bitta: sarlavha va matndan olib tashlanadi
  const [title, body] = limitEmoji([scrub(normalizeUz(p.title)), scrub(normalizeUz(p.body))], 0);
  const [takeaway] = limitEmoji([scrub(normalizeUz(p.takeaway))], 1);
  return { title, body, takeaway };
}

const Proof = z.object({ title: z.string(), body: z.string(), takeaway: z.string() });
async function proofread(p: z.infer<typeof Proof>) {
  const res = await client.messages.parse({
    model: config.models.filter,
    max_tokens: 2000,
    output_config: { effort: "low", format: zodOutputFormat(Proof) },
    system: `Siz korrektorsiz. Matn tili: ${AUDIENCE.lang}. Faqat imlo, tinish belgisi va grammatika xatolarini tuzating.
Boshqa yozuv harflari (masalan, lotin matn ichida kirill harfi) bo'lsa, to'g'ri harfga almashtiring.
Mazmun, raqamlar, nomlar, emoji va gaplar tartibini o'zgartirmang. Uzunlikni o'zgartirmang. Xato bo'lmasa, matnni o'zgarishsiz qaytaring.`,
    messages: [{ role: "user", content: JSON.stringify(p) }],
  });
  if (res.stop_reason === "refusal" || !res.parsed_output) throw new Error("korrektura: javob yo'q");
  return res.parsed_output;
}

// ---------- 3. User saytlari uchun qisqa mazmun (Haiku: arzon) ----------
const Short = z.object({
  title: z.string().describe("sarlavha, 12 so'zdan oshmasin"),
  body: z.string().describe("1-2 qisqa gap: maqola nima haqida"),
});

export async function summarizeShort(a: { title: string; excerpt: string }) {
  const res = await client.messages.parse({
    model: config.models.filter,
    max_tokens: 1500,
    output_config: { effort: "low", format: zodOutputFormat(Short) },
    system: `${STYLE_RULES}\n\nBu userning o'zi tanlagan saytidan maqola. Uni post tilida qisqa qilib bering. Amaliy izoh va emoji kerak emas.`,
    messages: [{ role: "user", content: `Sarlavha: ${a.title}\n\nMatn:\n${a.excerpt || "(matn yo'q, faqat sarlavha bo'yicha yozing)"}` }],
  });
  if (res.stop_reason === "refusal" || !res.parsed_output) throw new Error("qisqartirish: javob yo'q");
  const [title, body] = limitEmoji([scrub(res.parsed_output.title), scrub(res.parsed_output.body)], 0);
  return { title, body };
}
