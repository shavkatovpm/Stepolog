import type { Agency, CategoryMeta } from "./index";

export const categories: CategoryMeta[] = [
  {
    slug: "smm",
    title: "SMM и Digital-маркетинг агентства",
    shortTitle: "SMM",
    description: "Управление соцсетями и цифровой маркетинг",
    longDescription:
      "Лучшие SMM и digital-маркетинг агентства Узбекистана. Ведение Instagram, Telegram, TikTok и Facebook, контент-стратегия, таргетированная реклама и брендинг. Проверенные команды — портфолио, отзывы клиентов и контакты.",
    faq: [
      {
        question: "Сколько стоит SMM-агентство?",
        answer:
          "В Узбекистане SMM-услуги начинаются от 3 млн сум/мес. Полный пакет (контент + реклама + дизайн) обычно 7–20 млн сум.",
      },
      {
        question: "По каким критериям выбрать агентство?",
        answer:
          "Портфолио (реальные кейсы), отзывы клиентов, размер команды, опыт, система отчётности и скорость коммуникации — 6 основных критериев.",
      },
      {
        question: "На какой минимальный срок заключается договор?",
        answer:
          "Большинство агентств работают по договору минимум 3 месяца — в SMM результат не виден в первые 1-2 месяца.",
      },
    ],
  },
  {
    slug: "it",
    title: "IT и разработка",
    shortTitle: "IT",
    description: "Сайты, мобильные приложения и AI-решения",
    longDescription:
      "Ведущие IT-агентства и компании-разработчики Узбекистана. Сайты, мобильные приложения, MVP, AI-интеграция, корпоративные системы и кастомные программные решения.",
    faq: [
      {
        question: "Сколько стоит создание сайта?",
        answer:
          "Landing page — 5-15 млн сум, корпоративный сайт — 15-50 млн сум, custom-платформа — от 80 млн сум.",
      },
      {
        question: "За сколько делается мобильное приложение?",
        answer:
          "Простой MVP — 2-3 мес, средней сложности — 4-6 мес, крупная платформа — 8-12 мес.",
      },
      {
        question: "Аутстафф или полноценное агентство?",
        answer:
          "Для конкретной техзадачи — аутстафф дешевле. Когда нужна полная ответственность за проект — выбирайте агентство.",
      },
    ],
  },
  {
    slug: "dizayn",
    title: "Дизайн-студии",
    shortTitle: "Дизайн",
    description: "UI/UX, брендинг и motion-дизайн",
    longDescription:
      "Профессиональные дизайн-студии Узбекистана. UI/UX дизайн, логотипы и брендинг, motion-графика, иллюстрация, продуктовый дизайн и дизайн-системы.",
    faq: [
      {
        question: "Сколько стоит логотип и брендинг?",
        answer:
          "Логотип — 2-8 млн сум, полный брендбук — 10-40 млн сум.",
      },
      {
        question: "Сколько занимает UI/UX-проект?",
        answer:
          "Сайт — 2-4 недели, мобильное приложение — 3-6 недель, комплексная платформа — 2-3 месяца.",
      },
    ],
  },
  {
    slug: "biznes",
    title: "Бизнес-услуги",
    shortTitle: "Бизнес",
    description: "Бухгалтерия, юридические услуги, HR-консалтинг",
    longDescription:
      "Профессиональные услуги для запуска и ведения бизнеса в Узбекистане — бухгалтерия, налоги, юридические консультации, HR-консалтинг и организация мероприятий. Надёжные партнёры для малого и среднего бизнеса.",
    faq: [
      {
        question: "Сколько стоит аутсорс-бухгалтер?",
        answer:
          "Для ИП — 1-2 млн сум/мес, для ООО — 2-5 млн сум/мес.",
      },
      {
        question: "Что входит в юридическое сопровождение?",
        answer:
          "Подготовка документов, представительство в суде, корпоративные консультации, IT/IP право.",
      },
    ],
  },
];

