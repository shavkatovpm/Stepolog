// Navbar, footer va bosh sahifa uchun yengil ro'yxat (to'liq matn: ./uz.ts, ./en.ts, ./ru.ts)
// Slug'lar to'liq matn fayllaridagi bilan bir xil bo'lishi shart.
import type { LandingId } from "./uz";

export type Locale = "en" | "uz" | "ru";
export type LandingLink = { id: LandingId; slug: string; nav: string; short: string; status: "open" | "soon" };

export const landingLinks: Record<Locale, LandingLink[]> = {
  uz: [
    { id: "bot", slug: "telegram-yangiliklar-boti", nav: "Telegram yangiliklar boti", short: "Soha yangiliklari o'zbek tilida, kunlik dayjest", status: "open" },
    { id: "site", slug: "sayt-yangiliklarini-telegramga-yuborish", nav: "Sayt kuzatish", short: "Istalgan sayt yangiliklarini Telegram'ga olish", status: "open" },
    { id: "translate", slug: "xorijiy-yangiliklar-ozbek-tilida", nav: "Xorijiy yangiliklar o'zbekcha", short: "Ingliz va rus tilidagi maqolalar, qisqa va tushunarli", status: "open" },
    { id: "marketing", slug: "marketing-yangiliklari", nav: "Marketing yangiliklari", short: "Google Ads, Meta, TikTok va Instagram o'zgarishlari", status: "open" },
    { id: "ai", slug: "suniy-intellekt-yangiliklari", nav: "Sun'iy intellekt yangiliklari", short: "AI vositalaridagi amaliy yangiliklar", status: "soon" },
    { id: "autopost", slug: "telegram-kanalga-avtopost", nav: "Kanalga avtopost", short: "Kanalingiz uslubida, jadval bo'yicha postlar", status: "soon" },
  ],
  en: [
    { id: "bot", slug: "telegram-news-bot", nav: "Telegram news bot", short: "News from your field, in one daily digest", status: "open" },
    { id: "site", slug: "website-updates-to-telegram", nav: "Website tracking", short: "Get any website's updates in Telegram", status: "open" },
    { id: "translate", slug: "foreign-news-in-uzbek", nav: "Foreign news in Uzbek", short: "English and Russian articles, short and clear", status: "open" },
    { id: "marketing", slug: "marketing-news", nav: "Marketing news", short: "Google Ads, Meta, TikTok and Instagram updates", status: "open" },
    { id: "ai", slug: "ai-news", nav: "AI news", short: "Practical news about AI tools", status: "soon" },
    { id: "autopost", slug: "telegram-channel-autopost", nav: "Channel autopost", short: "Scheduled posts in your channel's style", status: "soon" },
  ],
  ru: [
    { id: "bot", slug: "telegram-bot-novostey", nav: "Телеграм бот новостей", short: "Новости вашей сферы в ежедневном дайджесте", status: "open" },
    { id: "site", slug: "novosti-saita-v-telegram", nav: "Отслеживание сайтов", short: "Новости любого сайта в Telegram", status: "open" },
    { id: "translate", slug: "zarubezhnye-novosti-na-uzbekskom", nav: "Зарубежные новости на узбекском", short: "Статьи на английском и русском, коротко и понятно", status: "open" },
    { id: "marketing", slug: "novosti-marketinga", nav: "Новости маркетинга", short: "Изменения в Google Ads, Meta, TikTok и Instagram", status: "open" },
    { id: "ai", slug: "novosti-iskusstvennogo-intellekta", nav: "Новости ИИ", short: "Практичные новости об ИИ-инструментах", status: "soon" },
    { id: "autopost", slug: "avtoposting-v-telegram-kanal", nav: "Автопостинг в канал", short: "Посты по расписанию в стиле вашего канала", status: "soon" },
  ],
};

export const landingPath = (locale: Locale, slug: string) => (locale === "en" ? `/${slug}` : `/${locale}/${slug}`);

// Bitta sahifaning barcha tillardagi manzillari (hreflang va til almashtirgich uchun)
export function landingAlternates(id: LandingId): Record<Locale, string> {
  const find = (l: Locale) => landingLinks[l].find((x) => x.id === id)!.slug;
  return { en: landingPath("en", find("en")), uz: landingPath("uz", find("uz")), ru: landingPath("ru", find("ru")) };
}

export const soonLabel: Record<Locale, string> = { uz: "tez orada", en: "coming soon", ru: "скоро" };
