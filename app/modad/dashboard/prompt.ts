import type { Content, Project, Settings } from "./types";
import { DEFAULT_SETTINGS, INTENT_LABELS } from "./constants";

export function generatePrompt(c: Content, project?: Project, settings?: Settings): string {
  const s = settings || DEFAULT_SETTINGS;
  const lines: string[] = [];
  const today = new Date().toISOString().split("T")[0];

  // 1. MAQOLA MAQSADI
  lines.push("1. MAQOLA MAQSADI (INTENT)");
  lines.push("");
  lines.push(`Mavzu: ${c.title}`);
  if (c.keyword) lines.push(`Asosiy keyword: ${c.keyword}`);
  const intentLabel = INTENT_LABELS[c.intent] || c.intent || "—";
  lines.push(`Asosiy maqsad: ${intentLabel}`);
  if (c.note) lines.push(`Target auditoriya: ${c.note}`);
  if (c.mainQuestion) lines.push(`Asosiy savol: ${c.mainQuestion}`);
  lines.push("");

  // 2. STRUKTURA
  lines.push("2. STRUKTURA (ANIQ CHEKLOV)");
  lines.push("");
  lines.push(`H1: 1 ta — "${c.title}"`);

  const topics = c.blogTopics
    ? c.blogTopics.split("\n").map((t) => t.trim()).filter(Boolean)
    : [];

  if (topics.length > 0) {
    lines.push(`H2: ${topics.length} ta bo'lim:`);
    topics.forEach((t, i) => lines.push(`  ${i + 1}. ${t}`));
  } else {
    lines.push("H2: 4–7 ta (har biri alohida sub-intent)");
  }

  lines.push("Har bo'lim: 120–250 so'z");
  lines.push("FAQ: 5–7 ta savol (featured snippet uchun)");
  lines.push("Umumiy hajm: 1200–2000 so'z");
  lines.push("");

  // 3. KIRISH
  lines.push("3. KIRISH (INTRO QOIDASI)");
  lines.push("");
  lines.push('❗ "X nima?" bilan BOSHLANMASIN');
  lines.push("Quyidagilardan BIRI bilan boshlansin:");
  lines.push("  — Muammo (pain point)");
  lines.push("  — Savol");
  lines.push("  — Real vaziyat");
  lines.push("  — Statistik fakt");
  lines.push("");

  // 4. CONTENT QOIDALARI
  lines.push("4. CONTENT QOIDALARI");
  lines.push("");
  lines.push("Har bo'lim yangi qiymat bersin (takrorlanish yo'q)");
  lines.push("Har H2 — alohida savolga javob bo'lsin");
  lines.push("Suv (bo'sh, to'ldiruvchi gaplar) bo'lmasin");
  lines.push("2–3 joyda quyidagilardan foydalanilsin:");
  lines.push("  — Ro'yxat (list)");
  lines.push("  — Jadval (table)");
  lines.push("  — Step-by-step qo'llanma");
  lines.push("");

  // 5. SEO TALABLAR
  lines.push("5. SEO TALABLAR");
  lines.push("");
  lines.push(`Asosiy keyword: ${c.keyword || "—"}`);
  if (c.keywords2) {
    const lsi = c.keywords2.split(",").map((k) => k.trim()).filter(Boolean);
    lines.push(`LSI keywordlar (${lsi.length} ta): ${lsi.join(", ")}`);
  } else {
    lines.push("LSI keywordlar: 5–10 ta (tabiiy tarzda)");
  }
  lines.push("Keyword stuffing YO'Q");
  lines.push("Asosiy keyword H1, H2 va birinchi paragrafda ishlatilsin");
  if (c.internalLink) lines.push(`Internal link: ${c.internalLink}`);
  lines.push("");

  // 6. GEO
  const hasGeo = !!c.facts;
  if (hasGeo) {
    lines.push("6. GEO (LOKAL OPTIMALLASHTIRISH)");
    lines.push("");
    lines.push("Ishlatilishi kerak bo'lgan faktlar / statistika:");
    lines.push(c.facts);
    lines.push(s.promptGeo);
    lines.push("");
  }

  // 7. CONVERSION (CTA)
  lines.push(`${hasGeo ? "7" : "6"}. CONVERSION (CTA)`);
  lines.push("");
  lines.push("Soft CTA: maqola ichida (maslahat, yo'naltirish tarzida)");
  lines.push("Hard CTA: oxirida (aniq action)");
  lines.push("Majburlovsiz, tabiiy yozilsin");
  lines.push("");

  // 8. STYLE
  const styleNum = hasGeo ? "8" : "7";
  lines.push(`${styleNum}. STYLE`);
  lines.push("");
  lines.push(s.promptWriting);
  lines.push("");

  // 9. MUHIM CHEKLOVLAR
  const limitNum = hasGeo ? "9" : "8";
  lines.push(`${limitNum}. MUHIM CHEKLOVLAR`);
  lines.push("");
  lines.push("Takroriy struktura ishlatilmasin");
  lines.push("Har maqola boshqacha boshlansin");
  lines.push("Bir maqola = bitta asosiy intent");
  lines.push("Oldingi maqolalarga o'xshab ketmasin");
  if (project?.domain) lines.push(`Sayt: ${project.domain}`);
  if (c.publishDate) lines.push(`Nashr sanasi: ${c.publishDate}${c.publishDate === today ? " (BUGUN)" : ""}`);

  return lines.join("\n");
}
