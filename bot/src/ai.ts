import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { config } from "./config.ts";
import { STYLE_RULES, EXAMPLES, findBanned, scrub } from "./style.ts";
import { GENERAL_RULES, fieldPrompt } from "./criteria.ts";

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
      reason: z.string().describe("bitta qisqa gap, o'zbekcha"),
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

// ---------- 2. O'zbekcha post (Sonnet) ----------

const Post = z.object({
  title: z.string().describe("sarlavha, 12 so'zdan oshmasin, nuqtasiz"),
  body: z.string().describe("2-4 qisqa gap: nima bo'ldi va eng muhim tafsilotlar"),
});
export type PostDraft = z.infer<typeof Post>;

function system() {
  const ex = EXAMPLES.length ? `\n\nNamuna postlar (ohangini ushlang):\n\n${EXAMPLES.join("\n\n---\n\n")}` : "";
  return STYLE_RULES + ex;
}

type WriteInput = Candidate & { url: string; flags?: { confirmation?: string; testing?: boolean } | null };

function statusNote(f: WriteInput["flags"]) {
  const n: string[] = [];
  if (f?.confirmation === "reported") n.push("Rasmiy tasdiq yo'q: matnda \"xabar qilinishicha\" yoki manba nomi bilan ayting.");
  if (f?.confirmation === "rumor") n.push("Bu hali tasdiqlanmagan xabar: buni matnda aniq ayting.");
  if (f?.testing) n.push("Funksiya hali test bosqichida: buni matnda ayting.");
  return n.length ? `\n\nHolat: ${n.join(" ")}` : "";
}

async function writeOnce(a: WriteInput, extra = "") {
  const res = await client.beta.messages.parse({
    model: config.models.writer,
    max_tokens: 4000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium", format: betaZodOutputFormat(Post) },
    system: system(),
    messages: [
      {
        role: "user",
        content: `Manba: ${a.source}\nHavola: ${a.url}\n\nSarlavha: ${a.title}\n\nMatn:\n${a.excerpt}${statusNote(a.flags)}${extra}`,
      },
    ],
  });
  if (res.stop_reason === "refusal") throw new Error("yozish: refusal");
  if (!res.parsed_output) throw new Error("yozish: javob o'qilmadi");
  return res.parsed_output;
}

export async function writePost(a: WriteInput): Promise<PostDraft> {
  let p = await writeOnce(a);
  const bad = findBanned(`${p.title} ${p.body}`);
  if (bad.length) {
    p = await writeOnce(a, `\n\nOldingi variantda taqiqlangan iboralar bor edi: ${bad.join(", ")}. Ularsiz yozing.`);
  }
  return { title: scrub(p.title), body: scrub(p.body) };
}
