import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { config } from "./config.ts";
import { STYLE_RULES, EXAMPLES, findBanned, scrub } from "./style.ts";

const client = new Anthropic(); // ANTHROPIC_API_KEY

// ---------- 1. Saralash (Haiku) ----------

export type Candidate = { id: number; title: string; excerpt: string; source: string };

const Verdicts = z.object({
  items: z.array(
    z.object({
      id: z.number(),
      score: z.number().describe("1-10: O'zbekistondagi marketolog uchun qanchalik muhim va amaliy"),
      reason: z.string().describe("bitta qisqa gap, o'zbekcha"),
    }),
  ),
});

const FILTER_PROMPT = `
Siz O'zbekistondagi marketologlar uchun yangilik saralovchisiz. Har bir maqolaga 1 dan 10 gacha ball bering.

Yuqori ball (8-10): reklama platformalari va ijtimoiy tarmoqlardagi aniq o'zgarishlar
(Google Ads, Meta, Instagram, TikTok, YouTube, Telegram): yangi funksiya, algoritm o'zgarishi, qoida, narx,
reklama formati, hisobot vositasi. Marketolog ishini bugun o'zgartiradigan narsa.
O'rta (5-7): foydali tadqiqot yoki raqamlar, katta brendning ibratli kampaniyasi.
Past (1-4): reklama postlari, vebinar e'lonlari, "10 ta maslahat" tipidagi umumiy maqolalar, kadrlar almashuvi,
kompaniya moliyaviy hisobotlari, faqat AQSh bozoriga tegishli mahalliy yangiliklar, SEO texnik tafsilotlari.
O'zbekistonda ishlamaydigan platformalar ham past (1-3): Amazon, Walmart, eBay, Etsy, Shopify reklamalari,
AQSh retail media, Amazon DSP. O'zbekistonda asosiylari: Instagram, Telegram, Meta Ads, Google Ads, YouTube, TikTok.
Ko'rsatma va izohlovchi maqolalar (explainer, "nima bu") yangilik emas: 1-5.
`.trim();

export async function scoreArticles(list: Candidate[]) {
  const input = list.map((a) => `id=${a.id} | ${a.source}\n${a.title}\n${a.excerpt.slice(0, 500)}`).join("\n\n---\n\n");

  const res = await client.messages.parse({
    model: config.models.filter,
    max_tokens: 4000,
    output_config: { effort: "low", format: zodOutputFormat(Verdicts) },
    system: FILTER_PROMPT,
    messages: [{ role: "user", content: input }],
  });

  if (res.stop_reason === "refusal") throw new Error("saralash: refusal");
  return res.parsed_output?.items ?? [];
}

// ---------- 2. O'zbekcha post (Sonnet) ----------

const Post = z.object({
  title: z.string().describe("sarlavha, 12 so'zdan oshmasin, nuqtasiz"),
  body: z.string().describe("2-3 qisqa gap: nima bo'ldi"),
  forYou: z.string().describe("1-2 gap: bu o'quvchiga nima beradi, nima qilish kerak"),
});
export type PostDraft = z.infer<typeof Post>;

function system() {
  const ex = EXAMPLES.length ? `\n\nNamuna postlar (ohangini ushlang):\n\n${EXAMPLES.join("\n\n---\n\n")}` : "";
  return STYLE_RULES + ex;
}

async function writeOnce(a: Candidate & { url: string }, extra = "") {
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
        content: `Manba: ${a.source}\nHavola: ${a.url}\n\nSarlavha: ${a.title}\n\nMatn:\n${a.excerpt}${extra}`,
      },
    ],
  });
  if (res.stop_reason === "refusal") throw new Error("yozish: refusal");
  if (!res.parsed_output) throw new Error("yozish: javob o'qilmadi");
  return res.parsed_output;
}

export async function writePost(a: Candidate & { url: string }): Promise<PostDraft> {
  let p = await writeOnce(a);
  const bad = findBanned(`${p.title} ${p.body} ${p.forYou}`);
  if (bad.length) {
    p = await writeOnce(a, `\n\nOldingi variantda taqiqlangan iboralar bor edi: ${bad.join(", ")}. Ularsiz yozing.`);
  }
  return { title: scrub(p.title), body: scrub(p.body), forYou: scrub(p.forYou) };
}
