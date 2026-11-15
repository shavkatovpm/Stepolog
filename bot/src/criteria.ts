import { AUDIENCE } from "./audience.ts";

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

// ---------- 2-qavat: yo'nalish va sub-yo'nalishlar ----------
// Har yangilik bitta sub-yo'nalishga ajratiladi. User o'zi tanlagan sub-yo'nalishlar bo'yicha xabar oladi.
export type Sub = { id: string; name: string; desc: string };

export const FIELD_SUBS: Record<string, Sub[]> = {
  marketing: [
    { id: "smm", name: "SMM va ijtimoiy tarmoqlar", desc: "Instagram, Telegram, TikTok, YouTube, Facebook, Threads: yangi funksiyalar, algoritmlar, kontent formatlari, auditoriya raqamlari" },
    { id: "target", name: "Target va reklama", desc: "Meta Ads, Google Ads, TikTok Ads, Yandex Direct kabinetlari: yangi vositalar, reklama qoidalari, moderatsiya, narxlar" },
    { id: "seo", name: "SEO va GEO", desc: "Google qidiruvi, AI qidiruv (AI Overviews, ChatGPT qidiruvi), sayt trafigi, veb analitika" },
    { id: "brand", name: "Brend va kampaniyalar", desc: "brend strategiyasi, taniqli kampaniyalar, rebrending, muvaffaqiyatli va muvaffaqiyatsiz keyslar" },
    { id: "ai", name: "Marketingda AI", desc: "reklama va kontent tayyorlashdagi AI vositalari, chatbotlar va AI agentlarning marketingga ta'siri" },
    { id: "ecom", name: "E-commerce va marketpleyslar", desc: "onlayn savdo, marketpleyslar (Uzum, Wildberries, Ozon, Yandex Market), xaridor xulqi" },
    { id: "content", name: "Kontent va kopirayting", desc: "matn, video va vizual kontent, storytelling, kontent strategiyasi" },
  ],
};
export const subName = (id: string) => Object.values(FIELD_SUBS).flat().find((s) => s.id === id)?.name ?? id;

// Post yozuvchi uchun: shu soha o'quvchilari va atamalari
export const FIELD_AUDIENCE: Record<string, string> = {
  marketing: `Soha: marketing. O'quvchilar: ${AUDIENCE.market} bozoridagi marketologlar, SMM mutaxassislari, targetologlar, tadbirkorlar.
Atamalar aslidagidek: Google Ads, Meta, Instagram, TikTok, Reels, CTR, CPM, ROAS.`,
};

export const FIELD_RULES: Record<string, string> = {
  marketing: `
Soha: marketing. O'quvchilar: ${AUDIENCE.market} bozoridagi marketologlar, SMM mutaxassislari, targetologlar, tadbirkorlar.
${AUDIENCE.platforms}

Maqsad: duch kelgan yangilik emas, faqat o'quvchining ishiga aniq foyda beradigan yangilik.

"sub": maqola qaysi sub-yo'nalishga eng to'g'ri keladi (bitta). Hech biriga aniq mos kelmasa "other".
{SUBS}

"uz_fit": bu yangilikdagi platforma, vosita yoki bozor ${AUDIENCE.market}da mavjud va ishlatiladimi.
Masalan, AQSh televizori (CTV), AQSh do'konlari, Twitch, faqat AQShda ishlaydigan funksiya: false.
Global platformalar (Instagram, Google, Meta, TikTok, YouTube, Telegram, ChatGPT) va umumiy brend saboqlari: true.

"hype": bu mavzu hozir aynan SHU SOHADA qizg'in muhokama qilinyaptimi (soha OAV va mutaxassislari gapirmoqda).
Shaxsiy hayot, janjal, sensatsiya, sohaga aloqasi yo'q mashhur voqealar hayp emas: false.
Oddiy yangilik hayp emas. true faqat haqiqatan ham katta, hamma gapirayotgan voqea uchun.

"score" (1-10) foyda testi: o'sha SUB-YO'NALISH mutaxassisi nuqtai nazaridan baholang
(SEO yangiligini SEO mutaxassisi, target yangiligini targetolog, brend keysini brend menejeri baholagandek):
- 9-10: ${AUDIENCE.market} bozoridagi shu soha mutaxassisi shu hafta ishida qo'llaydi yoki bilmasa zarar ko'radi.
- 7-8: aniq foydali, uning ishiga bevosita tegishli, lekin shoshilinch emas.
- 5-6: qiziq, lekin amaliy foydasi kam.
- 1-4: umumiy gap, faqat boshqa bozorga tegishli, uzoq kelajak haqida, yoki o'quvchi hech narsa qilmaydi.
Shu bozorda ishlamaydigan platformalar haqidagi yangiliklar: 1-2.
"10 ta maslahat" tipidagi maqolalar, izohlovchi maqolalar ("nima bu"), kadrlar almashuvi, moliyaviy hisobotlar: 1-3.
`.trim(),
};

export function fieldPrompt(field: string) {
  const subs = FIELD_SUBS[field].map((c) => `- ${c.id}: ${c.name}, ${c.desc}`).join("\n");
  return FIELD_RULES[field].replace("{SUBS}", subs);
}

// Yo'nalish qoidasi: bozorga mos bo'lishi va sub-yo'nalishi aniq bo'lishi shart.
// Hayp (sohada hamma gapirayotgan mavzu) sub-yo'nalishi bo'lsa, ball 7 dan kam bo'lmaydi.
export function fieldCheck(field: string, sub: string, hype: boolean, score: number, uzFit: boolean): { score: number; reject: string | null } {
  if (!uzFit) return { score: 0, reject: "bozorga mos emas" };
  if (!FIELD_SUBS[field].some((c) => c.id === sub)) return { score: 0, reject: "sub-yo'nalishi yo'q" };
  if (hype && score >= 5) return { score: Math.max(score, 7), reject: null };
  return { score, reject: null };
}
