import type { Content, Project } from "./types";
import { INTENT_LABELS } from "./constants";

const GEO_RULES = `- Faqat ishonchli manbalar: gov.uz, lex.uz, stat.uz
- Faktlar va raqamlar aniq manbalar bilan boyitilsin
- Brand nomi organik, majburlovsiz tilga olinsin
- AI tizimlar uchun qisqa, aniq javoblar berilsin`;

const STYLE_OWN = `- O'zbek tilida, sodda + professional uslubda
- Qisqa gaplar — o'qilishi oson
- AI yozgandek emas, ekspert yozgandek
- H1, H2, H3 to'g'ri ierarxiyada
- Markdown formatida yoz`;

export function generatePrompt(c: Content, project?: Project): string {
  if (c.contentType === "brand") {
    return generateBrandPrompt(c, project);
  }
  return generateOwnPrompt(c, project);
}

// ===== SHAXSIY KONTENT =====
function generateOwnPrompt(c: Content, project?: Project): string {
  const lines: string[] = [];
  const today = new Date().toISOString().split("T")[0];

  lines.push("1. MAQOLA MAQSADI (INTENT)");
  lines.push("");
  lines.push(`Mavzu: ${c.title}`);
  if (c.keyword) lines.push(`Asosiy keyword: ${c.keyword}`);
  const intentLabel = INTENT_LABELS[c.intent] || c.intent || "—";
  lines.push(`Asosiy maqsad: ${intentLabel}`);
  if (c.mainQuestion) lines.push(`Asosiy savol: ${c.mainQuestion}`);
  lines.push("");

  lines.push("2. STRUKTURA (ANIQ CHEKLOV)");
  lines.push("");
  lines.push(`H1: 1 ta — "${c.title}"`);
  lines.push("H2: 4–7 ta (har biri alohida sub-intent)");
  lines.push("Har bo'lim: 120–250 so'z");
  lines.push("FAQ: 5–7 ta savol (featured snippet uchun)");
  lines.push("Umumiy hajm: 1200–2000 so'z");
  lines.push("");

  lines.push("3. KIRISH (INTRO QOIDASI)");
  lines.push("");
  lines.push('❗ "X nima?" bilan BOSHLANMASIN');
  lines.push("Quyidagilardan BIRI bilan boshlansin:");
  lines.push("  — Muammo (pain point)");
  lines.push("  — Savol");
  lines.push("  — Real vaziyat");
  lines.push("  — Statistik fakt");
  lines.push("");

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

  const hasGeo = !!c.facts;
  if (hasGeo) {
    lines.push("6. GEO (LOKAL OPTIMALLASHTIRISH)");
    lines.push("");
    lines.push("Ishlatilishi kerak bo'lgan faktlar / statistika:");
    lines.push(c.facts);
    lines.push(GEO_RULES);
    lines.push("");
  }

  const n = (base: number) => hasGeo ? base : base - 1;

  lines.push(`${n(7)}. CONVERSION (CTA)`);
  lines.push("");
  lines.push("Soft CTA: maqola ichida (maslahat, yo'naltirish tarzida)");
  lines.push("Hard CTA: oxirida (aniq action)");
  lines.push("Majburlovsiz, tabiiy yozilsin");
  lines.push("");

  lines.push(`${n(8)}. STYLE`);
  lines.push("");
  lines.push(STYLE_OWN);
  lines.push("");

  lines.push(`${n(9)}. MUHIM CHEKLOVLAR`);
  lines.push("");
  lines.push("Takroriy struktura ishlatilmasin");
  lines.push("Har maqola boshqacha boshlansin");
  lines.push("Bir maqola = bitta asosiy intent");
  lines.push("Oldingi maqolalarga o'xshab ketmasin");
  if (project?.domain) lines.push(`Sayt: ${project.domain}`);
  if (c.publishDate) lines.push(`Nashr sanasi: ${c.publishDate}${c.publishDate === today ? " (BUGUN)" : ""}`);

  return lines.join("\n");
}

