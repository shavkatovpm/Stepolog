import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const ru = locale === "ru";
  return {
    title: ru
      ? "Карта профессий Stepolog — План освоения IT и цифровых профессий"
      : "Stepolog Kasblar Xaritasi — IT va Raqamli Kasblarni Egallash Rejasi",
    description: ru
      ? "Карта профессий Stepolog — бесплатные пошаговые дорожные карты для начинающих в сфере IT и цифрового маркетинга."
      : "Stepolog Kasblar Xaritasi — IT va raqamli marketing sohasiga kirib kelayotgan yangi boshlovchilar uchun bosqichma-bosqich bepul yo'l xaritalari.",
    alternates: { canonical: "/about/yol-xarita" },
    openGraph: {
      title: ru
        ? "Карта профессий Stepolog — План освоения IT и цифровых профессий"
        : "Stepolog Kasblar Xaritasi — IT va Raqamli Kasblarni Egallash Rejasi",
      description: ru
        ? "Бесплатные дорожные карты по современным профессиям: Frontend, UI/UX, цифровой маркетинг и другие."
        : "Frontend, UI/UX, SEO va boshqa zamonaviy kasblar uchun o'zbek tilidagi bepul roadmaplar.",
      url: "/about/yol-xarita",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: ru
        ? "Карта профессий Stepolog | Stepolog.uz"
        : "Stepolog Kasblar Xaritasi | Stepolog.uz",
      description: ru
        ? "Бесплатные пошаговые дорожные карты для освоения IT и цифровых профессий."
        : "IT va raqamli kasblarni egallash uchun bosqichma-bosqich bepul yo'l xaritalari.",
    },
  };
}

