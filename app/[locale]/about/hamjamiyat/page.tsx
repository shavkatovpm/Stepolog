import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const ru = locale === "ru";
  return {
    title: ru
      ? "Сообщество Stepolog — Платформа молодых предпринимателей и IT-специалистов"
      : "Stepolog Hamjamiyati — Yosh Tadbirkorlar va IT Mutaxassislari Platformasi",
    description: ru
      ? "Сообщество Stepolog — бесплатная платформа, объединяющая молодых предпринимателей, основателей стартапов и IT-специалистов Узбекистана."
      : "Stepolog hamjamiyati — O'zbekistondagi yosh tadbirkorlar, startap asoschilari va IT mutaxassislarini birlashtiruvchi bepul platforma.",
    alternates: { canonical: "/about/hamjamiyat" },
    openGraph: {
      title: ru
        ? "Сообщество Stepolog — Молодые предприниматели и IT-специалисты"
        : "Stepolog Hamjamiyati — Yosh Tadbirkorlar va IT Mutaxassislari",
      description: ru
        ? "Бесплатная платформа, объединяющая молодых предпринимателей и IT-специалистов Узбекистана."
        : "O'zbekistondagi yosh tadbirkorlar va IT mutaxassislarini birlashtiruvchi bepul platforma.",
      url: "/about/hamjamiyat",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: ru
        ? "Сообщество Stepolog | Stepolog.uz"
        : "Stepolog Hamjamiyati | Stepolog.uz",
      description: ru
        ? "Бесплатная платформа, объединяющая молодых предпринимателей и IT-специалистов."
        : "Yosh tadbirkorlar va IT mutaxassislarini birlashtiruvchi bepul platforma.",
    },
  };
}

