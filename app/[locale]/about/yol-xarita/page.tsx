import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stepolog Kasblar Xaritasi — IT va Raqamli Kasblarni Egallash Rejasi",
  description:
    "Stepolog Kasblar Xaritasi — IT va raqamli marketing sohasiga kirib kelayotgan yangi boshlovchilar uchun bosqichma-bosqich bepul yo'l xaritalari.",
  alternates: { canonical: "/about/yol-xarita" },
  openGraph: {
    title: "Stepolog Kasblar Xaritasi — IT va Raqamli Kasblarni Egallash Rejasi",
    description:
      "Frontend, UI/UX, SEO va boshqa zamonaviy kasblar uchun o'zbek tilidagi bepul roadmaplar.",
    url: "/about/yol-xarita",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stepolog Kasblar Xaritasi | Stepolog.uz",
    description:
      "IT va raqamli kasblarni egallash uchun bosqichma-bosqich bepul yo'l xaritalari.",
  },
};

export default function YolXaritaPage() {
  const faqs = [
    {
      q: "IT sohasini o'rganishni nimadan boshlash kerak?",
      a: "Stepolog.uz saytidagi \"Kasblar Xaritasi\" bo'limiga o'tib, o'zingizga qiziq bo'lgan yo'nalishni tanlang. U yerda noldan boshlash uchun barcha bosqichlar ko'rsatilgan.",
    },
    {
      q: "Stepolog yo'l xaritalari pullikmi?",
      a: "Yo'q, barcha yo'nalishlar bo'yicha yo'l xaritalari (Frontend, UI/UX, SEO va boshqalar) mutlaqo bepul taqdim etiladi.",
    },
    {
      q: "Qaysi IT kasbi menga mosligini qanday bilsam bo'ladi?",
      a: "Stepologdagi har bir yo'l xaritasi boshida o'sha kasb egalari nima ish qilishi va qanday qobiliyatlar kerakligi haqida qisqacha ma'lumot berilgan. Bu sizga to'g'ri tanlov qilishda yordam beradi.",
    },
    {
      q: "O'zbek tilida IT va Digital Marketing roadmaplari bormi?",
      a: "Ha, Stepolog O'zbekistonda birinchilardan bo'lib IT kasblari va raqamli marketing yo'nalishlari bo'yicha zamonaviy va amaliy yo'l xaritalarini o'zbek tilida taqdim etgan.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Stepolog Kasblar Xaritasi: Zamonaviy IT va Raqamli Kasblarni Egallash Rejasi",
    description:
      "Stepolog Kasblar Xaritasi — IT va raqamli marketing sohasiga kirib kelayotgan yangi boshlovchilar uchun bosqichma-bosqich bepul yo'l xaritalari.",
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
      { "@type": "ListItem", position: 3, name: "Yo'l xarita", item: "https://stepolog.uz/about/yol-xarita" },
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
          Yo&apos;l xarita
        </span>
        <h1 className="font-display text-4xl uppercase tracking-wide md:text-5xl">
          Kasblar Xaritasi
        </h1>
        <p className="mt-4 text-lg text-muted">
          Zamonaviy IT va raqamli kasblarni egallash uchun bosqichma-bosqich reja
        </p>
      </div>

      <div className="space-y-12 text-base leading-[1.8] text-muted">
        {/* Intro */}
        <p>
          <strong className="text-foreground">Stepolog Kasblar Xaritasi</strong> — bu IT va
          raqamli marketing sohasiga kirib kelayotgan yangi boshlovchilar uchun yaratilgan,
          qaysi yo&apos;nalishni tanlash va uni qanday o&apos;rganishni bosqichma-bosqich
          ko&apos;rsatib beruvchi bepul navigatsiya tizimidir. Platformada Frontend dasturchi,
          UI/UX dizayner, SEO mutaxassisi va raqamli marketolog kabi o&apos;nlab zamonaviy
          kasblar uchun o&apos;zbek tilidagi mukammal yo&apos;l xaritalari jamlangan.
        </p>

        {/* Nima uchun */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            Nima uchun yo&apos;l xaritasidan foydalanish kerak?
          </h2>
          <p className="mb-6">
            Axborot juda ko&apos;p, lekin uni qaysi tartibda o&apos;rganishni bilmaslik
            ko&apos;pchilikni to&apos;xtatib qo&apos;yadi. Stepolog ushbu muammoni hal qiladi:
          </p>
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-sm font-bold text-brand">1</span>
                <h3 className="font-display text-lg uppercase tracking-wide">
                  Noldan professional darajagacha
                </h3>
              </div>
              <p className="text-sm">
                Har bir yo&apos;nalish uchun o&apos;rganilishi kerak bo&apos;lgan texnologiyalar,
                vositalar va ko&apos;nikmalar mantiqiy ketma-ketlikda joylashtirilgan. Masalan,
                Frontend yo&apos;nalishida HTML/CSS dan boshlab, JavaScript va React-gacha
                bo&apos;lgan yo&apos;l aniq chizib berilgan.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-sm font-bold text-brand">2</span>
                <h3 className="font-display text-lg uppercase tracking-wide">
                  Eng talabgir kasblar
                </h3>
              </div>
              <p className="mb-4 text-sm">
                Platforma bozorda eng yuqori talab va kelajagi porloq yo&apos;nalishlarni
                qamrab oladi:
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { name: "Frontend Developer", desc: "Veb-saytlarning vizual qismini yaratish" },
                  { name: "UI/UX Designer", desc: "Foydalanuvchi interfeysi va tajribasini loyihalash" },
                  { name: "SEO Specialist", desc: "Qidiruv tizimlarida saytni yuqoriga olib chiqish" },
                  { name: "Digital Marketing", desc: "Raqamli sotuv va brendni rivojlantirish" },
                  { name: "Product Manager", desc: "IT loyihalarni boshqarish" },
                ].map((career) => (
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
                  Bepul va tizimli kontent
                </h3>
              </div>
              <p className="text-sm">
                Barcha yo&apos;l xaritalari ochiq va bepul — foydalanuvchidan hech qanday
                to&apos;lov talab etilmaydi. Bu Stepologning &ldquo;Bilim hamma
                uchun&rdquo; missiyasining amaliy ko&apos;rinishidir.
              </p>
            </div>
          </div>
        </section>

        {/* Kimlar uchun */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            Kimlar uchun?
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
                Kasb tanlay olmayotganlar
              </h3>
              <p className="text-sm">
                Qaysi yo&apos;nalish o&apos;z qiziqishlariga mosligini tushunishni istaganlar.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
                Mustaqil o&apos;rganuvchilar
              </h3>
              <p className="text-sm">
                Kurslarga bormasdan, tizimli reja asosida bilim olmoqchi bo&apos;lganlar.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
                Sohasini o&apos;zgartiruvchilar
              </h3>
              <p className="text-sm">
                Boshqa sohadan IT-ga xatolarsiz va tezroq o&apos;tishni maqsad qilganlar.
              </p>
            </div>
          </div>
        </section>

        {/* Afzalliklar */}
        <section>
          <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">
            Nima uchun Stepolog yo&apos;l xaritasi?
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
                Tizimli struktura
              </h3>
              <p className="text-xs text-muted">
                Har bir kasb aniq bosqichlarga bo&apos;lingan — nima o&apos;rganish kerakligini
                taxmin qilish shart emas.
              </p>
            </div>
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
                Mahalliy kontekst
              </h3>
              <p className="text-xs text-muted">
                O&apos;zbekiston bozorida talab qilinayotgan texnologiyalar va ko&apos;nikmalar
                inobatga olingan.
              </p>
            </div>
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-foreground">
                Bepul va ochiq
              </h3>
              <p className="text-xs text-muted">
                Barcha yo&apos;l xaritalari ro&apos;yxatdan o&apos;tishsiz va to&apos;lovsiz
                ochiq.
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
            To&apos;g&apos;ri tanlov — muvaffaqiyat garovi
          </p>
          <p className="mt-2 text-sm text-muted">
            Vaqtingizni noto&apos;g&apos;ri yo&apos;nalishda sarflamang — o&apos;z xaritangizni toping.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/kasblar"
              className="rounded-lg bg-brand px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand/90"
            >
              Kasblar xaritasini ko&apos;rish
            </Link>
            <Link
              href="/learn"
              className="rounded-lg border border-border px-6 py-2.5 text-sm font-bold text-foreground transition-colors hover:border-brand/40"
            >
              Startap asoslari
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
