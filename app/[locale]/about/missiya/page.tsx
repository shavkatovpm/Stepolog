import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const ru = locale === "ru";
  return {
    title: ru
      ? "Что такое Stepolog? — Миссия и цели"
      : "Stepolog Nima? — Missiya va Maqsadlar",
    description: ru
      ? "Stepolog — бесплатная платформа для развития стартап-экосистемы и IT-профессий в Узбекистане."
      : "Stepolog — O'zbekistonda startap ekotizimini rivojlantirish va IT kasblari bo'yicha bepul amaliy bilim beruvchi platforma.",
    alternates: { canonical: "/about/missiya" },
    openGraph: {
      title: ru
        ? "Что такое Stepolog? — Миссия и цели"
        : "Stepolog Nima? — Missiya va Maqsadlar",
      description: ru
        ? "Цифровая экосистема для стартапов и IT-профессий в Узбекистане."
        : "O'zbekistondagi startaplar va IT kasblari uchun raqamli ekotizim.",
      url: "/about/missiya",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: ru
        ? "Что такое Stepolog? | Stepolog.uz"
        : "Stepolog Nima? | Stepolog.uz",
      description: ru
        ? "Цифровая экосистема для стартапов и IT-профессий в Узбекистане."
        : "O'zbekistondagi startaplar va IT kasblari uchun raqamli ekotizim.",
    },
  };
}

