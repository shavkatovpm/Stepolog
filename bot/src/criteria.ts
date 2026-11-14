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

// ---------- 2-qavat: soha mezonlari ----------
// Har soha uchun: qabul qilinadigan yangilik turlari (egasi tanlagan) va ball qoidasi.
// AI har maqolaga "category" beradi; ro'yxatda yo'q tur rad etiladi (hayp mavzu bundan mustasno).
export type Category = { id: string; name: string; desc: string };

export const FIELD_CATEGORIES: Record<string, Category[]> = {
  marketing: [
    { id: "social_feature", name: "Ijtimoiy tarmoq funksiyasi", desc: "Instagram, Telegram, TikTok, YouTube, Facebook, Threads'dagi yangi funksiya (Reels, Stories, kanal, profil imkoniyatlari)" },
    { id: "ads_tool", name: "Reklama kabineti vositasi", desc: "Meta Ads Manager, Google Ads, TikTok Ads'dagi yangi hisobot, sozlama, nishonlash yoki boshqaruv vositasi" },
    { id: "moderation", name: "Moderatsiya va tasdiqlash", desc: "reklama yoki akkauntni tekshirish, tasdiqlash, bloklash, verifikatsiya tartibidagi o'zgarish" },
    { id: "audience", name: "Auditoriya xulqi", desc: "platforma auditoriyasi, foydalanuvchilar soni, odamlar qanday foydalanayotgani haqida yangi raqamlar" },
    { id: "content_perf", name: "Kontent samaradorligi", desc: "qaysi kontent yaxshi ishlashi haqida raqamlar va tadqiqot (format, uzunlik, vaqt)" },
    { id: "brand_campaign", name: "Katta brend kampaniyasi", desc: "taniqli brendning ko'pchilik muhokama qilayotgan kampaniyasi yoki rebrendingi" },
    { id: "small_biz_case", name: "Kichik biznes keysi", desc: "kichik biznes yoki bloger aniq usul bilan natijaga erishgani, raqamlar bilan" },
    { id: "failed_campaign", name: "Muvaffaqiyatsiz kampaniya", desc: "kampaniya yoki rebrending muvaffaqiyatsiz bo'lgani va sababi" },
    { id: "ads_ai", name: "Reklama platformasidagi AI", desc: "Meta, Google, TikTok reklamasiga qo'shilgan AI: kreativ tayyorlash, avtomatik kampaniya" },
    { id: "chatbot_search", name: "Chatbot va qidiruv", desc: "ChatGPT, Gemini, Perplexity va AI qidiruvning marketingga ta'siri: reklama, brend ko'rinishi, xarid" },
  ],
};

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

"category": maqola quyidagi turlardan qaysi biriga to'liq mos keladi. Hech biriga aniq mos kelmasa "other".
{CATEGORIES}

"hype": bu mavzu hozir butun sohada qizg'in muhokama qilinyaptimi (ko'p OAV yozmoqda, mutaxassislar gapirmoqda).
Oddiy yangilik hayp emas. true faqat haqiqatan ham katta, hamma gapirayotgan voqea uchun.

"score" (1-10) foyda testi:
- 9-10: ${AUDIENCE.market} bozoridagi marketolog shu hafta ishida qo'llaydi yoki bilmasa zarar ko'radi (pul, qamrov, akkaunt).
- 7-8: aniq foydali, ishiga bevosita tegishli, lekin shoshilinch emas.
- 5-6: qiziq, lekin amaliy foydasi kam.
- 1-4: umumiy gap, faqat boshqa bozorga tegishli, uzoq kelajak haqida, yoki o'quvchi hech narsa qilmaydi.
Shu bozorda ishlamaydigan platformalar haqidagi yangiliklar: 1-2.
"10 ta maslahat" tipidagi maqolalar, izohlovchi maqolalar ("nima bu"), kadrlar almashuvi, moliyaviy hisobotlar: 1-3.
`.trim(),
};

export function fieldPrompt(field: string) {
  const cats = FIELD_CATEGORIES[field].map((c) => `- ${c.id}: ${c.name}, ${c.desc}`).join("\n");
  return FIELD_RULES[field].replace("{CATEGORIES}", cats);
}

// Soha qoidasi: tur ro'yxatda bo'lishi shart, hayp mavzu esa turidan qat'i nazar o'tadi
export function fieldCheck(field: string, category: string, hype: boolean, score: number): { score: number; reject: string | null } {
  const allowed = FIELD_CATEGORIES[field].some((c) => c.id === category);
  if (hype) return { score: Math.max(score, 7), reject: null };
  if (!allowed) return { score: 0, reject: "kerakli tur emas" };
  return { score, reject: null };
}
