import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Stepolog Nima? — Missiya va Maqsadlar",
  description:
    "Stepolog — O'zbekistonda startap ekotizimini rivojlantirish va IT kasblari bo'yicha bepul amaliy bilim beruvchi platforma.",
  alternates: { canonical: "/about/missiya" },
  openGraph: {
    title: "Stepolog Nima? — Missiya va Maqsadlar",
    description:
      "O'zbekistondagi startaplar va IT kasblari uchun raqamli ekotizim.",
    url: "/about/missiya",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stepolog Nima? | Stepolog.uz",
    description:
      "O'zbekistondagi startaplar va IT kasblari uchun raqamli ekotizim.",
  },
};

export default function MissiyaPage() {
  const faqs = [
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
    headline:
      "Stepolog Nima? O'zbekistondagi Startaplar va IT Kasblari Uchun Raqamli Ekotizim",
    description:
      "Stepolog — O'zbekistonda startap ekotizimini rivojlantirish va IT kasblari bo'yicha bepul amaliy bilim beruvchi platforma.",
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
      { "@type": "ListItem", position: 3, name: "Missiya", item: "https://stepolog.uz/about/missiya" },
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
          Missiya
        </span>
        <h1 className="font-display text-4xl uppercase tracking-wide md:text-5xl">
          Stepolog Nima?
        </h1>
        <p className="mt-4 text-lg text-muted">
          O&apos;zbekistondagi startaplar va IT kasblari uchun raqamli ekotizim
        </p>
      </div>

      <div className="space-y-12 text-base leading-[1.8] text-muted">
        {/* Intro */}
        <p>
          <strong className="text-foreground">Stepolog</strong> — bu O&apos;zbekistonda startap
          ekotizimini rivojlantirish, IT kasblari bo&apos;yicha amaliy bilim berish va raqamli
          marketing asoslarini o&apos;rgatishga bag&apos;ishlangan bepul bilim platformasidir.
          Loyiha yangi boshlovchilar, yosh tadbirkorlar va IT mutaxassislariga bosqichma-bosqich
          bilim va yo&apos;l xaritalarini taqdim etadi.
        </p>

        {/* Missiya */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            Missiya va strategik maqsadlar
          </h2>
          <p>
            Bugungi tez o&apos;zgaruvchan raqamli dunyoda nazariy bilimning o&apos;zi yetarli emas.
            Stepolog missiyasi — har bir foydalanuvchiga amaliy bilim berib, ularni aniq natijaga
            olib chiqishdir. Platforma shunchaki ma&apos;lumot beruvchi blog emas, balki
            g&apos;oyadan tortib to tayyor mahsulotgacha bo&apos;lgan yo&apos;lni
            bosqichma-bosqich ko&apos;rsatib beruvchi bepul ta&apos;lim tizimdir.
          </p>
        </section>

        {/* Platformada nimalar bor */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            Platformada nimalar bor?
          </h2>
          <p className="mb-6">
            Stepolog platformasi yangi boshlovchilar va tajribali mutaxassislar uchun bilimlar
            xaritasi vazifasini o&apos;taydi.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-2 font-display text-lg uppercase tracking-wide">
                Startap asoslari
              </h3>
              <p className="text-sm">
                G&apos;oyani tekshirish (validation), minimal hayotiy mahsulot (MVP) yaratish
                va birinchi foydalanuvchilarni topish — bosqichma-bosqich qo&apos;llanmalar.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-2 font-display text-lg uppercase tracking-wide">
                Kasblar xaritasi
              </h3>
              <p className="text-sm">
                Dasturlash, dizayn, loyihalar boshqaruvi va raqamli marketing
                yo&apos;nalishlarida junior darajadan senior darajagacha o&apos;sish yo&apos;llari.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-2 font-display text-lg uppercase tracking-wide">
                Raqamli marketing asoslari
              </h3>
              <p className="text-sm">
                SEO, AEO, kontent strategiyasi va ijtimoiy tarmoqlar orqali onlayn
                biznesni o&apos;stirish bo&apos;yicha amaliy bilimlar.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-2 font-display text-lg uppercase tracking-wide">
                AI davrida biznes yuritish
              </h3>
              <p className="text-sm">
                Sun&apos;iy intellekt vositalari yordamida biznes jarayonlarini soddalashtirish
                va samaradorlikni oshirish yo&apos;llari.
              </p>
            </div>
          </div>
        </section>

        {/* Kimlar uchun */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            Stepolog kimlar uchun?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
                Bo&apos;lajak startapchilar
              </h3>
              <p className="text-sm">
                O&apos;z g&apos;oyasini biznesga aylantirmoqchi bo&apos;lgan yosh tadbirkorlar.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
                IT-mutaxassislar
              </h3>
              <p className="text-sm">
                O&apos;z sohasida malaka oshirishni yoki yangi kasb egallashni xohlovchilar.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
                Kichik va o&apos;rta biznes
              </h3>
              <p className="text-sm">
                Raqamli dunyoda o&apos;z biznesini rivojlantirish va zamonaviy marketing
                asoslarini o&apos;rganmoqchi bo&apos;lganlar.
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
            Stepolog bilan kelajakni bugun quring.
          </p>
          <p className="mt-2 text-sm text-muted">
            Biz bilan o&apos;sish — bu shunchaki qadamlar ketma-ketligi.
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