export default async function YolXaritaPage({ params }: Props) {
  const { locale } = await params;
  const ru = locale === "ru";

  const faqs = ru
    ? [
        {
          q: "С чего начать изучение IT-сферы?",
          a: "Перейдите в раздел «Карта профессий» на сайте Stepolog.uz и выберите интересующее вас направление. Там указаны все шаги для начала с нуля.",
        },
        {
          q: "Дорожные карты Stepolog платные?",
          a: "Нет, все дорожные карты по всем направлениям (Frontend, UI/UX, цифровой маркетинг и другие) предоставляются абсолютно бесплатно.",
        },
        {
          q: "Как узнать, какая IT-профессия мне подходит?",
          a: "В начале каждой дорожной карты Stepolog дано краткое описание того, чем занимаются специалисты этой профессии и какие навыки необходимы. Это поможет вам сделать правильный выбор.",
        },
        {
          q: "Есть ли дорожные карты по IT и цифровому маркетингу?",
          a: "Да, Stepolog одним из первых в Узбекистане представил современные и практические дорожные карты по IT-профессиям и направлениям цифрового маркетинга.",
        },
      ]
    : [
        {
          q: "IT sohasini o'rganishni nimadan boshlash kerak?",
          a: "Stepolog.uz saytidagi \"Kasblar Xaritasi\" bo'limiga o'tib, o'zingizga qiziq bo'lgan yo'nalishni tanlang. U yerda noldan boshlash uchun barcha bosqichlar ko'rsatilgan.",
        },
        {
          q: "Stepolog yo'l xaritalari pullikmi?",
          a: "Yo'q, barcha yo'nalishlar bo'yicha yo'l xaritalari (Frontend, UI/UX, raqamli marketing va boshqalar) mutlaqo bepul taqdim etiladi.",
        },
        {
          q: "Qaysi IT kasbi menga mosligini qanday bilsam bo'ladi?",
          a: "Stepologdagi har bir yo'l xaritasi boshida o'sha kasb egalari nima ish qilishi va qanday qobiliyatlar kerakligi haqida qisqacha ma'lumot berilgan. Bu sizga to'g'ri tanlov qilishda yordam beradi.",
        },
        {
          q: "O'zbek tilida IT va raqamli marketing roadmaplari bormi?",
          a: "Ha, Stepolog O'zbekistonda birinchilardan bo'lib IT kasblari va raqamli marketing yo'nalishlari bo'yicha zamonaviy va amaliy yo'l xaritalarini o'zbek tilida taqdim etgan.",
        },
      ];

  const careers = ru
    ? [
        { name: "Frontend Developer", desc: "Создание визуальной части веб-сайтов" },
        { name: "UI/UX Designer", desc: "Проектирование пользовательского интерфейса и опыта" },
        { name: "Digital Marketing", desc: "Современные методы онлайн-продвижения и развития бренда" },
        { name: "Product Manager", desc: "Управление IT-проектами" },
      ]
    : [
        { name: "Frontend Developer", desc: "Veb-saytlarning vizual qismini yaratish" },
        { name: "UI/UX Designer", desc: "Foydalanuvchi interfeysi va tajribasini loyihalash" },
        { name: "Digital Marketing", desc: "Raqamli sotuv va brendni rivojlantirish" },
        { name: "Product Manager", desc: "IT loyihalarni boshqarish" },
      ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: ru
      ? "Карта профессий Stepolog: План освоения современных IT и цифровых профессий"
      : "Stepolog Kasblar Xaritasi: Zamonaviy IT va Raqamli Kasblarni Egallash Rejasi",
    description: ru
      ? "Карта профессий Stepolog — бесплатные пошаговые дорожные карты для начинающих в сфере IT и цифрового маркетинга."
      : "Stepolog Kasblar Xaritasi — IT va raqamli marketing sohasiga kirib kelayotgan yangi boshlovchilar uchun bosqichma-bosqich bepul yo'l xaritalari.",
    mainEntityOfPage: "https://stepolog.uz/about/yol-xarita",
    publisher: {
      "@type": "Organization",
      name: "Stepolog",
      url: "https://stepolog.uz",
    },
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Stepolog",
    url: "https://stepolog.uz",
    description: ru
      ? "Бесплатная платформа для развития стартап-экосистемы и практических знаний по IT-профессиям в Узбекистане."
      : "O'zbekistonda startap ekotizimini rivojlantirish va IT kasblari bo'yicha bepul amaliy bilim beruvchi platforma.",
    sameAs: [
      "https://t.me/stepolog",
      "https://instagram.com/stepolog.uz",
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: ru ? "Главная" : "Asosiy sahifa", item: "https://stepolog.uz" },
      { "@type": "ListItem", position: 2, name: ru ? "О нас" : "Biz haqimizda", item: "https://stepolog.uz/about" },
      { "@type": "ListItem", position: 3, name: ru ? "Дорожная карта" : "Yo'l xarita", item: "https://stepolog.uz/about/yol-xarita" },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Link
        href="/about"
        className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-brand"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        {ru ? "О нас" : "Biz haqimizda"}
      </Link>

      {/* Header */}
      <div className="mb-14">
        <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">
          {ru ? "Дорожная карта" : "Yo\u2019l xarita"}
        </span>
        <h1 className="font-display text-4xl uppercase tracking-wide md:text-5xl">
          {ru ? "Карта профессий" : "Kasblar Xaritasi"}
        </h1>
        <p className="mt-4 text-lg text-muted">
          {ru
            ? "Пошаговый план освоения современных IT и цифровых профессий"
            : "Zamonaviy IT va raqamli kasblarni egallash uchun bosqichma-bosqich reja"}
        </p>
      </div>

      <div className="space-y-12 text-base leading-[1.8] text-muted">
        {/* Intro */}
        <p>
          <strong className="text-foreground">
            {ru ? "Карта профессий Stepolog" : "Stepolog Kasblar Xaritasi"}
          </strong> —{" "}
          {ru
            ? "это бесплатная навигационная система, созданная для начинающих в сфере IT и цифрового маркетинга, которая пошагово показывает, какое направление выбрать и как его изучать. На платформе собраны подробные дорожные карты для десятков современных профессий: Frontend-разработчик, UI/UX-дизайнер, специалист по цифровому маркетингу и других."
            : "bu IT va raqamli marketing sohasiga kirib kelayotgan yangi boshlovchilar uchun yaratilgan, qaysi yo\u2019nalishni tanlash va uni qanday o\u2019rganishni bosqichma-bosqich ko\u2019rsatib beruvchi bepul navigatsiya tizimidir. Platformada Frontend dasturchi, UI/UX dizayner, raqamli marketolog kabi o\u2019nlab zamonaviy kasblar uchun o\u2019zbek tilidagi mukammal yo\u2019l xaritalari jamlangan."}
        </p>

        {/* Nima uchun */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            {ru ? "Зачем использовать дорожную карту?" : "Nima uchun yo\u2019l xaritasidan foydalanish kerak?"}
          </h2>
          <p className="mb-6">
            {ru
              ? "Информации очень много, но незнание порядка изучения останавливает большинство людей. Stepolog решает эту проблему:"
              : "Axborot juda ko\u2019p, lekin uni qaysi tartibda o\u2019rganishni bilmaslik ko\u2019pchilikni to\u2019xtatib qo\u2019yadi. Stepolog ushbu muammoni hal qiladi:"}
          </p>
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-sm font-bold text-brand">1</span>
                <h3 className="font-display text-lg uppercase tracking-wide">
                  {ru ? "От нуля до профессионала" : "Noldan professional darajagacha"}
                </h3>
              </div>
              <p className="text-sm">
                {ru
                  ? "Для каждого направления технологии, инструменты и навыки расположены в логической последовательности. Например, для Frontend-направления чётко прочерчен путь от HTML/CSS до JavaScript и React."
                  : "Har bir yo\u2019nalish uchun o\u2019rganilishi kerak bo\u2019lgan texnologiyalar, vositalar va ko\u2019nikmalar mantiqiy ketma-ketlikda joylashtirilgan. Masalan, Frontend yo\u2019nalishida HTML/CSS dan boshlab, JavaScript va React-gacha bo\u2019lgan yo\u2019l aniq chizib berilgan."}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-sm font-bold text-brand">2</span>
                <h3 className="font-display text-lg uppercase tracking-wide">
                  {ru ? "Самые востребованные профессии" : "Eng talabgir kasblar"}
                </h3>
              </div>
              <p className="mb-4 text-sm">
                {ru
                  ? "Платформа охватывает направления с наибольшим спросом на рынке и блестящими перспективами:"
                  : "Platforma bozorda eng yuqori talab va kelajagi porloq yo\u2019nalishlarni qamrab oladi:"}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {careers.map((career) => (
                  <div key={career.name} className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    <span className="text-xs">
                      <strong className="text-foreground">{career.name}</strong>
                      <span className="text-muted"> — {career.desc}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-sm font-bold text-brand">3</span>
                <h3 className="font-display text-lg uppercase tracking-wide">
                  {ru ? "Бесплатный и системный контент" : "Bepul va tizimli kontent"}
                </h3>
              </div>
              <p className="text-sm">
                {ru
                  ? "Все дорожные карты открыты и бесплатны — от пользователя не требуется никакой оплаты. Это практическое воплощение миссии Stepolog «Знания для всех»."
                  : "Barcha yo\u2019l xaritalari ochiq va bepul — foydalanuvchidan hech qanday to\u2019lov talab etilmaydi. Bu Stepologning \u201CBilim hamma uchun\u201D missiyasining amaliy ko\u2019rinishidir."}
              </p>
            </div>
          </div>
        </section>

        {/* Kimlar uchun */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            {ru ? "Для кого?" : "Kimlar uchun?"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
                {ru ? "Не определившиеся с профессией" : "Kasb tanlay olmayotganlar"}
              </h3>
              <p className="text-sm">
                {ru
                  ? "Те, кто хочет понять, какое направление соответствует их интересам."
                  : "Qaysi yo\u2019nalish o\u2019z qiziqishlariga mosligini tushunishni istaganlar."}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
                {ru ? "Самостоятельные ученики" : "Mustaqil o\u2019rganuvchilar"}
              </h3>
              <p className="text-sm">
                {ru
                  ? "Те, кто хочет получать знания по системному плану, не посещая курсы."
                  : "Kurslarga bormasdan, tizimli reja asosida bilim olmoqchi bo\u2019lganlar."}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
                {ru ? "Меняющие сферу деятельности" : "Sohasini o\u2019zgartiruvchilar"}
              </h3>
              <p className="text-sm">
                {ru
                  ? "Те, кто хочет перейти из другой области в IT без ошибок и как можно быстрее."
                  : "Boshqa sohadan IT-ga xatolarsiz va tezroq o\u2019tishni maqsad qilganlar."}
              </p>
            </div>
          </div>
        </section>

        {/* Afzalliklar */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            {ru ? "Почему дорожная карта Stepolog?" : "Nima uchun Stepolog yo\u2019l xaritasi?"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
                {ru ? "Системная структура" : "Tizimli struktura"}
              </h3>
              <p className="text-xs text-muted">
                {ru
                  ? "Каждая профессия разбита на чёткие этапы — не нужно гадать, что изучать."
                  : "Har bir kasb aniq bosqichlarga bo\u2019lingan — nima o\u2019rganish kerakligini taxmin qilish shart emas."}
              </p>
            </div>
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
                {ru ? "Местный контекст" : "Mahalliy kontekst"}
              </h3>
              <p className="text-xs text-muted">
                {ru
                  ? "Учтены технологии и навыки, востребованные на рынке Узбекистана."
                  : "O\u2019zbekiston bozorida talab qilinayotgan texnologiyalar va ko\u2019nikmalar inobatga olingan."}
              </p>
            </div>
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
                {ru ? "Бесплатно и открыто" : "Bepul va ochiq"}
              </h3>
              <p className="text-xs text-muted">
                {ru
                  ? "Все дорожные карты доступны без регистрации и оплаты."
                  : "Barcha yo\u2019l xaritalari ro\u2019yxatdan o\u2019tishsiz va to\u2019lovsiz ochiq."}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            {ru ? "Часто задаваемые вопросы" : "Ko\u2019p beriladigan savollar"}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-border bg-surface p-6">
                <h3 className="mb-2 text-sm font-bold text-foreground">{faq.q}</h3>
                <p className="text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="pt-4 text-center">
          <p className="font-display text-xl uppercase tracking-wide text-foreground">
            {ru ? "Правильный выбор — залог успеха" : "To\u2019g\u2019ri tanlov — muvaffaqiyat garovi"}
          </p>
          <p className="mt-2 text-sm text-muted">
            {ru
              ? "Не тратьте время на неправильное направление — найдите свою карту."
              : "Vaqtingizni noto\u2019g\u2019ri yo\u2019nalishda sarflamang — o\u2019z xaritangizni toping."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/kasblar"
              className="rounded-lg bg-brand px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand/90"
            >
              {ru ? "Смотреть карту профессий" : "Kasblar xaritasini ko\u2019rish"}
            </Link>
            <Link
              href="/learn"
              className="rounded-lg border border-border px-6 py-2.5 text-sm font-bold text-foreground transition-colors hover:border-brand/40"
            >
              {ru ? "Основы стартапов" : "Startap asoslari"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
