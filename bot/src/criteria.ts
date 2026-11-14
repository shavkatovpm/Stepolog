// Saralash mezonlari: 1-qavat umumiy (har soha uchun), 2-qavat soha bo'yicha.

export type Tier = "official" | "media" | "blog";

// ---------- 1-qavat: umumiy mezonlar ----------
export const GENERAL_RULES = `
Har bir maqolani avval umumiy mezonlar bo'yicha tekshiring:

1. confirmation: yangilik qanchalik tasdiqlangan.
   - "official": kompaniyaning o'zi e'lon qilgan yoki rasmiy hujjat, rasmiy blog, matbuot xizmati keltirilgan.
   - "reported": ishonchli OAV xabar qilmoqda, lekin rasmiy e'lon keltirilmagan.
   - "rumor": "manbalarga ko'ra", "sizib chiqdi", "tez orada bo'lishi mumkin", tasdiqsiz da'vo, taxmin.
2. testing: funksiya hali test bosqichida yoki faqat ba'zi foydalanuvchilarda (true/false).
3. clickbait: sarlavha matndagi faktga mos kelmaydi yoki bo'rttirilgan (true/false).
4. opinion: bu yangilik emas, muallif fikri, kolonka, bashorat (true/false).
5. promo: homiylik maqolasi, manbaning o'z mahsuloti yoki xizmati reklamasi, vebinar va tadbir e'loni (true/false).
6. stale: voqea ancha oldin bo'lgan, maqola eski yangilikni qayta aytmoqda (true/false).
7. duplicate_of: agar bu yangilik "Avval qabul qilinganlar" ro'yxatidagi yoki shu ro'yxatda o'zidan oldin kelgan
   maqola bilan bir xil voqea bo'lsa, o'sha maqolaning id raqami. Aks holda null.
   Bir voqea bir necha manbada bo'lsa, eng to'liq va rasmiyroq manbadagisi asl, qolganlari takror.
`.trim();

// Kod tomonidagi qat'iy qoidalar: AI belgilaridan yakuniy ballni hisoblaydi
export type Flags = {
  confirmation: "official" | "reported" | "rumor";
  testing: boolean;
  clickbait: boolean;
  opinion: boolean;
  promo: boolean;
  stale: boolean;
  duplicate_of: number | null;
};

export function finalScore(base: number, f: Flags, tier: Tier): { score: number; reject: string | null } {
  if (f.promo) return { score: 0, reject: "reklama" };
  if (f.opinion) return { score: 0, reject: "fikr, yangilik emas" };
  if (f.clickbait) return { score: 0, reject: "clickbait" };
  if (f.stale) return { score: 0, reject: "eski yangilik" };
  if (f.duplicate_of) return { score: 0, reject: `takror (#${f.duplicate_of})` };
  if (f.confirmation === "rumor" && tier === "blog") return { score: 0, reject: "mish-mish, ishonchsiz manba" };

  let s = base;
  if (f.confirmation === "rumor") s -= 2;
  if (f.confirmation === "reported" && tier === "blog") s -= 1;
  if (tier === "official") s += 1;
  return { score: Math.max(1, Math.min(10, Math.round(s))), reject: null };
}

// ---------- 2-qavat: soha mezonlari ----------
export const FIELD_RULES: Record<string, string> = {
  marketing: `
Soha: marketing. O'quvchilar: O'zbekistondagi marketologlar, SMM mutaxassislari, targetologlar, tadbirkorlar.
"score" (1-10) maqola O'zbekistondagi marketolog uchun qanchalik muhim va amaliy ekanini bildiradi.

Yuqori ball (8-10): reklama platformalari va ijtimoiy tarmoqlardagi aniq o'zgarishlar
(Google Ads, Meta, Instagram, TikTok, YouTube, Telegram, Threads): yangi funksiya, algoritm o'zgarishi, qoida, narx,
reklama formati, hisobot vositasi. Marketolog ishini bugun o'zgartiradigan narsa.
O'rta (5-7): foydali tadqiqot yoki raqamlar, katta brendning ibratli kampaniyasi, marketing uchun AI vositalari.
Past (1-4): "10 ta maslahat" tipidagi umumiy maqolalar, kadrlar almashuvi, kompaniya moliyaviy hisobotlari,
faqat AQSh bozoriga tegishli mahalliy yangiliklar, SEO texnik tafsilotlari, izohlovchi maqolalar ("nima bu").
O'zbekistonda ishlamaydigan platformalar (1-3): Amazon, Walmart, eBay, Etsy, Shopify reklamalari, AQSh retail media.
`.trim(),
};