export default async function MissiyaPage({ params }: Props) {
  const { locale } = await params;
  const ru = locale === "ru";

  const faqs = ru
    ? [
        {
          q: "Что такое Stepolog?",
          a: "Stepolog — это образовательная платформа, которая обучает основам стартапов, предоставляет дорожные карты IT-профессий и бесплатно делится знаниями о цифровом маркетинге в Узбекистане.",
        },
        {
          q: "Для кого создан Stepolog?",
          a: "Платформа предназначена для предпринимателей, которые хотят начать свой бизнес, молодёжи, входящей в IT-сферу, и тех, кто хочет освоить основы цифрового маркетинга.",
        },
        {
          q: "Stepolog бесплатный?",
          a: "Да, все материалы на платформе Stepolog — руководства по стартапам, дорожные карты профессий и статьи — полностью бесплатны и открыты для пользователей.",
        },
        {
          q: "Чему учит Stepolog?",
          a: "Stepolog обучает основам стартапов, валидации идей, бизнес-стратегиям и современным направлениям IT-профессий.",
        },
      ]
    : [
        {
          q: "Stepolog nima?",
          a: "Stepolog — O'zbekistondagi startap asoslarini o'rgatuvchi, IT kasblari bo'yicha yo'l xaritalarini taqdim etuvchi va raqamli marketing bilimlarini bepul ulashuvchi ta'limiy platforma.",
        },
        {
          q: "Stepolog kimlar uchun?",
          a: "Platforma o'z biznesini boshlamoqchi bo'lgan tadbirkorlar, IT sohasiga kirib kelayotgan yoshlar va raqamli marketing asoslarini o'rganmoqchi bo'lganlar uchun mo'ljallangan.",
        },
        {
          q: "Stepolog bepulmi?",
          a: "Ha, Stepolog platformasidagi barcha materiallar — startap qo'llanmalari, kasblar yo'l xaritalari va maqolalar — foydalanuvchilar uchun to'liq bepul va ochiq.",
        },
        {
          q: "Stepolog nima o'rgatadi?",
          a: "Stepolog startap asoslari, g'oyani validatsiya qilish, biznes strategiyalari va zamonaviy IT kasblari yo'nalishlarini o'rgatadi.",
        },
      ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: ru
      ? "Что такое Stepolog? Цифровая экосистема для стартапов и IT-профессий в Узбекистане"
      : "Stepolog Nima? O'zbekistondagi Startaplar va IT Kasblari Uchun Raqamli Ekotizim",
    description: ru
      ? "Stepolog — бесплатная платформа для развития стартап-экосистемы и практических знаний по IT-профессиям в Узбекистане."
      : "Stepolog — O'zbekistonda startap ekotizimini rivojlantirish va IT kasblari bo'yicha bepul amaliy bilim beruvchi platforma.",
    mainEntityOfPage: "https://stepolog.uz/about/missiya",
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
      { "@type": "ListItem", position: 3, name: ru ? "Миссия" : "Missiya", item: "https://stepolog.uz/about/missiya" },
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
          {ru ? "Миссия" : "Missiya"}
        </span>
        <h1 className="font-display text-4xl uppercase tracking-wide md:text-5xl">
          {ru ? "Что такое Stepolog?" : "Stepolog Nima?"}
        </h1>
        <p className="mt-4 text-lg text-muted">
          {ru
            ? "Цифровая экосистема для стартапов и IT-профессий в Узбекистане"
            : "O\u2019zbekistondagi startaplar va IT kasblari uchun raqamli ekotizim"}
        </p>
      </div>

      <div className="space-y-12 text-base leading-[1.8] text-muted">
        {/* Intro */}
        <p>
          <strong className="text-foreground">Stepolog</strong> —{" "}
          {ru
            ? "это бесплатная образовательная платформа, посвящённая развитию стартап-экосистемы в Узбекистане, практическим знаниям по IT-профессиям и основам цифрового маркетинга. Проект предоставляет начинающим предпринимателям, молодым специалистам и IT-профессионалам пошаговые знания и дорожные карты."
            : "bu O\u2019zbekistonda startap ekotizimini rivojlantirish, IT kasblari bo\u2019yicha amaliy bilim berish va raqamli marketing asoslarini o\u2019rgatishga bag\u2019ishlangan bepul bilim platformasidir. Loyiha yangi boshlovchilar, yosh tadbirkorlar va IT mutaxassislariga bosqichma-bosqich bilim va yo\u2019l xaritalarini taqdim etadi."}
        </p>

        {/* Missiya */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            {ru ? "Миссия и стратегические цели" : "Missiya va strategik maqsadlar"}
          </h2>
          <p>
            {ru
              ? "В современном быстро меняющемся цифровом мире одних теоретических знаний недостаточно. Миссия Stepolog — дать каждому пользователю практические знания и привести к конкретным результатам. Платформа — не просто информационный блог, а бесплатная образовательная система, которая пошагово показывает путь от идеи до готового продукта."
              : "Bugungi tez o\u2019zgaruvchan raqamli dunyoda nazariy bilimning o\u2019zi yetarli emas. Stepolog missiyasi — har bir foydalanuvchiga amaliy bilim berib, ularni aniq natijaga olib chiqishdir. Platforma shunchaki ma\u2019lumot beruvchi blog emas, balki g\u2019oyadan tortib to tayyor mahsulotgacha bo\u2019lgan yo\u2019lni bosqichma-bosqich ko\u2019rsatib beruvchi bepul ta\u2019lim tizimdir."}
          </p>
        </section>

        {/* Platformada nimalar bor */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            {ru ? "Что есть на платформе?" : "Platformada nimalar bor?"}
          </h2>
          <p className="mb-6">
            {ru
              ? "Платформа Stepolog служит картой знаний как для начинающих, так и для опытных специалистов."
              : "Stepolog platformasi yangi boshlovchilar va tajribali mutaxassislar uchun bilimlar xaritasi vazifasini o\u2019taydi."}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-2 font-display text-lg uppercase tracking-wide">
                {ru ? "Основы стартапов" : "Startap asoslari"}
              </h3>
              <p className="text-sm">
                {ru
                  ? "Валидация идеи, создание минимального жизнеспособного продукта (MVP) и поиск первых пользователей — пошаговые руководства."
                  : "G\u2019oyani tekshirish (validation), minimal hayotiy mahsulot (MVP) yaratish va birinchi foydalanuvchilarni topish — bosqichma-bosqich qo\u2019llanmalar."}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-2 font-display text-lg uppercase tracking-wide">
                {ru ? "Карта профессий" : "Kasblar xaritasi"}
              </h3>
              <p className="text-sm">
                {ru
                  ? "Пути роста от junior до senior уровня в направлениях программирования, дизайна, управления проектами и цифрового маркетинга."
                  : "Dasturlash, dizayn, loyihalar boshqaruvi va raqamli marketing yo\u2019nalishlarida junior darajadan senior darajagacha o\u2019sish yo\u2019llari."}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-2 font-display text-lg uppercase tracking-wide">
                {ru ? "Основы цифрового маркетинга" : "Raqamli marketing asoslari"}
              </h3>
              <p className="text-sm">
                {ru
                  ? "Практические знания о современных методах онлайн-маркетинга и каналах продвижения для развития бизнеса."
                  : "Onlayn biznesni o\u2019stirish uchun zamonaviy marketing usullari va kanallari haqida amaliy bilimlar."}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-2 font-display text-lg uppercase tracking-wide">
                {ru ? "Бизнес в эпоху AI" : "AI davrida biznes yuritish"}
              </h3>
              <p className="text-sm">
                {ru
                  ? "Способы упрощения бизнес-процессов и повышения эффективности с помощью инструментов искусственного интеллекта."
                  : "Sun\u2019iy intellekt vositalari yordamida biznes jarayonlarini soddalashtirish va samaradorlikni oshirish yo\u2019llari."}
              </p>
            </div>
          </div>
        </section>

        {/* Kimlar uchun */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            {ru ? "Для кого Stepolog?" : "Stepolog kimlar uchun?"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
                {ru ? "Будущие стартаперы" : "Bo\u2019lajak startapchilar"}
              </h3>
              <p className="text-sm">
                {ru
                  ? "Молодые предприниматели, которые хотят превратить свою идею в бизнес."
                  : "O\u2019z g\u2019oyasini biznesga aylantirmoqchi bo\u2019lgan yosh tadbirkorlar."}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
                {ru ? "IT-специалисты" : "IT-mutaxassislar"}
              </h3>
              <p className="text-sm">
                {ru
                  ? "Те, кто хочет повысить квалификацию в своей области или освоить новую профессию."
                  : "O\u2019z sohasida malaka oshirishni yoki yangi kasb egallashni xohlovchilar."}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
                {ru ? "Малый и средний бизнес" : "Kichik va o\u2019rta biznes"}
              </h3>
              <p className="text-sm">
                {ru
                  ? "Те, кто хочет развивать свой бизнес в цифровом мире и освоить современные методы онлайн-маркетинга."
                  : "Raqamli dunyoda o\u2019z biznesini rivojlantirish va zamonaviy marketing asoslarini o\u2019rganmoqchi bo\u2019lganlar."}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
                {ru ? "Студенты и учащиеся" : "Talabalar va o\u2019quvchilar"}
              </h3>
              <p className="text-sm">
                {ru
                  ? "Те, кто интересуется IT-сферой и планирует работать в области технологий."
                  : "IT sohasiga qiziquvchi va kelajakda texnologiya yo\u2019nalishida ishlashni rejalashtiruvchilar."}
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
            {ru ? "Стройте будущее со Stepolog уже сегодня." : "Stepolog bilan kelajakni bugun quring."}
          </p>
          <p className="mt-2 text-sm text-muted">
            {ru
              ? "Расти с нами — это просто последовательность шагов."
              : "Biz bilan o\u2019sish — bu shunchaki qadamlar ketma-ketligi."}
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
