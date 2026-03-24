export interface RoadmapStep {
  level: string;
  title: string;
  skills: string[];
  duration: string;
  salary: string;
}

export interface Career {
  slug: string;
  title: string;
  description: string;
  level: string;
  skills: string[];
  whatDoes: string[];
  companyRole: string;
  roadmap: RoadmapStep[];
}

export const careers: Career[] = [
  {
    slug: "frontend-developer",
    title: "Frontend Developer",
    description: "Veb-saytlar va ilovalarning foydalanuvchi interfeysini yaratish",
    level: "Boshlang'ich",
    skills: ["HTML/CSS", "JavaScript", "React", "Next.js"],
    whatDoes: [
      "Veb-saytlarning vizual qismini kodga aylantiradi",
      "Foydalanuvchi interfeysi (UI) ni responsive qiladi",
      "API dan ma'lumot olib, sahifada ko'rsatadi",
      "Dizayner bilan hamkorlikda ishlaydi",
    ],
    companyRole: "Engineering jamoasida — dizayn va backend o'rtasidagi ko'prik. Foydalanuvchi ko'radigan barcha narsaga javobgar.",
    roadmap: [
      { level: "Junior", title: "Junior Frontend", skills: ["HTML/CSS", "JavaScript asoslari", "Git"], duration: "0-6 oy", salary: "$300–600" },
      { level: "Middle", title: "Middle Frontend", skills: ["React/Next.js", "TypeScript", "REST API", "Testing"], duration: "6-18 oy", salary: "$600–1,200" },
      { level: "Senior", title: "Senior Frontend", skills: ["Architecture", "Performance", "CI/CD", "Mentoring"], duration: "2-4 yil", salary: "$1,200–2,500" },
      { level: "Lead", title: "Tech Lead / Architect", skills: ["System Design", "Team Management", "Strategy"], duration: "4+ yil", salary: "$2,500–4,000" },
    ],
  },
  {
    slug: "backend-developer",
    title: "Backend Developer",
    description: "Server tomoni, API va ma'lumotlar bazasi bilan ishlash",
    level: "O'rta",
    skills: ["Node.js", "Python", "PostgreSQL", "REST API"],
    whatDoes: [
      "Server tomonidagi mantiqni yozadi (API, auth, biznes logika)",
      "Ma'lumotlar bazasini loyihalaydi va boshqaradi",
      "Xavfsizlik va performance optimizatsiyasi bilan shug'ullanadi",
      "Tizim arxitekturasini ishlab chiqadi",
    ],
    companyRole: "Engineering jamoasida — tizimning ko'rinmas lekin eng muhim qismi. Barcha ma'lumotlar va biznes logikaga javobgar.",
    roadmap: [
      { level: "Junior", title: "Junior Backend", skills: ["Node.js/Python", "SQL asoslari", "REST API", "Git"], duration: "0-6 oy", salary: "$300–700" },
      { level: "Middle", title: "Middle Backend", skills: ["Database design", "Auth/Security", "Docker", "Testing"], duration: "6-18 oy", salary: "$700–1,500" },
      { level: "Senior", title: "Senior Backend", skills: ["System design", "Microservices", "Performance", "Cloud"], duration: "2-4 yil", salary: "$1,500–3,000" },
      { level: "Lead", title: "Tech Lead / Architect", skills: ["Architecture decisions", "Team leading", "DevOps"], duration: "4+ yil", salary: "$3,000–5,000" },
    ],
  },
  {
    slug: "ui-ux-designer",
    title: "UI/UX Designer",
    description: "Foydalanuvchi tajribasini loyihalash va interfeys dizayni",
    level: "Boshlang'ich",
    skills: ["Figma", "Prototyping", "User Research", "Design Systems"],
    whatDoes: [
      "Foydalanuvchi interfeyslarini dizayn qiladi (UI)",
      "Foydalanuvchi tajribasini tadqiq qiladi (UX research)",
      "Wireframe va prototiplar yaratadi",
      "Design system va komponent kutubxonasini boshqaradi",
    ],
    companyRole: "Product jamoasida — foydalanuvchi va texnologiya o'rtasidagi tarjimon. Mahsulot qanchalik qulay bo'lishiga javobgar.",
    roadmap: [
      { level: "Junior", title: "Junior Designer", skills: ["Figma asoslari", "UI fundamentals", "Typography"], duration: "0-6 oy", salary: "$250–500" },
      { level: "Middle", title: "Middle Designer", skills: ["UX Research", "Prototyping", "Design Systems", "Usability Testing"], duration: "6-18 oy", salary: "$500–1,000" },
      { level: "Senior", title: "Senior Designer", skills: ["Product Strategy", "Advanced UX", "Team Mentoring", "Data-driven Design"], duration: "2-4 yil", salary: "$1,000–2,000" },
      { level: "Lead", title: "Design Lead / Head of Design", skills: ["Design Ops", "Cross-team Collaboration", "Vision Setting"], duration: "4+ yil", salary: "$2,000–3,500" },
    ],
  },
  {
    slug: "mobile-developer",
    title: "Mobile Developer",
    description: "iOS va Android ilovalarni yaratish",
    level: "O'rta",
    skills: ["React Native", "Flutter", "Swift", "Kotlin"],
    whatDoes: [
      "Mobil ilovalarni ishlab chiqadi (iOS/Android)",
      "API bilan integratsiya qiladi",
      "App Store / Google Play ga joylaydi",
      "Push notification, offline rejim kabi funksiyalarni qo'shadi",
    ],
    companyRole: "Engineering jamoasida — mobil foydalanuvchilar tajribasiga javobgar. Ko'p hollarda frontend va backend bilan parallel ishlaydi.",
    roadmap: [
      { level: "Junior", title: "Junior Mobile Dev", skills: ["React Native / Flutter", "UI components", "Navigation"], duration: "0-6 oy", salary: "$300–600" },
      { level: "Middle", title: "Middle Mobile Dev", skills: ["Native APIs", "State Management", "Testing", "CI/CD"], duration: "6-18 oy", salary: "$600–1,300" },
      { level: "Senior", title: "Senior Mobile Dev", skills: ["Performance", "Architecture", "Native modules", "Security"], duration: "2-4 yil", salary: "$1,300–2,500" },
      { level: "Lead", title: "Mobile Lead", skills: ["Platform strategy", "Team management", "Cross-platform decisions"], duration: "4+ yil", salary: "$2,500–4,000" },
    ],
  },
  {
    slug: "devops-engineer",
    title: "DevOps Engineer",
    description: "Infratuzilma, CI/CD va deploy jarayonlarini boshqarish",
    level: "Yuqori",
    skills: ["Docker", "Linux", "CI/CD", "AWS/GCP"],
    whatDoes: [
      "Serverlar va infratuzilmani sozlaydi va boshqaradi",
      "CI/CD pipeline yaratadi (avtomatik build/deploy)",
      "Monitoring va logging tizimlarini o'rnatadi",
      "Xavfsizlik va uptime ni ta'minlaydi",
    ],
    companyRole: "Engineering jamoasida — barcha tizimlar barqaror ishlashiga javobgar. Developerlar mahsulotni tez va xavfsiz deploy qilishi uchun infra qurib beradi.",
    roadmap: [
      { level: "Junior", title: "Junior DevOps", skills: ["Linux", "Git", "Docker", "Basic CI/CD"], duration: "0-6 oy", salary: "$400–800" },
      { level: "Middle", title: "Middle DevOps", skills: ["Kubernetes", "Terraform", "Monitoring", "Cloud (AWS/GCP)"], duration: "6-18 oy", salary: "$800–1,800" },
      { level: "Senior", title: "Senior DevOps / SRE", skills: ["Architecture", "Security", "Cost optimization", "Incident management"], duration: "2-4 yil", salary: "$1,800–3,500" },
      { level: "Lead", title: "Platform Engineer / Head of Infra", skills: ["Platform strategy", "Team building", "Multi-cloud"], duration: "4+ yil", salary: "$3,500–5,000+" },
    ],
  },
  {
    slug: "product-manager",
    title: "Product Manager",
    description: "Mahsulot strategiyasi va jamoani boshqarish",
    level: "O'rta",
    skills: ["Agile", "Analytics", "Roadmapping", "Leadership"],
    whatDoes: [
      "Mahsulot strategiyasi va roadmap ni belgilaydi",
      "Foydalanuvchi ehtiyojlarini tadqiq qiladi",
      "Engineering, dizayn va biznes jamoalarini muvofiqlashtiradi",
      "KPI va metrikalarni kuzatadi",
    ],
    companyRole: "Product jamoasida — mahsulotning \"nima\" va \"nega\" savollariga javob beradi. CEO ning kichik versiyasi — mahsulot muvaffaqiyatiga to'liq javobgar.",
    roadmap: [
      { level: "Junior", title: "Associate PM", skills: ["Agile/Scrum", "User Stories", "Basic Analytics", "Communication"], duration: "0-6 oy", salary: "$300–600" },
      { level: "Middle", title: "Product Manager", skills: ["Roadmapping", "A/B Testing", "Stakeholder Management", "Prioritization"], duration: "1-2 yil", salary: "$600–1,200" },
      { level: "Senior", title: "Senior PM", skills: ["Product Strategy", "Data Analysis", "Cross-functional Leadership", "Market Analysis"], duration: "2-4 yil", salary: "$1,200–2,500" },
      { level: "Lead", title: "Head of Product / CPO", skills: ["Vision Setting", "P&L Ownership", "Portfolio Management", "Org Building"], duration: "5+ yil", salary: "$2,500–4,000+" },
    ],
  },
  {
    slug: "seo-specialist",
    title: "SEO Specialist",
    description: "Qidiruv tizimlarida saytni yuqoriga olib chiqish",
    level: "Boshlang'ich",
    skills: ["On-page SEO", "Technical SEO", "Content Strategy", "Analytics"],
    whatDoes: [
      "Saytni Google va boshqa qidiruv tizimlariga optimallashtiradi",
      "Kalit so'zlarni tadqiq qiladi va kontent strategiyasini tuzadi",
      "Texnik SEO muammolarni aniqlaydi va tuzatadi",
      "Organik trafikni o'sishini tahlil qiladi",
    ],
    companyRole: "Marketing jamoasida — organik o'sishga javobgar. Kontent, texnik va marketing jamoalari bilan hamkorlikda ishlaydi.",
    roadmap: [
      { level: "Junior", title: "Junior SEO", skills: ["On-page SEO", "Google Search Console", "Keyword Research"], duration: "0-6 oy", salary: "$200–400" },
      { level: "Middle", title: "SEO Specialist", skills: ["Technical SEO", "Link Building", "Content Strategy", "Analytics"], duration: "6-18 oy", salary: "$400–900" },
      { level: "Senior", title: "Senior SEO / SEO Lead", skills: ["SEO Architecture", "International SEO", "Team Management", "AI SEO"], duration: "2-4 yil", salary: "$900–1,800" },
      { level: "Lead", title: "Head of SEO / Growth Lead", skills: ["Growth Strategy", "Cross-channel Marketing", "Budget Management"], duration: "4+ yil", salary: "$1,800–3,000" },
    ],
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    description: "Onlayn marketing strategiyalari va raqamli kanallar orqali biznesni rivojlantirish",
    level: "Boshlang'ich",
    skills: ["SMM", "Google Ads", "Facebook Ads", "Email Marketing"],
    whatDoes: [
      "Raqamli marketing strategiyasini ishlab chiqadi",
      "Ijtimoiy tarmoqlar va reklama kampaniyalarini boshqaradi",
      "Marketing byudjetini optimallashtiradi va ROI ni kuzatadi",
      "Target auditoriyani aniqlaydi va kontent rejasini tuzadi",
    ],
    companyRole: "Marketing jamoasida — brendni onlayn rivojlantirishga javobgar. Sales, kontent va product jamoalari bilan hamkorlikda ishlaydi.",
    roadmap: [
      { level: "Junior", title: "Junior Marketer", skills: ["SMM asoslari", "Canva", "Email marketing", "Analytics asoslari"], duration: "0-6 oy", salary: "$200–450" },
      { level: "Middle", title: "Digital Marketer", skills: ["Google Ads", "Facebook Ads", "A/B Testing", "Marketing Automation"], duration: "6-18 oy", salary: "$450–1,000" },
      { level: "Senior", title: "Senior Marketer", skills: ["Growth Strategy", "Budget Management", "Team Leading", "Data Analysis"], duration: "2-4 yil", salary: "$1,000–2,000" },
      { level: "Lead", title: "Head of Marketing / CMO", skills: ["Brand Strategy", "P&L Ownership", "Cross-channel Strategy", "Org Building"], duration: "4+ yil", salary: "$2,000–3,500" },
    ],
  },
  {
    slug: "data-analyst",
    title: "Data Analyst",
    description: "Ma'lumotlarni tahlil qilish va biznes qarorlarini qo'llab-quvvatlash",
    level: "O'rta",
    skills: ["SQL", "Python", "Excel", "Power BI"],
    whatDoes: [
      "Ma'lumotlarni yig'adi, tozalaydi va tahlil qiladi",
      "Dashboard va hisobotlar yaratadi",
      "Biznes jamoalariga data asosida tavsiyalar beradi",
      "Trendlarni aniqlaydi va bashorat modellarini quradi",
    ],
    companyRole: "Analytics jamoasida — ma'lumotlar asosida qaror qabul qilishga yordam beradi. Product, marketing va engineering jamoalari bilan ishlaydi.",
    roadmap: [
      { level: "Junior", title: "Junior Analyst", skills: ["Excel", "SQL asoslari", "Google Analytics", "Asosiy statistika"], duration: "0-6 oy", salary: "$300–600" },
      { level: "Middle", title: "Data Analyst", skills: ["Python/R", "Power BI/Tableau", "A/B Testing", "Statistical Analysis"], duration: "6-18 oy", salary: "$600–1,200" },
      { level: "Senior", title: "Senior Data Analyst", skills: ["Machine Learning asoslari", "Data Modeling", "Stakeholder Management", "Mentoring"], duration: "2-4 yil", salary: "$1,200–2,500" },
      { level: "Lead", title: "Head of Analytics / Data Lead", skills: ["Data Strategy", "Team Building", "Advanced ML", "Business Intelligence"], duration: "4+ yil", salary: "$2,500–4,000" },
    ],
  },
  {
    slug: "copywriter",
    title: "Copywriter / Content Creator",
    description: "Kontent yaratish, matn yozish va brend ovozini shakllantirish",
    level: "Boshlang'ich",
    skills: ["Copywriting", "Content Strategy", "SEO Writing", "Storytelling"],
    whatDoes: [
      "Sayt, reklama va ijtimoiy tarmoqlar uchun matnlar yozadi",
      "Kontent strategiyasi va kontent rejasini tuzadi",
      "Brend ovozi (tone of voice) ni shakllantiradi",
      "SEO-optimallashtirilgan maqola va blog postlar yozadi",
    ],
    companyRole: "Marketing jamoasida — brendning ovozi va xabarlariga javobgar. Dizayn, marketing va product jamoalari bilan hamkorlikda ishlaydi.",
    roadmap: [
      { level: "Junior", title: "Junior Copywriter", skills: ["Asosiy copywriting", "Grammatika", "Social media writing", "Research"], duration: "0-6 oy", salary: "$150–350" },
      { level: "Middle", title: "Copywriter", skills: ["SEO Writing", "Email Campaigns", "Brand Voice", "Content Calendar"], duration: "6-18 oy", salary: "$350–800" },
      { level: "Senior", title: "Senior Copywriter / Content Lead", skills: ["Content Strategy", "Team Management", "Conversion Copywriting", "AI Tools"], duration: "2-4 yil", salary: "$800–1,500" },
      { level: "Lead", title: "Head of Content / Creative Director", skills: ["Editorial Strategy", "Brand Building", "Cross-channel Content", "Budget Management"], duration: "4+ yil", salary: "$1,500–2,500" },
    ],
  },
];

export const levelColor: Record<string, string> = {
  "Boshlang'ich": "bg-green-500/10 text-green-500",
  "O'rta": "bg-yellow-500/10 text-yellow-500",
  Yuqori: "bg-red-500/10 text-red-500",
};

export function getCareerBySlug(slug: string): Career | undefined {
  return careers.find((c) => c.slug === slug);
}