export const agencies: Agency[] = [
  {
    slug: "marketolog-uz",
    name: "Marketolog.uz",
    slogan: "Рост в соцсетях, измеряемый в цифрах",
    about:
      "Marketolog.uz — ведущее SMM-агентство Ташкента. Команда с 6-летним опытом развила 200+ брендов в Instagram, Telegram и TikTok. Работаем только с измеримыми результатами.",
    categories: ["smm"],
    primaryCategory: "smm",
    city: "Ташкент",
    founded: 2019,
    teamSize: "15-30",
    services: [
      "SMM-стратегия",
      "Создание контента",
      "Таргетированная реклама",
      "Influencer-маркетинг",
      "Управление Telegram",
      "Аналитика и отчётность",
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
        title: "Korzinka.uz — перезапуск Instagram",
        description: "Engagement +340% за 6 месяцев, рост с 80K до 240K подписчиков.",
      },
      {
        title: "Click.uz — TikTok-кампания",
        description: "1.2 млн просмотров, 4.2K новых клиентов, ROAS 6.8x.",
      },
      {
        title: "Hayat Hotel — Telegram + контент",
        description: "Премиум контент-стратегия, рост броней +35%.",
      },
    ],
    reviews: [
      {
        rating: 5,
        text: "Прозрачная отчётность, профессиональная команда. За 4 месяца продажи выросли в 2 раза.",
        author: "Шерзод К., Korzinka.uz",
      },
      {
        rating: 5,
        text: "Креативный подход и соблюдение сроков. Рекомендую.",
        author: "Мадина А., Hayat Hotel",
      },
      {
        rating: 4,
        text: "Хороший результат. По бюджету рекламы можно было подробнее объяснять.",
        author: "Акмал Р.",
      },
    ],
    faq: [
      {
        question: "Какой минимальный бюджет?",
        answer: "От 5 млн сум/мес. Рекламный бюджет отдельно.",
      },
      {
        question: "На сколько месяцев заключается договор?",
        answer: "Минимум 3 месяца — в первый месяц результата не видно.",
      },
    ],
    budgetRange: "5-25 млн сум/мес",
  },
  {
    slug: "smmstudio",
    name: "SMM Studio",
    slogan: "Большие результаты для малого бизнеса",
    about:
      "SMM Studio — агентство, работающее со специальными пакетами для малого и среднего бизнеса. Команда из 5 человек, малая, но опытная. Основной фокус: food, beauty и сфера услуг.",
    categories: ["smm"],
    primaryCategory: "smm",
    city: "Ташкент",
    founded: 2021,
    teamSize: "5-10",
    services: [
      "Ведение Instagram",
      "Таргетированная реклама",
      "Контент-план",
      "Story и Reels",
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
        description: "За 8 месяцев с 12K до 56K подписчиков, 200+ клиентов в день.",
      },
      {
        title: "Beauty Lab — таргет",
        description: "ROAS 5.4x, на 1 млн сум рекламы — 5.4 млн продаж.",
      },
    ],
    reviews: [
      {
        rating: 5,
        text: "Идеально для малого бизнеса — пакеты понятные, цены справедливые.",
        author: "Дилшод, Bon Coffee",
      },
      {
        rating: 4,
        text: "Хорошая команда, скорость ответа можно улучшить.",
        author: "Нодира",
      },
    ],
    faq: [
      {
        question: "Самый дешёвый пакет?",
        answer: "Start пакет — 3 млн сум/мес. 12 постов + 20 story + 1 Reels.",
      },
    ],
    budgetRange: "3-12 млн сум/мес",
  },
  {
    slug: "brandboost",
    name: "BrandBoost Agency",
    slogan: "От брендинга до полной digital-экосистемы",
    about:
      "BrandBoost — агентство полного цикла для премиум-сегмента. Брендинг, SMM и креативные кампании — в одном месте. Опыт работы с банками, телеком-компаниями и premium retail.",
    categories: ["smm", "dizayn"],
    primaryCategory: "smm",
    city: "Ташкент",
    founded: 2018,
    teamSize: "30-50",
    services: [
      "360° кампании",
      "Стратегия брендинга",
      "SMM и контент",
      "Видеопродакшн",
      "Influencer-маркетинг",
      "PR и event-маркетинг",
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
        title: "Uzcard — новая кампания",
        description: "Креативная концепция и полный медиапродакшн.",
      },
      {
        title: "Beeline — кампания для Z-поколения",
        description: "15+ млн просмотров в TikTok и Instagram.",
      },
    ],
    reviews: [
      {
        rating: 5,
        text: "Премиум-уровень сервиса, стратегический подход. Рекомендую корпоративным клиентам.",
        author: "Азиз Х., Uzcard",
      },
    ],
    faq: [
      {
        question: "Только с крупным бизнесом?",
        answer: "В основном средний и крупный. Минимальный бюджет — 30 млн сум.",
      },
    ],
    budgetRange: "30-200 млн сум/проект",
  },
  {
    slug: "reach-digital",
    name: "Reach Digital",
    slogan: "Data-driven digital-маркетинг",
    about:
      "Reach Digital — агентство, основанное на аналитике и атрибуции. Google Ads, Facebook Ads, YouTube и programmatic. Каждый сум клиента измеряется через ROAS.",
    categories: ["smm"],
    primaryCategory: "smm",
    city: "Ташкент",
    founded: 2020,
    teamSize: "10-15",
    services: [
      "Google Ads",
      "Meta Ads (Facebook/Instagram)",
      "YouTube реклама",
      "Атрибуция и аналитика",
      "E-commerce маркетинг",
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
        description: "ROAS 8.2x, за 6 месяцев продажи выросли в 4 раза.",
      },
      {
        title: "EduTech — Lead generation",
        description: "Стоимость лида снизилась с $12 до $4.",
      },
    ],
    reviews: [
      {
        rating: 5,
        text: "Работают с цифрами, каждый доллар видно в отчётах.",
        author: "Баходир М.",
      },
    ],
    faq: [
      {
        question: "Только реклама?",
        answer: "В основном да — специализируемся на performance-маркетинге.",
      },
    ],
    budgetRange: "8-50 млн сум/мес",
  },
  {
    slug: "exoft-uz",
    name: "Exoft",
    slogan: "Кастомная разработка и MVP",
    about:
      "Exoft — агентство веб- и мобильной разработки. SaaS, marketplace и EdTech решения. Работаем на стеке React, Next.js, Node.js, Flutter. С 2020 года — 60+ проектов.",
    categories: ["it"],
    primaryCategory: "it",
    city: "Ташкент",
    founded: 2020,
    teamSize: "15-30",
    services: [
      "Сайты (Next.js, React)",
      "Мобильные приложения (Flutter)",
      "Разработка MVP",
      "AI-интеграция",
      "API и backend",
      "DevOps и deployment",
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
        title: "EduPlatform — онлайн-образование SaaS",
        description: "Next.js + Node.js, сданы за 8 месяцев, 30K пользователей.",
      },
      {
        title: "Marketplace MVP",
        description: "B2B-платформа, запущена за 3 месяца.",
      },
    ],
    reviews: [
      {
        rating: 5,
        text: "Соблюдают сроки, качество кода высокое. Сильны в техническом консалтинге.",
        author: "Сардор Н.",
      },
    ],
    faq: [
      {
        question: "Берётесь за маленькие проекты?",
        answer: "Да, от landing page до крупных SaaS-платформ.",
      },
    ],
    budgetRange: "20-300 млн сум/проект",
  },
  {
    slug: "innovate-it",
    name: "Innovate IT",
    slogan: "Корпоративные системы и интеграция",
    about:
      "Innovate IT — корпоративные программные решения для крупного бизнеса. ERP, CRM, интеграция с 1C, внутренняя автоматизация. 8 лет опыта, клиенты из госсектора и частного сектора.",
    categories: ["it"],
    primaryCategory: "it",
    city: "Ташкент",
    founded: 2017,
    teamSize: "30-50",
    services: [
      "ERP/CRM системы",
      "Интеграция 1C",
      "Корпоративные порталы",
      "API-интеграция",
      "Облачные решения",
      "Технический аудит",
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
        title: "Корпоративный портал банка",
        description: "Внутренний HR и документооборот.",
      },
    ],
    reviews: [
      {
        rating: 5,
        text: "Справляются со сложными интеграциями, профессиональная команда.",
        author: "М.А., крупный банк",
      },
    ],
    faq: [
      {
        question: "Только крупный бизнес?",
        answer: "В основном корпоративные клиенты. Минимум — 50 млн сум.",
      },
    ],
    budgetRange: "50-500 млн сум/проект",
  },
  {
    slug: "studio-novvat",
    name: "Studio Novvat",
    slogan: "Брендинг и визуальная идентичность",
    about:
      "Studio Novvat — студия брендинга и дизайна. Логотип, brand-book, упаковка, идентика и дизайн-системы. Премиум-подход, индивидуально к каждому проекту.",
    categories: ["dizayn"],
    primaryCategory: "dizayn",
    city: "Ташкент",
    founded: 2019,
    teamSize: "5-10",
    services: [
      "Логотип и брендинг",
      "Brand-book",
      "Упаковка",
      "UI/UX дизайн",
      "Иллюстрация",
      "Motion-графика",
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
        title: "Премиум food-бренд",
        description: "Логотип + дизайн упаковки, 12 SKU.",
      },
      {
        title: "Fintech app — UI/UX",
        description: "30+ экранов с дизайн-системой.",
      },
    ],
    reviews: [
      {
        rating: 5,
        text: "Высокий визуальный уровень, внимание к каждой детали.",
        author: "З.Р.",
      },
    ],
    faq: [
      {
        question: "Сколько стоит логотип?",
        answer: "3-15 млн сум. С brand-book — 15-40 млн сум.",
      },
    ],
    budgetRange: "3-40 млн сум/проект",
  },
  {
    slug: "buxgalter-pro",
    name: "Buxgalter Pro",
    slogan: "Аутсорс-бухгалтерия и налоговое сопровождение",
    about:
      "Buxgalter Pro — полная аутсорс-бухгалтерия для малого и среднего бизнеса. ИП, ООО и частные предприятия. Налоговая оптимизация, отчётность, ведение 1C.",
    categories: ["biznes"],
    primaryCategory: "biznes",
    city: "Ташкент",
    founded: 2018,
    teamSize: "10-15",
    services: [
      "Аутсорс-бухгалтерия",
      "Налоговая отчётность",
      "Ведение 1C",
      "Кадровый учёт",
      "Налоговая оптимизация",
      "Аудит и консультации",
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
        text: "Надёжные, ни разу не опаздывали. Работаю 3 года.",
        author: "Директор ООО",
      },
    ],
    faq: [
      {
        question: "Самый дешёвый пакет?",
        answer: "Для ИП от 1.2 млн сум/мес.",
      },
    ],
    budgetRange: "1-8 млн сум/мес",
  },
];
