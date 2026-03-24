import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const ru = locale === "ru";
  return {
    title: ru
      ? "Центр знаний Stepolog — Стартапы, IT и цифровой маркетинг"
      : "Stepolog Bilimlar Markazi — Startap, IT va Raqamli Marketing",
    description: ru
      ? "Stepolog.uz — системная образовательная платформа по стартап-экосистеме, современным IT-профессиям и цифровому маркетингу в Узбекистане."
      : "Stepolog.uz — O'zbekistonda startap ekotizimi, zamonaviy IT kasblari va raqamli marketing yo'nalishlarini o'zbek tilida yorituvchi tizimli bilim platformasi.",
    alternates: { canonical: "/about/bilim" },
    openGraph: {
      title: ru
        ? "Центр знаний Stepolog — Стартапы, IT и цифровой маркетинг"
        : "Stepolog Bilimlar Markazi — Startap, IT va Raqamli Marketing",
      description: ru
        ? "Руководство по созданию стартапа из 9 разделов, IT-роадмапы и практические статьи — бесплатно."
        : "Startap qurishning 9 bo'limli qo'llanmasi, IT roadmaplar va amaliy maqolalar — bepul va o'zbek tilida.",
      url: "/about/bilim",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: ru
        ? "Центр знаний Stepolog | Stepolog.uz"
        : "Stepolog Bilimlar Markazi | Stepolog.uz",
      description: ru
        ? "Системная платформа знаний по стартапам, IT-профессиям и цифровому маркетингу."
        : "Startap, IT kasblari va raqamli marketing bo'yicha tizimli bilim platformasi.",
    },
  };
}

