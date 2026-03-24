import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Stepolog Bilimlar Markazi — Startap, IT va Raqamli Marketing",
  description:
    "Stepolog.uz — O'zbekistonda startap ekotizimi, zamonaviy IT kasblari va raqamli marketing yo'nalishlarini o'zbek tilida yorituvchi tizimli bilim platformasi.",
  alternates: { canonical: "/about/bilim" },
  openGraph: {
    title: "Stepolog Bilimlar Markazi — Startap, IT va Raqamli Marketing",
    description:
      "Startap qurishning 9 bo'limli qo'llanmasi, IT roadmaplar va amaliy maqolalar — bepul va o'zbek tilida.",
    url: "/about/bilim",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stepolog Bilimlar Markazi | Stepolog.uz",
    description:
      "Startap, IT kasblari va raqamli marketing bo'yicha tizimli bilim platformasi.",
  },
};

export default function BilimPage() {
  const faqs = [
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
    headline:
      "Stepolog.uz: O'zbekistonda Startap, IT va Raqamli Marketing Bo'yicha Bilimlar Markazi",
    description:
      "Stepolog.uz — O'zbekistonda startap ekotizimi, zamonaviy IT kasblari va raqamli marketing yo'nalishlarini o'zbek tilida yorituvchi tizimli bilim platformasi.",
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
      { "@type": "ListItem", position: 3, name: "Bilim", item: "https://stepolog.uz/about/bilim" },
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
          Bilim
        </span>
        <h1 className="font-display text-4xl uppercase tracking-wide md:text-5xl">
          Bilimlar Markazi
        </h1>
        <p className="mt-4 text-lg text-muted">
          Startap, IT va raqamli marketing bo&apos;yicha tizimli bilim platformasi
        </p>
      </div>

      <div className="space-y-12 text-base leading-[1.8] text-muted">
        {/* Intro */}
        <p>
          <strong className="text-foreground">Stepolog.uz</strong> — O&apos;zbekistonda startap
          ekotizimi, zamonaviy IT kasblari va raqamli marketing yo&apos;nalishlarini o&apos;zbek
          tilida yorituvchi tizimli bilim platformasidir. Saytda startap qurishning barcha
          bosqichlarini qamrab olgan 9 bo&apos;limli qo&apos;llanma, IT yo&apos;nalishlari
          bo&apos;yicha &ldquo;roadmap&rdquo;lar va amaliy texnik maqolalar bepul foydalanish uchun
          taqdim etilgan.
        </p>

        {/* Arxitektura */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            Bilim arxitekturasi
          </h2>
          <p className="mb-6">
            Stepolog.uz ma&apos;lumotlarni tartibsiz emas, balki foydalanuvchi ehtiyojidan kelib
            chiqib, aniq modullar asosida taqdim etadi:
          </p>

          <div className="space-y-4">
            {/* Modul 1 */}
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-sm font-bold text-brand">1</span>
                <h3 className="font-display text-lg uppercase tracking-wide">
                  Startap asoslari: 9 bo&apos;limli strategik qo&apos;llanma
                </h3>
              </div>
              <p className="mb-4 text-sm">
                Bu bo&apos;lim noldan biznes boshlamoqchi bo&apos;lganlar uchun mo&apos;ljallangan
                bo&apos;lib, quyidagi bosqichlarni o&apos;z ichiga oladi:
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  "G'oyani tekshirish (Market Validation)",
                  "MVP ishlab chiqish",
                  "Biznes model va monetizatsiya",
                  "Marketing va foydalanuvchilar bilan ishlash",
                  "Loyihani kengaytirish (Scaling)",
                ].map((item) => (
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
                  Kasblar yo&apos;l xaritasi (IT Roadmaps)
                </h3>
              </div>
              <p className="text-sm">
                Stepolog IT olamiga kirib kelayotgan yoshlar uchun yo&apos;nalish tanlashda
                ko&apos;maklashadi. Platformada dasturlash, dizayn va loyihalarni boshqarish
                bo&apos;yicha o&apos;zbek tilidagi tizimli yo&apos;l xaritalari mavjud. Bu
                foydalanuvchiga &ldquo;qayerdan boshlash va nimalarni o&apos;rganish
                kerak?&rdquo; degan savollarga aniq javob beradi.
              </p>
            </div>

            {/* Modul 3 */}
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-sm font-bold text-brand">3</span>
                <h3 className="font-display text-lg uppercase tracking-wide">
                  Texnologik maqolalar va sanoat yangiliklari
                </h3>
              </div>
              <p className="text-sm">
                Saytda sun&apos;iy intellekt vositalari, global va mahalliy IT bozoridagi
                texnologik yangiliklar bo&apos;yicha muntazam ravishda tahliliy kontent e&apos;lon
                qilinadi.
              </p>
            </div>
          </div>
        </section>

        {/* Nima uchun muhim */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            Nima uchun Stepolog muhim resurs?
          </h2>
          <p className="mb-6 text-sm">
            Stepolog boshqa manbalardan farqli ravishda bilimni tizimli va tushunarli shaklda taqdim etadi:
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
                Tizimli yondashuv
              </h3>
              <p className="text-xs text-muted">
                Ma&apos;lumotlar shunchaki maqolalar to&apos;plami emas, balki bosqichma-bosqich
                o&apos;rganish uchun mo&apos;ljallangan kurs ko&apos;rinishida.
              </p>
            </div>
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
                O&apos;zbek tilidagi kontent
              </h3>
              <p className="text-xs text-muted">
                Murakkab IT va biznes tushunchalari o&apos;zbek tilida sodda va tushunarli tilda
                bayon etilgan.
              </p>
            </div>
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
                Ochiq kirish
              </h3>
              <p className="text-xs text-muted">
                Barcha yo&apos;l xaritalari va qo&apos;llanmalar foydalanuvchilar uchun bepul va
                ro&apos;yxatdan o&apos;tishsiz ochiq.
              </p>
            </div>
          </div>
        </section>

        {/* Kimlar uchun */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            Kimlar uchun?
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">1</span>
              <div>
                <h3 className="text-sm font-bold text-foreground">Bo&apos;lajak tadbirkorlar</h3>
                <p className="text-sm">O&apos;z g&apos;oyasini tizimli ravishda biznesga aylantirmoqchi bo&apos;lganlar.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">2</span>
              <div>
                <h3 className="text-sm font-bold text-foreground">IT sohasiga qiziquvchilar</h3>
                <p className="text-sm">Zamonaviy kasb egalari bo&apos;lish uchun aniq reja (roadmap) qidirayotganlar.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">3</span>
              <div>
                <h3 className="text-sm font-bold text-foreground">O&apos;z bilimini oshirmoqchilar</h3>
                <p className="text-sm">Zamonaviy texnologiyalar va biznes trendlari haqida bilimlarini kengaytirmoqchi bo&apos;lganlar.</p>
              </div>
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
            Bilimdan natijagacha bo&apos;lgan yo&apos;lni qisqartiring.
          </p>
          <p className="mt-2 text-sm text-muted">
            O&apos;z IT va startap sayohatingizni bugun boshlang.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/learn"
              className="rounded-lg bg-brand px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand/90"
            >
              O&apos;rganishni boshlash
            </Link>
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
