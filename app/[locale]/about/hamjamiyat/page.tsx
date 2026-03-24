import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stepolog Hamjamiyati — Yosh Tadbirkorlar va IT Mutaxassislari Platformasi",
  description:
    "Stepolog hamjamiyati — O'zbekistondagi yosh tadbirkorlar, startap asoschilari va IT mutaxassislarini birlashtiruvchi bepul platforma.",
  alternates: { canonical: "/about/hamjamiyat" },
  openGraph: {
    title: "Stepolog Hamjamiyati — Yosh Tadbirkorlar va IT Mutaxassislari",
    description:
      "O'zbekistondagi yosh tadbirkorlar va IT mutaxassislarini birlashtiruvchi bepul platforma.",
    url: "/about/hamjamiyat",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stepolog Hamjamiyati | Stepolog.uz",
    description:
      "Yosh tadbirkorlar va IT mutaxassislarini birlashtiruvchi bepul platforma.",
  },
};

export default function HamjamiyatPage() {
  const faqs = [
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
    headline:
      "Stepolog Hamjamiyati: O'zbekistondagi Yosh Tadbirkorlar va IT Mutaxassislari Platformasi",
    description:
      "Stepolog hamjamiyati — O'zbekistondagi yosh tadbirkorlar, startap asoschilari va IT mutaxassislarini birlashtiruvchi bepul platforma.",
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
    description:
      "O'zbekistonda startap ekotizimini rivojlantirish va IT kasblari bo'yicha bepul amaliy bilim beruvchi platforma.",
    sameAs: [
      "https://t.me/stepolog",
      "https://instagram.com/stepolog.uz",
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Asosiy sahifa", item: "https://stepolog.uz" },
      { "@type": "ListItem", position: 2, name: "Biz haqimizda", item: "https://stepolog.uz/about" },
      { "@type": "ListItem", position: 3, name: "Hamjamiyat", item: "https://stepolog.uz/about/hamjamiyat" },
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
        Biz haqimizda
      </Link>

      {/* Header */}
      <div className="mb-14">
        <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">
          Hamjamiyat
        </span>
        <h1 className="font-display text-4xl uppercase tracking-wide md:text-5xl">
          Stepolog Hamjamiyati
        </h1>
        <p className="mt-4 text-lg text-muted">
          O&apos;zbekistondagi yosh tadbirkorlar va IT mutaxassislarini birlashtiruvchi platforma
        </p>
      </div>

      <div className="space-y-12 text-base leading-[1.8] text-muted">
        {/* Intro */}
        <p>
          <strong className="text-foreground">Stepolog hamjamiyati</strong> — bu
          O&apos;zbekistonning raqamli iqtisodiyotini rivojlantirishga intilayotgan yosh
          tadbirkorlar, startap asoschilari va IT mutaxassislarini birlashtiruvchi bepul
          platformadir. Hamjamiyat a&apos;zolari o&apos;zaro tajriba almashish, hamkorlar topish
          va zamonaviy texnologik trendlarni muhokama qilish orqali professional o&apos;sishga
          erishadilar.
        </p>

        {/* Maqsad va qadriyatlar */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            Maqsad va qadriyatlar
          </h2>
          <p className="mb-6">
            Stepolog shunchaki bilim berib qolmay, balki o&apos;sha bilimni amaliyotga tatbiq
            etuvchi odamlar ekotizimini yaratishni maqsad qilgan.
          </p>
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-sm font-bold text-brand">1</span>
                <h3 className="font-display text-lg uppercase tracking-wide">
                  Networking va hamkorlik
                </h3>
              </div>
              <p className="text-sm">
                Muvaffaqiyatli loyihalar kuchli jamoa bilan quriladi. Stepolog hamjamiyati
                dasturchilarni dizaynerlar bilan, startapchilarni esa marketologlar bilan
                bog&apos;lovchi ko&apos;prik vazifasini o&apos;taydi.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-sm font-bold text-brand">2</span>
                <h3 className="font-display text-lg uppercase tracking-wide">
                  Tengdoshdan o&apos;rganish
                </h3>
              </div>
              <p className="text-sm">
                Hamjamiyat ichida tajribali a&apos;zolar yangi boshlovchilarga yo&apos;l
                ko&apos;rsatadi, amaliy keyslar tahlil qilinadi va real muammolarga birgalikda
                yechim izlanadi.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-sm font-bold text-brand">3</span>
                <h3 className="font-display text-lg uppercase tracking-wide">
                  Ekotizimni qo&apos;llab-quvvatlash
                </h3>
              </div>
              <p className="text-sm">
                O&apos;zbekiston startap bozoridagi yangiliklar, grantlar, akseleratsiya
                dasturlari va vakansiyalar haqida tezkor ma&apos;lumot almashish.
              </p>
            </div>
          </div>
        </section>

        {/* Kimlar uchun */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            Kimlar uchun?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
                Startap asoschilari
              </h3>
              <p className="text-sm">
                O&apos;z g&apos;oyasini amalga oshirish uchun maslahat yoki jamoa qidirayotgan
                tadbirkorlar.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
                IT mutaxassislari
              </h3>
              <p className="text-sm">
                Texnik ko&apos;nikmalarini oshirmoqchi va sohada yangiliklar bilan tanishmoqchi
                bo&apos;lganlar.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
                Raqamli marketing o&apos;rganuvchilar
              </h3>
              <p className="text-sm">
                Zamonaviy marketing usullari va trendlarini o&apos;rganmoqchi bo&apos;lgan
                yangi boshlovchilar.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
                Talabalar va o&apos;quvchilar
              </h3>
              <p className="text-sm">
                IT sohasiga qiziquvchi va kelajakda texnologiya yo&apos;nalishida ishlashni
                rejalashtiruvchilar.
              </p>
            </div>
          </div>
        </section>

        {/* Afzalliklar */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            Nima uchun qo&apos;shilish kerak?
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
                Mahalliy kontekst
              </h3>
              <p className="text-xs text-muted">
                Barcha muhokamalar O&apos;zbekiston bozori va mentalitetiga moslashtirilgan.
              </p>
            </div>
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
                Sifatli kontent
              </h3>
              <p className="text-xs text-muted">
                Faqat foydali va amaliy ma&apos;lumotlar, keraksiz reklamasiz muhit.
              </p>
            </div>
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
                Bepul va ochiq
              </h3>
              <p className="text-xs text-muted">
                Hamjamiyatga qo&apos;shilish va barcha resurslardan foydalanish to&apos;liq bepul.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            Ko&apos;p beriladigan savollar
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
            Stepolog hamjamiyatiga qo&apos;shiling!
          </p>
          <p className="mt-2 text-sm text-muted">
            Raqamli o&apos;zgarishlarning bir qismiga aylaning.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="https://t.me/stepolog"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-brand px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand/90"
            >
              Telegram kanalga qo&apos;shilish
            </a>
            <Link
              href="/kasblar"
              className="rounded-lg border border-border px-6 py-2.5 text-sm font-bold text-foreground transition-colors hover:border-brand/40"
            >
              Kasblar xaritasi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
