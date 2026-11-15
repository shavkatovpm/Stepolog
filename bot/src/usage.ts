// AI xarajatini hisoblash va kunlik byudjet chegarasi.
// Har chaqiruvdan keyin tokenlar ai_usage jadvaliga yoziladi; kunlik chegara oshsa, AI chaqiruvlari to'xtaydi.
import { db, kvGet, kvSet } from "./db/index.ts";

// Narxlar ($ / 1M token): kiruvchi, chiquvchi (fikrlash tokenlari ham chiquvchi), keshdan o'qish
const PRICES: Record<string, [number, number, number]> = {
  "claude-haiku-5-5": [0.1, 0.5, 0.01],
  "claude-sonnet-5-5": [2, 10, 0.1],
  "claude-sonnet-5": [2, 10, 0.2],
  "claude-opus-5-5": [4, 20, 0.2],
};
export const DAILY_BUDGET = Number(process.env.DAILY_BUDGET ?? 0.3);
const TODAY = "(date_trunc('day', now() AT TIME ZONE 'Asia/Tashkent') AT TIME ZONE 'Asia/Tashkent')";

export class BudgetError extends Error {
  constructor() { super("kunlik AI byudjeti tugadi"); }
}

type Usage = { input_tokens?: number | null; output_tokens?: number | null; cache_read_input_tokens?: number | null };

export async function track(purpose: string, res: { model?: string; usage?: Usage }) {
  const u = res.usage ?? {};
  const [pi, po, pc] = PRICES[res.model ?? ""] ?? PRICES["claude-sonnet-5-5"];
  const inp = u.input_tokens ?? 0, out = u.output_tokens ?? 0, cache = u.cache_read_input_tokens ?? 0;
  const cost = (inp * pi + out * po + cache * pc) / 1e6;
  await db.query(
    "INSERT INTO ai_usage (purpose, model, input_tokens, output_tokens, cache_read_tokens, cost_usd) VALUES ($1, $2, $3, $4, $5, $6)",
    [purpose, res.model ?? "?", inp, out, cache, cost],
  ).catch((e) => console.warn("[usage]", e.message));
}

export async function spentToday(): Promise<number> {
  const { rows: [r] } = await db.query<{ s: string | null }>(`SELECT sum(cost_usd) AS s FROM ai_usage WHERE at >= ${TODAY}`);
  return Number(r.s ?? 0);
}

// Har AI chaqiruvidan oldin: bugungi xarajat chegaradan oshgan bo'lsa, to'xtatadi va adminga bir marta xabar beradi
let notify: ((text: string) => Promise<unknown>) | null = null;
export const onBudgetHit = (fn: (text: string) => Promise<unknown>) => { notify = fn; };

export async function guard() {
  const spent = await spentToday();
  if (spent < DAILY_BUDGET) return;
  const key = `budget_alert:${new Date().toISOString().slice(0, 10)}`;
  if (!(await kvGet(key))) {
    await kvSet(key, "1");
    await notify?.(`⚠️ Bugungi AI byudjeti tugadi: $${spent.toFixed(2)} / $${DAILY_BUDGET.toFixed(2)}.\n\nBot ertagacha yangi maqolalarni baholamaydi va post yozmaydi. Batafsil: /xarajat`).catch(() => {});
  }
  throw new BudgetError();
}

export async function report() {
  const { rows: [t] } = await db.query<Record<string, string | null>>(`
    SELECT
      (SELECT sum(cost_usd) FROM ai_usage WHERE at >= ${TODAY}) AS today,
      (SELECT sum(cost_usd) FROM ai_usage WHERE at >= now() - interval '7 days') AS week,
      (SELECT sum(cost_usd) FROM ai_usage WHERE at >= date_trunc('month', now() AT TIME ZONE 'Asia/Tashkent') AT TIME ZONE 'Asia/Tashkent') AS month`);
  const { rows: byPurpose } = await db.query<{ purpose: string; n: string; cost: string }>(
    `SELECT purpose, count(*) AS n, sum(cost_usd) AS cost FROM ai_usage WHERE at >= ${TODAY} GROUP BY 1 ORDER BY 3 DESC`,
  );
  const { rows: days } = await db.query<{ d: string; cost: string }>(
    `SELECT to_char(at AT TIME ZONE 'Asia/Tashkent', 'DD.MM') AS d, sum(cost_usd) AS cost FROM ai_usage
     WHERE at >= now() - interval '7 days' GROUP BY 1, date_trunc('day', at AT TIME ZONE 'Asia/Tashkent') ORDER BY date_trunc('day', at AT TIME ZONE 'Asia/Tashkent')`,
  );
  const $ = (v: string | number | null) => `$${Number(v ?? 0).toFixed(3)}`;
  const NAMES: Record<string, string> = { score: "saralash", write: "post yozish", proofread: "imlo tekshiruvi", user_filter: "manbalar filtri", user_write: "manbalar posti" };
  return [
    `💰 <b>AI xarajati</b>`,
    `Bugun: <b>${$(t.today)}</b> / ${$(DAILY_BUDGET)} chegara`,
    `7 kun: ${$(t.week)}\nShu oy: ${$(t.month)}`,
    byPurpose.length ? `<b>Bugun nimaga:</b>\n${byPurpose.map((r) => `• ${NAMES[r.purpose] ?? r.purpose}: ${$(r.cost)} (${r.n} ta)`).join("\n")}` : "",
    days.length ? `<b>Kunlar bo'yicha:</b>\n${days.map((r) => `${r.d}: ${$(r.cost)}`).join("\n")}` : "",
    `<i>Bot hisobi taxminiy. Aniq summa: platform.claude.com → Usage</i>`,
  ].filter(Boolean).join("\n\n");
}