export default async function HamjamiyatPage({ params }: Props) {
  const { locale } = await params;
  const ru = locale === "ru";

  const faqs = ru
    ? [
        {
          q: "Что такое сообщество Stepolog?",
          a: "Это платформа взаимного сотрудничества и обмена опытом для молодых предпринимателей, IT-специалистов и основателей стартапов в Узбекистане.",
        },
        {
          q: "Вступление в сообщество платное?",
          a: "Нет, Stepolog — открытое сообщество, вступление бесплатное.",
        },
        {
          q: "Что даёт членство в сообществе?",
          a: "Участники получают возможности для профессионального нетворкинга, участия в новых проектах, поиска партнёров и получения актуальных новостей из мира IT и стартапов.",
        },
        {
          q: "Где действует сообщество Stepolog?",
          a: "Сообщество организует общение и обмен информацией через основную веб-платформу (Stepolog.uz) и Telegram-канал.",
        },
      ]
    : [
        {
          q: "Stepolog hamjamiyati nima?",
          a: "Bu O'zbekistondagi yosh tadbirkorlar, IT mutaxassislari va startap asoschilarining o'zaro hamkorlik va tajriba almashish platformasidir.",
        },
        {
          q: "Hamjamiyatga qo'shilish pullikmi?",
          a: "Yo'q, Stepolog ochiq hamjamiyat hisoblanadi va unga qo'shilish bepul.",
        },
        {
          q: "Hamjamiyat a'zosi bo'lish nima beradi?",
          a: "A'zolar professional networking imkoniyati, yangi loyihalarda ishtirok etish, hamkorlar topish va IT hamda startap olamidagi eng so'nggi yangiliklerdan xabardor bo'lish imkoniyatiga ega bo'ladilar.",
        },
        {
          q: "Stepolog hamjamiyati qayerda faoliyat yuritadi?",
          a: "Hamjamiyat asosiy veb-platforma (Stepolog.uz) hamda Telegram kanali orqali muloqot va ma'lumot almashuvini tashkil qiladi.",
        },
      ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: ru
      ? "Сообщество Stepolog: Платформа молодых предпринимателей и IT-специалистов Узбекистана"
      : "Stepolog Hamjamiyati: O'zbekistondagi Yosh Tadbirkorlar va IT Mutaxassislari Platformasi",
    description: ru
      ? "Сообщество Stepolog — бесплатная платформа, объединяющая молодых предпринимателей, основателей стартапов и IT-специалистов Узбекистана."
      : "Stepolog hamjamiyati — O'zbekistondagi yosh tadbirkorlar, startap asoschilari va IT mutaxassislarini birlashtiruvchi bepul platforma.",
    mainEntityOfPage: "https://stepolog.uz/about/hamjamiyat",
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
      { "@type": "ListItem", position: 3, name: ru ? "Сообщество" : "Hamjamiyat", item: "https://stepolog.uz/about/hamjamiyat" },
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
          {ru ? "Сообщество" : "Hamjamiyat"}
        </span>
        <h1 className="font-display text-4xl uppercase tracking-wide md:text-5xl">
          {ru ? "Сообщество Stepolog" : "Stepolog Hamjamiyati"}
        </h1>
        <p className="mt-4 text-lg text-muted">
          {ru
            ? "Платформа, объединяющая молодых предпринимателей и IT-специалистов Узбекистана"
            : "O\u2019zbekistondagi yosh tadbirkorlar va IT mutaxassislarini birlashtiruvchi platforma"}
        </p>
      </div>

      <div className="space-y-12 text-base leading-[1.8] text-muted">
        {/* Intro */}
        <p>
          <strong className="text-foreground">
            {ru ? "Сообщество Stepolog" : "Stepolog hamjamiyati"}
          </strong> —{" "}
          {ru
            ? "это бесплатная платформа, объединяющая молодых предпринимателей, основателей стартапов и IT-специалистов, стремящихся к развитию цифровой экономики Узбекистана. Участники сообщества достигают профессионального роста через обмен опытом, поиск партнёров и обсуждение современных технологических трендов."
            : "bu O\u2019zbekistonning raqamli iqtisodiyotini rivojlantirishga intilayotgan yosh tadbirkorlar, startap asoschilari va IT mutaxassislarini birlashtiruvchi bepul platformadir. Hamjamiyat a\u2019zolari o\u2019zaro tajriba almashish, hamkorlar topish va zamonaviy texnologik trendlarni muhokama qilish orqali professional o\u2019sishga erishadilar."}
        </p>

        {/* Maqsad va qadriyatlar */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            {ru ? "Цели и ценности" : "Maqsad va qadriyatlar"}
          </h2>
          <p className="mb-6">
            {ru
              ? "Stepolog не просто даёт знания, а стремится создать экосистему людей, которые применяют эти знания на практике."
              : "Stepolog shunchaki bilim berib qolmay, balki o\u2019sha bilimni amaliyotga tatbiq etuvchi odamlar ekotizimini yaratishni maqsad qilgan."}
          </p>
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-sm font-bold text-brand">1</span>
                <h3 className="font-display text-lg uppercase tracking-wide">
                  {ru ? "Нетворкинг и сотрудничество" : "Networking va hamkorlik"}
                </h3>
              </div>
              <p className="text-sm">
                {ru
                  ? "Успешные проекты строятся сильной командой. Сообщество Stepolog служит мостом, соединяющим разработчиков с дизайнерами, стартаперов с маркетологами."
                  : "Muvaffaqiyatli loyihalar kuchli jamoa bilan quriladi. Stepolog hamjamiyati dasturchilarni dizaynerlar bilan, startapchilarni esa marketologlar bilan bog\u2019lovchi ko\u2019prik vazifasini o\u2019taydi."}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-sm font-bold text-brand">2</span>
                <h3 className="font-display text-lg uppercase tracking-wide">
                  {ru ? "Обучение от единомышленников" : "Tengdoshdan o\u2019rganish"}
                </h3>
              </div>
              <p className="text-sm">
                {ru
                  ? "Внутри сообщества опытные участники направляют начинающих, анализируются практические кейсы и совместно ищутся решения реальных проблем."
                  : "Hamjamiyat ichida tajribali a\u2019zolar yangi boshlovchilarga yo\u2019l ko\u2019rsatadi, amaliy keyslar tahlil qilinadi va real muammolarga birgalikda yechim izlanadi."}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-sm font-bold text-brand">3</span>
                <h3 className="font-display text-lg uppercase tracking-wide">
                  {ru ? "Поддержка экосистемы" : "Ekotizimni qo\u2019llab-quvvatlash"}
                </h3>
              </div>
              <p className="text-sm">
                {ru
                  ? "Оперативный обмен информацией о новостях стартап-рынка Узбекистана, грантах, программах акселерации и вакансиях."
                  : "O\u2019zbekiston startap bozoridagi yangiliklar, grantlar, akseleratsiya dasturlari va vakansiyalar haqida tezkor ma\u2019lumot almashish."}
              </p>
            </div>
          </div>
        </section>

        {/* Kimlar uchun */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            {ru ? "Для кого?" : "Kimlar uchun?"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
                {ru ? "Основатели стартапов" : "Startap asoschilari"}
              </h3>
              <p className="text-sm">
                {ru
                  ? "Предприниматели, ищущие советы или команду для реализации своей идеи."
                  : "O\u2019z g\u2019oyasini amalga oshirish uchun maslahat yoki jamoa qidirayotgan tadbirkorlar."}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
                {ru ? "IT-специалисты" : "IT mutaxassislari"}
              </h3>
              <p className="text-sm">
                {ru
                  ? "Те, кто хочет повысить технические навыки и быть в курсе новостей отрасли."
                  : "Texnik ko\u2019nikmalarini oshirmoqchi va sohada yangiliklar bilan tanishmoqchi bo\u2019lganlar."}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
                {ru ? "Изучающие цифровой маркетинг" : "Raqamli marketing o\u2019rganuvchilar"}
              </h3>
              <p className="text-sm">
                {ru
                  ? "Начинающие, которые хотят освоить современные методы онлайн-маркетинга и тренды."
                  : "Zamonaviy marketing usullari va trendlarini o\u2019rganmoqchi bo\u2019lgan yangi boshlovchilar."}
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

        {/* Afzalliklar */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            {ru ? "Зачем вступать?" : "Nima uchun qo\u2019shilish kerak?"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
                {ru ? "Местный контекст" : "Mahalliy kontekst"}
              </h3>
              <p className="text-xs text-muted">
                {ru
                  ? "Все обсуждения адаптированы к рынку и менталитету Узбекистана."
                  : "Barcha muhokamalar O\u2019zbekiston bozori va mentalitetiga moslashtirilgan."}
              </p>
            </div>
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
                {ru ? "Качественный контент" : "Sifatli kontent"}
              </h3>
              <p className="text-xs text-muted">
                {ru
                  ? "Только полезная и практическая информация, среда без лишней рекламы."
                  : "Faqat foydali va amaliy ma\u2019lumotlar, keraksiz reklamasiz muhit."}
              </p>
            </div>
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
                {ru ? "Бесплатно и открыто" : "Bepul va ochiq"}
              </h3>
              <p className="text-xs text-muted">
                {ru
                  ? "Вступление в сообщество и использование всех ресурсов полностью бесплатно."
                  : "Hamjamiyatga qo\u2019shilish va barcha resurslardan foydalanish to\u2019liq bepul."}
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
            {ru ? "Присоединяйтесь к сообществу Stepolog!" : "Stepolog hamjamiyatiga qo\u2019shiling!"}
          </p>
          <p className="mt-2 text-sm text-muted">
            {ru
              ? "Станьте частью цифровых перемен."
              : "Raqamli o\u2019zgarishlarning bir qismiga aylaning."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="https://t.me/stepolog"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-brand px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand/90"
            >
              {ru ? "Присоединиться к Telegram-каналу" : "Telegram kanalga qo\u2019shilish"}
            </a>
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
