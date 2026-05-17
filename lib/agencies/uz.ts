import type { Agency, CategoryMeta } from "./index";

export const categories: CategoryMeta[] = [
  {
    slug: "smm",
    title: "SMM va Digital Marketing agentliklari",
    shortTitle: "SMM",
    description: "Ijtimoiy tarmoqlarni boshqarish va raqamli marketing",
    longDescription:
      "O'zbekistondagi eng yaxshi SMM va raqamli marketing agentliklari. Instagram, Telegram, TikTok va Facebook boshqaruvi, kontent strategiyasi, maqsadli reklama va brending xizmatlari. Saralangan jamoalar — har biri haqida portfel, mijoz sharhi va aloqa ma'lumotlari.",
    faq: [
      {
        question: "SMM agentligi qancha turadi?",
        answer:
          "O'zbekistonda SMM xizmatlari oylik 3 mln so'mdan boshlanadi. To'liq paket (kontent + reklama + dizayn) odatda 7-20 mln so'm oralig'ida.",
      },
      {
        question: "Qaysi paramertrlar bo'yicha agentlik tanlash kerak?",
        answer:
          "Portfolio (real keyslar), mijoz sharhi, jamoa hajmi, ish tajribasi, hisobot tizimi va aloqa tezligi — asosiy 6 ta mezon.",
      },
      {
        question: "Shartnoma minimal qancha vaqtga tuziladi?",
        answer:
          "Aksariyat agentliklar minimal 3 oylik shartnoma bilan ishlaydi — SMMda natija birinchi 1-2 oyda ko'rinmaydi.",
      },
    ],
  },
  {
    slug: "it",
    title: "IT va Dasturlash agentliklari",
    shortTitle: "IT",
    description: "Veb-saytlar, mobil ilovalar va AI yechimlari",
    longDescription:
      "O'zbekistondagi yetakchi IT-agentliklar va dasturlash kompaniyalari. Veb-saytlar, mobil ilovalar, MVP, AI integratsiya, korporativ tizimlar va custom dasturiy yechimlar. Jamoa hajmi, texnologiya stek va loyihalar portfeli bilan tanishtirilgan.",
    faq: [
      {
        question: "Veb-sayt yaratish qancha turadi?",
        answer:
          "Landing page — 5-15 mln so'm, korporativ sayt — 15-50 mln so'm, custom platform — 80 mln so'mdan boshlab. Murakkablik va texnologiyaga qarab.",
      },
      {
        question: "Mobil ilova nechta oyda tayyor bo'ladi?",
        answer:
          "Oddiy MVP — 2-3 oy, o'rta murakkablikdagi ilova — 4-6 oy, katta platforma — 8-12 oy va undan ko'p.",
      },
      {
        question: "Outstaff yoki to'liq agentlik — qaysi yaxshiroq?",
        answer:
          "Aniq texnik tashqi vazifa uchun — outstaff arzon. Loyihaning to'liq mas'uliyatini kimdir olishi kerak bo'lsa — agentlik tanlang.",
      },
    ],
  },
  {
    slug: "dizayn",
    title: "Dizayn studiyalari",
    shortTitle: "Dizayn",
    description: "UI/UX, brending va motion dizayn",
    longDescription:
      "O'zbekistondagi professional dizayn studiyalari. UI/UX dizayn, logo va brending, motion grafika, illyustratsiya, mahsulot dizayni va dizayn-tizimlari. Portfolio asosida tanlash mumkin.",
    faq: [
      {
        question: "Logo va brending qancha turadi?",
        answer:
          "Logo — 2-8 mln so'm, to'liq brending kitobi (logotip, ranglar, tipografika, brand-guideline) — 10-40 mln so'm.",
      },
      {
        question: "UI/UX dizayn loyihasi qancha vaqt oladi?",
        answer:
          "Veb-sayt dizayni — 2-4 hafta, mobil ilova — 3-6 hafta, kompleks platforma — 2-3 oy.",
      },
    ],
  },
  {
    slug: "biznes",
    title: "Biznes xizmatlar",
    shortTitle: "Biznes",
    description: "Buxgalteriya, yuridik xizmat va HR konsalting",
    longDescription:
      "O'zbekistonda biznesni boshlash va yuritish uchun professional xizmatlar — buxgalteriya, soliq, yuridik maslahat, ish hujjatlari, HR konsalting va aksiya tashkil etish. Kichik va o'rta biznes uchun ishonchli sheriklar.",
    faq: [
      {
        question: "Autsorsing buxgalter qancha turadi?",
        answer:
          "YaIB uchun — 1-2 mln so'm/oy, MChJ uchun — 2-5 mln so'm/oy. Operatsiyalar soni va murakkablikka qarab.",
      },
      {
        question: "Yuridik xizmat shartnomasi nima o'z ichiga oladi?",
        answer:
          "Hujjatlar tahriri, sud vakilligi, korporativ maslahat, IT/IP huquqi. Aniq paketni agentlik bilan kelishish kerak.",
      },
    ],
  },
];

