import type { LearnCategory } from "./index";

export const learnCategories: LearnCategory[] = [
  { slug: "startup-nima", number: "01", title: "Startup nima va mindset", description: "Startup va oddiy biznes farqi, founder fikrlash tarzi", topics: ["Startup vs oddiy biznes", "Nega startup qiladi odamlar", "Founder fikrlash tarzi"] },
  { slug: "goya-topish", number: "02", title: "G'oya topish", description: "Idea validation — g'oyani tekshirish va muammo asosida fikrlash", topics: ["Qanday g'oya topiladi", "Muammo asosida fikrlash", "\"Yaxshi g'oya\" nima?"] },
  { slug: "bozor-tushunish", number: "03", title: "Bozorni tushunish", description: "Market research — target audience, TAM/SAM/SOM, raqobatchilar", topics: ["Target audience", "TAM / SAM / SOM", "Raqobatchilar tahlili"] },
  { slug: "mvp", number: "04", title: "MVP", description: "Minimum Viable Product — tez ishga tushirish va overbuild xatolaridan qochish", topics: ["MVP nima", "Qanday tez ishga tushirish", "Overbuild xatolari"] },
  { slug: "product-market-fit", number: "05", title: "Product-market fit", description: "Mahsulot bozorga mos kelayotganini aniqlash va feedback loop", topics: ["PMF nima", "Qanday bilamiz \"product ishlayapti\"", "Feedback loop"] },
  { slug: "monetizatsiya", number: "06", title: "Monetizatsiya va biznes model", description: "Daromad modeli, pricing strategiya va unit economics", topics: ["Qanday pul ishlaydi", "Pricing strategiya", "Unit economics"] },
  { slug: "marketing", number: "07", title: "Marketing va growth", description: "0 dan foydalanuvchi olish, organic vs paid, growth hacklar", topics: ["0 dan user olish", "Organic vs paid", "Growth hacklar"] },
  { slug: "texnologiya", number: "08", title: "Texnologiya va product qurish", description: "Tech stack tanlash, scalability va MVP vs production", topics: ["Tech stack tanlash", "Scalability", "MVP vs production"] },
  { slug: "scaling", number: "09", title: "Scaling va investitsiya", description: "Startupni kengaytirish, investorlar bilan ishlash va exit strategiyalar", topics: ["Startupni kengaytirish", "Investorlar", "Exit strategiyalar"] },
];