export default async function BilimPage({ params }: Props) {
  const { locale } = await params;
  const ru = locale === "ru";

  const faqs = ru
    ? [
        {
          q: "Что есть на платформе Stepolog.uz?",
          a: "На сайте представлено руководство по созданию стартапа из 9 разделов, дорожные карты IT-профессий и практические статьи по цифровому маркетингу.",
        },
        {
          q: "Руководство по стартапам бесплатное?",
          a: "Да, все образовательные материалы на Stepolog.uz, включая руководство по стартапам из 9 разделов, полностью бесплатны для пользователей.",
        },
        {
          q: "По каким IT-профессиям есть дорожные карты на Stepolog?",
          a: "На платформе представлены дорожные карты по направлениям программирования, дизайна, управления проектами и цифрового маркетинга.",
        },
        {
          q: "Stepolog подходит для начинающих?",
          a: "Да, материалы Stepolog написаны как для начинающих, так и для специалистов, которые хотят систематизировать свои знания.",
        },
      ]
    : [
        {
          q: "Stepolog.uz platformasida nimalar mavjud?",
          a: "Saytda startap qurish bo'yicha 9 bo'limli qo'llanma, IT kasblari yo'l xaritalari va raqamli marketing bo'yicha amaliy maqolalar mavjud.",
        },
        {
          q: "Startap qo'llanmasi bepulmi?",
          a: "Ha, Stepolog.uz saytidagi barcha ta'limiy materiallar, jumladan 9 bo'limli startap qo'llanmasi ham foydalanuvchilar uchun mutlaqo bepul.",
        },
        {
          q: "Stepologda qaysi IT kasblari bo'yicha roadmaplar bor?",
          a: "Platformada dasturlash, dizayn, loyihalar boshqaruvi va raqamli marketing yo'nalishlari bo'yicha o'zbek tilidagi yo'l xaritalari taqdim etilgan.",
        },
        {
          q: "Stepolog yangi boshlovchilar uchunmi?",
          a: "Ha, Stepolog materiallari ham yangi boshlovchilar, ham o'z bilimlarini tizimlashtirishni istagan mutaxassislar uchun moslab yozilgan.",
        },
      ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: ru
      ? "Stepolog.uz: Центр знаний по стартапам, IT и цифровому маркетингу в Узбекистане"
      : "Stepolog.uz: O'zbekistonda Startap, IT va Raqamli Marketing Bo'yicha Bilimlar Markazi",
    description: ru
      ? "Stepolog.uz — системная образовательная платформа по стартап-экосистеме, современным IT-профессиям и цифровому маркетингу в Узбекистане."
      : "Stepolog.uz — O'zbekistonda startap ekotizimi, zamonaviy IT kasblari va raqamli marketing yo'nalishlarini o'zbek tilida yorituvchi tizimli bilim platformasi.",
    mainEntityOfPage: "https://stepolog.uz/about/bilim",
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
      { "@type": "ListItem", position: 3, name: ru ? "Знания" : "Bilim", item: "https://stepolog.uz/about/bilim" },
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

  const startapSteps = ru
    ? [
        "Валидация идеи (Market Validation)",
        "Разработка MVP",
        "Бизнес-модель и монетизация",
        "Маркетинг и работа с пользователями",
        "Масштабирование проекта (Scaling)",
      ]
    : [
        "G'oyani tekshirish (Market Validation)",
        "MVP ishlab chiqish",
        "Biznes model va monetizatsiya",
        "Marketing va foydalanuvchilar bilan ishlash",
        "Loyihani kengaytirish (Scaling)",
      ];

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
          {ru ? "Знания" : "Bilim"}
        </span>
        <h1 className="font-display text-4xl uppercase tracking-wide md:text-5xl">
          {ru ? "Центр знаний" : "Bilimlar Markazi"}
        </h1>
        <p className="mt-4 text-lg text-muted">
          {ru
            ? "Системная платформа знаний по стартапам, IT и цифровому маркетингу"
            : "Startap, IT va raqamli marketing bo\u2019yicha tizimli bilim platformasi"}
        </p>
      </div>

      <div className="space-y-12 text-base leading-[1.8] text-muted">
        {/* Intro */}
        <p>
          <strong className="text-foreground">Stepolog.uz</strong> —{" "}
          {ru
            ? "это системная образовательная платформа, освещающая стартап-экосистему, современные IT-профессии и направления цифрового маркетинга в Узбекистане. На сайте бесплатно представлены руководство по созданию стартапа из 9 разделов, охватывающее все этапы, дорожные карты IT-направлений и практические технические статьи."
            : "O\u2019zbekistonda startap ekotizimi, zamonaviy IT kasblari va raqamli marketing yo\u2019nalishlarini o\u2019zbek tilida yorituvchi tizimli bilim platformasidir. Saytda startap qurishning barcha bosqichlarini qamrab olgan 9 bo\u2019limli qo\u2019llanma, IT yo\u2019nalishlari bo\u2019yicha \u201Croadmap\u201Dlar va amaliy texnik maqolalar bepul foydalanish uchun taqdim etilgan."}
        </p>

        {/* Arxitektura */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            {ru ? "Архитектура знаний" : "Bilim arxitekturasi"}
          </h2>
          <p className="mb-6">
            {ru
              ? "Stepolog.uz представляет информацию не хаотично, а на основе чётких модулей, исходя из потребностей пользователя:"
              : "Stepolog.uz ma\u2019lumotlarni tartibsiz emas, balki foydalanuvchi ehtiyojidan kelib chiqib, aniq modullar asosida taqdim etadi:"}
          </p>

          <div className="space-y-4">
            {/* Modul 1 */}
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-sm font-bold text-brand">1</span>
                <h3 className="font-display text-lg uppercase tracking-wide">
                  {ru ? "Основы стартапов: стратегическое руководство из 9 разделов" : "Startap asoslari: 9 bo\u2019limli strategik qo\u2019llanma"}
                </h3>
              </div>
              <p className="mb-4 text-sm">
                {ru
                  ? "Этот раздел предназначен для тех, кто хочет начать бизнес с нуля, и включает следующие этапы:"
                  : "Bu bo\u2019lim noldan biznes boshlamoqchi bo\u2019lganlar uchun mo\u2019ljallangan bo\u2019lib, quyidagi bosqichlarni o\u2019z ichiga oladi:"}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {startapSteps.map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    <span className="text-xs text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modul 2 */}
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-sm font-bold text-brand">2</span>
                <h3 className="font-display text-lg uppercase tracking-wide">
                  {ru ? "Дорожная карта профессий (IT Roadmaps)" : "Kasblar yo\u2019l xaritasi (IT Roadmaps)"}
                </h3>
              </div>
              <p className="text-sm">
                {ru
                  ? "Stepolog помогает молодёжи, входящей в мир IT, с выбором направления. На платформе представлены системные дорожные карты по программированию, дизайну и управлению проектами. Они дают чёткий ответ на вопросы «с чего начать и что изучать?»."
                  : "Stepolog IT olamiga kirib kelayotgan yoshlar uchun yo\u2019nalish tanlashda ko\u2019maklashadi. Platformada dasturlash, dizayn va loyihalarni boshqarish bo\u2019yicha o\u2019zbek tilidagi tizimli yo\u2019l xaritalari mavjud. Bu foydalanuvchiga \u201Cqayerdan boshlash va nimalarni o\u2019rganish kerak?\u201D degan savollarga aniq javob beradi."}
              </p>
            </div>

            {/* Modul 3 */}
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-sm font-bold text-brand">3</span>
                <h3 className="font-display text-lg uppercase tracking-wide">
                  {ru ? "Технологические статьи и отраслевые новости" : "Texnologik maqolalar va sanoat yangiliklari"}
                </h3>
              </div>
              <p className="text-sm">
                {ru
                  ? "На сайте регулярно публикуется аналитический контент об инструментах искусственного интеллекта, технологических новостях глобального и местного IT-рынка."
                  : "Saytda sun\u2019iy intellekt vositalari, global va mahalliy IT bozoridagi texnologik yangiliklar bo\u2019yicha muntazam ravishda tahliliy kontent e\u2019lon qilinadi."}
              </p>
            </div>
          </div>
        </section>

        {/* Nima uchun muhim */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            {ru ? "Почему Stepolog — важный ресурс?" : "Nima uchun Stepolog muhim resurs?"}
          </h2>
          <p className="mb-6 text-sm">
            {ru
              ? "В отличие от других источников, Stepolog представляет знания в системной и понятной форме:"
              : "Stepolog boshqa manbalardan farqli ravishda bilimni tizimli va tushunarli shaklda taqdim etadi:"}
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
                {ru ? "Системный подход" : "Tizimli yondashuv"}
              </h3>
              <p className="text-xs text-muted">
                {ru
                  ? "Информация представлена не как набор статей, а в виде курса для пошагового изучения."
                  : "Ma\u2019lumotlar shunchaki maqolalar to\u2019plami emas, balki bosqichma-bosqich o\u2019rganish uchun mo\u2019ljallangan kurs ko\u2019rinishida."}
              </p>
            </div>
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
                {ru ? "Доступный язык" : "O\u2019zbek tilidagi kontent"}
              </h3>
              <p className="text-xs text-muted">
                {ru
                  ? "Сложные IT- и бизнес-концепции изложены простым и понятным языком."
                  : "Murakkab IT va biznes tushunchalari o\u2019zbek tilida sodda va tushunarli tilda bayon etilgan."}
              </p>
            </div>
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
                {ru ? "Открытый доступ" : "Ochiq kirish"}
              </h3>
              <p className="text-xs text-muted">
                {ru
                  ? "Все дорожные карты и руководства бесплатны и доступны без регистрации."
                  : "Barcha yo\u2019l xaritalari va qo\u2019llanmalar foydalanuvchilar uchun bepul va ro\u2019yxatdan o\u2019tishsiz ochiq."}
              </p>
            </div>
          </div>
        </section>

        {/* Kimlar uchun */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            {ru ? "Для кого?" : "Kimlar uchun?"}
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">1</span>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {ru ? "Будущие предприниматели" : "Bo\u2019lajak tadbirkorlar"}
                </h3>
                <p className="text-sm">
                  {ru
                    ? "Те, кто хочет системно превратить свою идею в бизнес."
                    : "O\u2019z g\u2019oyasini tizimli ravishda biznesga aylantirmoqchi bo\u2019lganlar."}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">2</span>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {ru ? "Интересующиеся IT-сферой" : "IT sohasiga qiziquvchilar"}
                </h3>
                <p className="text-sm">
                  {ru
                    ? "Те, кто ищет чёткий план (roadmap) для освоения современной профессии."
                    : "Zamonaviy kasb egalari bo\u2019lish uchun aniq reja (roadmap) qidirayotganlar."}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">3</span>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {ru ? "Желающие расширить знания" : "O\u2019z bilimini oshirmoqchilar"}
                </h3>
                <p className="text-sm">
                  {ru
                    ? "Те, кто хочет углубить свои знания о современных технологиях и бизнес-трендах."
                    : "Zamonaviy texnologiyalar va biznes trendlari haqida bilimlarini kengaytirmoqchi bo\u2019lganlar."}
                </p>
              </div>
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
            {ru ? "Сократите путь от знаний до результата." : "Bilimdan natijagacha bo\u2019lgan yo\u2019lni qisqartiring."}
          </p>
          <p className="mt-2 text-sm text-muted">
            {ru
              ? "Начните своё путешествие в мир IT и стартапов уже сегодня."
              : "O\u2019z IT va startap sayohatingizni bugun boshlang."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/learn"
              className="rounded-lg bg-brand px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand/90"
            >
              {ru ? "Начать обучение" : "O\u2019rganishni boshlash"}
            </Link>
            <Link
              href="/kasblar"
              className="rounded-lg border border-border px-6 py-2.5 text-sm font-bold text-foreground transition-colors hover:border-brand/40"
            >
              {ru ? "Карта профессий" : "Kasblar xaritasi"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