export const agencies: Agency[] = [
  // SMM
  {
    slug: "marketolog-uz",
    name: "Marketolog.uz",
    slogan: "Ijtimoiy tarmoqlarda raqamlar bilan o'sish",
    about:
      "Marketolog.uz — Toshkentdagi yetakchi SMM agentligi. 6 yillik tajribaga ega jamoa Instagram, Telegram va TikTok platformalarida 200+ brendni rivojlantirdi. Faqat o'lchanadigan natijalar bilan ishlaymiz.",
    categories: ["smm"],
    primaryCategory: "smm",
    city: "Toshkent",
    founded: 2019,
    teamSize: "15-30",
    services: [
      "SMM strategiyasi",
      "Kontent yaratish",
      "Maqsadli reklama",
      "Influencer marketing",
      "Telegram boshqaruvi",
      "Analitika va hisobot",
    ],
    projectsCount: 220,
    rating: 4.9,
    reviewsCount: 47,
    verified: true,
    contacts: {
      website: "https://marketolog.uz",
      telegram: "@marketolog_uz",
      phone: "+998 71 200 00 00",
      instagram: "@marketolog.uz",
    },
    portfolio: [
      {
        title: "Korzinka.uz — Instagram qayta tiklash",
        description: "Engagement +340% 6 oy ichida, follower 80K dan 240K gacha.",
      },
      {
        title: "Click.uz — TikTok kampaniyasi",
        description: "1.2 mln tomosha, 4.2K yangi mijoz, ROAS 6.8x.",
      },
      {
        title: "Hayat Hotel — Telegram + kontent",
        description: "Premium kontent strategiyasi, bron 35% o'sdi.",
      },
    ],
    reviews: [
      {
        rating: 5,
        text: "Hisobotlar shaffof, jamoa professional. 4 oy ichida sotuv 2x ga oshdi.",
        author: "Sherzod K., Korzinka.uz",
      },
      {
        rating: 5,
        text: "Ijodiy yondashuv va deadline'ga sodiqlik. Tavsiya qilaman.",
        author: "Madina A., Hayat Hotel",
      },
      {
        rating: 4,
        text: "Yaxshi natija. Faqat reklama byudjeti masalasida ko'proq tushuntirish kerak edi.",
        author: "Akmal R.",
      },
    ],
    faq: [
      {
        question: "Minimal byudjet qancha?",
        answer: "Oylik 5 mln so'mdan boshlanadi. Reklama byudjeti alohida.",
      },
      {
        question: "Shartnoma necha oyga tuziladi?",
        answer: "Minimal 3 oy — natija birinchi oyda ko'rinmaydi.",
      },
    ],
    budgetRange: "5-25 mln so'm/oy",
  },
  {
    slug: "smmstudio",
    name: "SMM Studio",
    slogan: "Kichik biznes uchun katta natijalar",
    about:
      "SMM Studio — kichik va o'rta biznes uchun maxsus ishlab chiqilgan paketlar bilan ishlaydigan agentlik. 5 kishilik kichik, ammo tajribali jamoa. Asosiy fokus: oziq-ovqat, beauty va xizmat ko'rsatish sohalari.",
    categories: ["smm"],
    primaryCategory: "smm",
    city: "Toshkent",
    founded: 2021,
    teamSize: "5-10",
    services: [
      "Instagram boshqaruvi",
      "Targetli reklama",
      "Kontent rejasi",
      "Story va Reels",
    ],
    projectsCount: 85,
    rating: 4.7,
    reviewsCount: 31,
    verified: true,
    contacts: {
      telegram: "@smmstudio_uz",
      phone: "+998 90 123 45 67",
      instagram: "@smmstudio.uz",
    },
    portfolio: [
      {
        title: "Bon Coffee — Instagram",
        description: "8 oy ichida 12K dan 56K gacha follower, 200+ mijoz kuniga.",
      },
      {
        title: "Beauty Lab — Targetli reklama",
        description: "ROAS 5.4x, reklamaga 1 mln so'm — 5.4 mln sotuv.",
      },
    ],
    reviews: [
      {
        rating: 5,
        text: "Kichik biznes uchun ideal — paketlar tushunarli, narx adolatli.",
        author: "Dilshod, Bon Coffee",
      },
      {
        rating: 4,
        text: "Yaxshi jamoa, javob tezligi yaxshilanishi kerak.",
        author: "Nodira",
      },
    ],
    faq: [
      {
        question: "Eng arzon paket qaysi?",
        answer: "Start paket — 3 mln so'm/oy. 12 ta post + 20 ta story + 1 ta Reels.",
      },
    ],
    budgetRange: "3-12 mln so'm/oy",
  },
  {
    slug: "brandboost",
    name: "BrandBoost Agency",
    slogan: "Brendingdan to'liq raqamli ekotizimgacha",
    about:
      "BrandBoost — premium segmentdagi mijozlar bilan ishlaydigan to'liq xizmat agentligi. Brending, SMM va kreativ kampaniyalar — bir joyda. Bank, telekom va premium retail bilan ishlash tajribasi.",
    categories: ["smm", "dizayn"],
    primaryCategory: "smm",
    city: "Toshkent",
    founded: 2018,
    teamSize: "30-50",
    services: [
      "360° kampaniyalar",
      "Brending strategiyasi",
      "SMM va kontent",
      "Video produksiya",
      "Influencer marketing",
      "PR va event marketing",
    ],
    projectsCount: 140,
    rating: 4.8,
    reviewsCount: 38,
    verified: true,
    contacts: {
      website: "https://brandboost.uz",
      telegram: "@brandboost_uz",
      phone: "+998 71 150 00 00",
      instagram: "@brandboost.uz",
      email: "hello@brandboost.uz",
    },
    portfolio: [
      {
        title: "Uzcard — yangi kampaniya",
        description: "Kreativ konsept va to'liq media-prodakshn.",
      },
      {
        title: "Beeline — Z-avlod kampaniyasi",
        description: "TikTok va Instagramdagi 15+ mln tomosha.",
      },
    ],
    reviews: [
      {
        rating: 5,
        text: "Premium darajadagi xizmat, strategik yondashuv. Korporativ mijozlarga tavsiya.",
        author: "Aziz H., Uzcard",
      },
    ],
    faq: [
      {
        question: "Faqat katta biznes bilan ishlaysizmi?",
        answer: "Asosan o'rta va katta. Minimal loyiha byudjeti — 30 mln so'm.",
      },
    ],
    budgetRange: "30-200 mln so'm/loyiha",
  },
  {
    slug: "reach-digital",
    name: "Reach Digital",
    slogan: "Ma'lumotlarga asoslangan raqamli marketing",
    about:
      "Reach Digital — analitika va atributsiyaga asoslangan agentlik. Google Ads, Facebook Ads, YouTube va dasturiy reklama. Mijoz uchun har bir so'm — ROAS bilan o'lchanadi.",
    categories: ["smm"],
    primaryCategory: "smm",
    city: "Toshkent",
    founded: 2020,
    teamSize: "10-15",
    services: [
      "Google Ads",
      "Meta Ads (Facebook/Instagram)",
      "YouTube reklama",
      "Atributsiya va analitika",
      "E-commerce marketing",
      "Lead generation",
    ],
    projectsCount: 95,
    rating: 4.8,
    reviewsCount: 28,
    verified: true,
    contacts: {
      website: "https://reachdigital.uz",
      telegram: "@reachdigital",
      phone: "+998 71 300 00 00",
    },
    portfolio: [
      {
        title: "Online shop — Google Ads",
        description: "ROAS 8.2x, 6 oy ichida sotuv 4x ga oshdi.",
      },
      {
        title: "EduTech — Lead generation",
        description: "Lead narxi $12 dan $4 gacha tushdi.",
      },
    ],
    reviews: [
      {
        rating: 5,
        text: "Raqamlar bilan ishlaydi, har dollarni hisobotda ko'rasan.",
        author: "Bahodir M.",
      },
    ],
    faq: [
      {
        question: "Faqat reklama qilasizmi?",
        answer: "Asosan ha — performance marketingga ixtisoslashganmiz.",
      },
    ],
    budgetRange: "8-50 mln so'm/oy",
  },
  // IT
  {
    slug: "exoft-uz",
    name: "Exoft",
    slogan: "Custom dasturlash va MVP yechimlari",
    about:
      "Exoft — veb va mobil dasturlash agentligi. SaaS, marketplace va EdTech yechimlari. React, Next.js, Node.js, Flutter stekida ishlaymiz. 2020 yildan beri 60+ loyihaga ega.",
    categories: ["it"],
    primaryCategory: "it",
    city: "Toshkent",
    founded: 2020,
    teamSize: "15-30",
    services: [
      "Veb-saytlar (Next.js, React)",
      "Mobil ilovalar (Flutter)",
      "MVP ishlab chiqish",
      "AI integratsiya",
      "API va backend",
      "DevOps va deployment",
    ],
    projectsCount: 62,
    rating: 4.8,
    reviewsCount: 22,
    verified: true,
    contacts: {
      website: "https://exoft.uz",
      telegram: "@exoft_uz",
      email: "hi@exoft.uz",
    },
    portfolio: [
      {
        title: "EduPlatform — onlayn ta'lim SaaS",
        description: "Next.js + Node.js, 8 oyda yetkazib berilgan, 30K foydalanuvchi.",
      },
      {
        title: "Marketplace MVP",
        description: "B2B savdo platformasi, 3 oyda ishga tushgan.",
      },
    ],
    reviews: [
      {
        rating: 5,
        text: "Deadline'ga sodiq, kod sifati yuqori. Texnik maslahatda kuchli.",
        author: "Sardor N.",
      },
    ],
    faq: [
      {
        question: "Kichik loyihalar ham qiladimi?",
        answer: "Ha, landing pagedan boshlab katta SaaS platformalargacha.",
      },
    ],
    budgetRange: "20-300 mln so'm/loyiha",
  },
  {
    slug: "innovate-it",
    name: "Innovate IT",
    slogan: "Korporativ tizimlar va integratsiya",
    about:
      "Innovate IT — yirik biznes uchun korporativ dasturiy yechimlar. ERP, CRM, 1C integratsiya, ichki avtomatlashtirish. 8 yillik tajriba, davlat va xususiy sektor mijozlari.",
    categories: ["it"],
    primaryCategory: "it",
    city: "Toshkent",
    founded: 2017,
    teamSize: "30-50",
    services: [
      "ERP/CRM tizimlari",
      "1C integratsiya",
      "Korporativ portallar",
      "API integratsiya",
      "Bulutli yechimlar",
      "Texnik audit",
    ],
    projectsCount: 80,
    rating: 4.6,
    reviewsCount: 18,
    verified: true,
    contacts: {
      website: "https://innovate.uz",
      phone: "+998 71 100 00 00",
      email: "info@innovate.uz",
    },
    portfolio: [
      {
        title: "Bank korporativ portali",
        description: "Ichki HR va hujjat aylanish tizimi.",
      },
    ],
    reviews: [
      {
        rating: 5,
        text: "Murakkab integratsiyani uddalaydi, professional jamoa.",
        author: "M.A., yirik bank",
      },
    ],
    faq: [
      {
        question: "Faqat katta biznes?",
        answer: "Asosan korporativ mijozlar. Minimal loyiha — 50 mln so'm.",
      },
    ],
    budgetRange: "50-500 mln so'm/loyiha",
  },
  // Dizayn
  {
    slug: "studio-novvat",
    name: "Studio Novvat",
    slogan: "Brending va vizual identitet",
    about:
      "Studio Novvat — brending va dizayn studiyasi. Logo, brand-book, qadoqlash, identika va dizayn-tizimlari. Premium yondashuv, har bir loyihaga individual.",
    categories: ["dizayn"],
    primaryCategory: "dizayn",
    city: "Toshkent",
    founded: 2019,
    teamSize: "5-10",
    services: [
      "Logo va brending",
      "Brand-book",
      "Qadoqlash dizayni",
      "UI/UX dizayn",
      "Illustratsiya",
      "Motion grafika",
    ],
    projectsCount: 70,
    rating: 4.9,
    reviewsCount: 24,
    verified: true,
    contacts: {
      website: "https://novvat.studio",
      instagram: "@studio.novvat",
      telegram: "@novvat",
    },
    portfolio: [
      {
        title: "Premium oziq-ovqat brendi",
        description: "Logo + qadoq dizayn, 12 SKU.",
      },
      {
        title: "Fintech app — UI/UX",
        description: "30+ ekran, design-system bilan.",
      },
    ],
    reviews: [
      {
        rating: 5,
        text: "Vizual saviya yuqori, har bir detalga e'tibor.",
        author: "Z.R.",
      },
    ],
    faq: [
      {
        question: "Logo qancha turadi?",
        answer: "3-15 mln so'm. Brand-book bilan — 15-40 mln so'm.",
      },
    ],
    budgetRange: "3-40 mln so'm/loyiha",
  },
  // Biznes
  {
    slug: "buxgalter-pro",
    name: "Buxgalter Pro",
    slogan: "Autsorsing buxgalteriya va soliq xizmati",
    about:
      "Buxgalter Pro — kichik va o'rta biznes uchun to'liq buxgalteriya autsorsingi. YaIB, MChJ va xususiy korxonalar. Soliq optimizatsiyasi, hisobot tayyorlash, 1C tutilishi.",
    categories: ["biznes"],
    primaryCategory: "biznes",
    city: "Toshkent",
    founded: 2018,
    teamSize: "10-15",
    services: [
      "Autsorsing buxgalteriya",
      "Soliq hisobotlari",
      "1C tutilishi",
      "Kadrlar hujjatlari",
      "Soliq optimizatsiyasi",
      "Audit va maslahat",
    ],
    projectsCount: 320,
    rating: 4.7,
    reviewsCount: 65,
    verified: true,
    contacts: {
      website: "https://buxgalter.pro",
      phone: "+998 71 250 00 00",
      telegram: "@buxgalter_pro",
    },
    portfolio: [],
    reviews: [
      {
        rating: 5,
        text: "Ishonchli, hech qachon kechiktirmagan. 3 yildan beri ishlayman.",
        author: "MChJ direktori",
      },
    ],
    faq: [
      {
        question: "Eng arzon paket qancha?",
        answer: "YaIB uchun 1.2 mln so'm/oy dan boshlanadi.",
      },
    ],
    budgetRange: "1-8 mln so'm/oy",
  },
];