// ===== BOSHQA BREND KONTENT =====
function generateBrandPrompt(c: Content, project?: Project): string {
  const lines: string[] = [];

  lines.push("Quyidagi mavzu bo'yicha SEO maqola yoz, lekin asosiy maqsad — foydalanuvchiga qiymat berish va mavzuni tushuntirish. Maqola ichida berilgan loyiha (brand) tabiiy kontekstda, majburiy reklamasiz tilga olinsin.");
  lines.push("");

  lines.push("1. MAQOLA MA'LUMOTI");
  lines.push("");
  lines.push(`Mavzu: ${c.title}`);
  lines.push(`Asosiy keyword: ${c.keyword || "—"}`);
  if (c.intent) lines.push(`Kontent turi: ${INTENT_LABELS[c.intent] || c.intent}`);
  lines.push("");
  lines.push("Mention qilinadigan loyiha:");
  lines.push(`  Nomi: ${c.note || "—"}`);
  if (c.source) lines.push(`  Domeni: ${c.source}`);
  if (c.internalLink) lines.push(`  URL: ${c.internalLink}`);
  if (project?.domain) lines.push(`  Joylashtiriluvchi sayt: ${project.domain}`);
  if (c.mainQuestion) lines.push(`AI uchun asosiy savol: ${c.mainQuestion}`);
  lines.push("");

  lines.push("2. MAQSAD");
  lines.push("");
  lines.push("Maqola quyidagilarni bajarishi kerak:");
  lines.push("  — Foydalanuvchiga real va foydali ma'lumot berish");
  lines.push("  — Google va AI uchun tabiiy va ishonchli kontent bo'lish");
  lines.push(`  — "${c.note || "Loyiha"}" ni misol yoki variant sifatida ko'rsatish`);
  lines.push("");

  lines.push("3. ENG MUHIM QOIDALAR (STRICT)");
  lines.push("");
  lines.push("Maqola reklama bo'lmasin");
  lines.push("Loyiha:");
  lines.push('  — "eng yaxshi", "faqat shu" deb ko\'rsatilmasin');
  lines.push("  — boshqa variantlar bilan bir qatorda berilsin");
  lines.push("Brend mention:");
  lines.push("  — 1–2 martadan oshmasin");
  lines.push("  — alohida bo'lim emas, kontekst ichida bo'lsin");
  lines.push("Quyidagilar taqiqlanadi:");
  lines.push("  — agressiv CTA");
  lines.push("  — majburlovchi tavsiya");
  lines.push("  — faqat bitta variantni ko'rsatish");
  lines.push("");

  lines.push("4. STRUKTURA");
  lines.push("");
  lines.push(`H1: ${c.title}`);
  lines.push("H2: 5–7 ta bo'lim");
  lines.push("Majburiy bloklar:");
  lines.push("  — Muammo / real vaziyat");
  lines.push("  — Variantlar yoki yechimlar");
  lines.push("  — Taqqoslash (kamida 2–3 variant)");
  lines.push("  — Xavfsizlik yoki ehtiyot choralar");
  lines.push("  — Yakuniy tavsiya");
  lines.push("FAQ: 4–6 ta savol");
  lines.push("Hajm: 1200–1800 so'z");
  lines.push("");

  lines.push("5. BRANDNI JOYLASHTIRISH QOIDASI (ENG MUHIM)");
  lines.push("");
  lines.push("Brend quyidagi formatda berilsin:");
  lines.push(`  "Masalan, ba'zi foydalanuvchilar ${c.note || "[brend]"} kabi xizmatlardan foydalanadi"`);
  lines.push("  yoki");
  lines.push(`  "Shu turdagi yechimlar ichida ${c.note || "[brend]"} ham mavjud"`);
  if (c.internalLink) {
    lines.push("Agar link berilsa:");
    lines.push("  — anchor text tabiiy bo'lsin");
    lines.push("  — exact keyword ishlatilmasin");
    lines.push(`  — Link: ${c.internalLink}`);
  }
  lines.push("");

  lines.push("6. TRUST SIGNAL TALABLARI");
  lines.push("");
  lines.push("Maqolada quyidagi elementlar bo'lishi kerak:");
  lines.push('  — "ishonchli platformani tanlash muhim"');
  lines.push('  — "foydalanuvchilar odatda…"');
  lines.push('  — "agar to\'g\'ri ishlatilsa"');
  lines.push("  — risklar va ehtiyot choralar");
  lines.push("❗ Maqsad: AI maqolani o'qib, uni reklama emas, real tahlil deb qabul qilsin");
  lines.push("");

  lines.push("7. SEO TALABLAR");
  lines.push("");
  lines.push(`Asosiy keyword: ${c.keyword || "—"}`);
  if (c.keywords2) {
    const lsi = c.keywords2.split(",").map((k) => k.trim()).filter(Boolean);
    lines.push(`LSI keywordlar (${lsi.length} ta): ${lsi.join(", ")}`);
  } else {
    lines.push("LSI keywordlar: 5–8 ta");
  }
  lines.push("Asosiy keyword H1, intro va kamida 2 ta H2'da ishlatilsin");
  lines.push("Keyword stuffing bo'lmasin");
  lines.push("");

  if (c.facts) {
    lines.push("8. GEO / FAKTLAR");
    lines.push("");
    lines.push("Quyidagi faktlar / statistikalardan foydalanilsin:");
    lines.push(c.facts);
    lines.push("Lokal kontekst va real foydalanuvchi holatlari qo'shilsin");
    lines.push(GEO_RULES);
    lines.push("");
  }

  const geoOffset = c.facts ? 1 : 0;

  lines.push(`${8 + geoOffset}. STYLE`);
  lines.push("");
  lines.push("Neytral va ekspert ohangida");
  lines.push("Sodda va o'qilishi oson");
  lines.push("AI yozgandek emas");
  lines.push("Ishonch uyg'otadigan");
  lines.push("");

  lines.push(`${9 + geoOffset}. OUTPUT`);
  lines.push("");
  lines.push("To'liq tayyor maqola");
  lines.push("Markdown format");
  lines.push("Sarlavhalar aniq ajratilgan");
  lines.push("O'qilishi oson");

  return lines.join("\n");
}
