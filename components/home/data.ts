// Tilga bog'liq bo'lmagan qiymatlar. Matnlar: ./i18n
export const BOT = "https://t.me/stepologbot";
export const Y = "#FFDE59";

// Narxlar namunaviy (so'm)
export const MONTHLY = 49000;
export const prices = [
  { id: 1, months: 1, save: 0 },
  { id: 3, months: 3, save: 5 },
  { id: 6, months: 6, save: 10 },
  { id: 12, months: 12, save: 15 },
].map((p) => ({ ...p, total: Math.round((MONTHLY * p.months * (100 - p.save)) / 100) }));

export const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// Bento blok uslubi (hero)
export const tile = "rounded-2xl border border-white/[0.08] bg-[#222]";
