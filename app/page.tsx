import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { getAllArticles } from "@/lib/content";

export default function Home() {
  const blogArticles = getAllArticles("blog").slice(0, 3);
  const learnArticles = getAllArticles("learn").slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative mb-20 overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-brand to-yellow-300">
        {/* Decorative */}
        <div className="pointer-events-none absolute left-6 top-8 h-16 w-16 rounded-full bg-white/20 animate-float md:h-20 md:w-20" />
        <div className="pointer-events-none absolute right-8 top-14 h-10 w-10 rounded-full bg-white/15 animate-float animation-delay-200 md:right-12 md:top-16 md:h-12 md:w-12" />
        <div className="pointer-events-none absolute bottom-36 left-1/4 h-12 w-12 rounded-full bg-white/10 animate-float animation-delay-400 md:bottom-40 md:h-16 md:w-16" />

        {/* Top: text content */}
        <div className="relative z-10 px-6 pb-6 pt-14 text-center md:px-16 md:pb-8 md:pt-24">
          <div className="animate-fade-up mb-4 inline-block rounded-full bg-brand-dark/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-dark md:mb-5 md:px-5 md:py-2">
            O&apos;zbekistondagi birinchi startap platformasi
          </div>
          <h1 className="animate-fade-up animation-delay-100 mb-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-brand-dark md:mb-5 md:text-6xl">
            Startapingizni{" "}
            <span className="relative inline-block">
              <span className="relative z-10">bilim</span>
              <span className="absolute bottom-0.5 left-0 -z-0 h-2.5 w-full rounded bg-brand-dark/15 md:bottom-1 md:h-4" />
            </span>
            {" "}bilan boshlang
          </h1>
          <p className="animate-fade-up animation-delay-200 mx-auto max-w-lg text-base leading-relaxed text-brand-dark/60 md:text-lg">
            Bilim va yangiliklar — barchasi bir joyda. Yo&apos;nalishingizni tanlang.
          </p>
        </div>

        {/* Bottom: 2 direction cards */}
        <div className="relative z-10 animate-fade-up animation-delay-300 grid grid-cols-1 gap-4 px-5 pb-7 sm:grid-cols-2 md:gap-5 md:px-10 md:pb-10">
          {/* Blog card */}
          <Link href="/blog" className="group relative overflow-hidden rounded-2xl bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl">
            <div className="flex items-start gap-4 p-5 md:p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-dark/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-dark/15 md:h-14 md:w-14">
                <svg className="h-6 w-6 text-brand-dark md:h-7 md:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 text-base font-bold text-brand-dark md:text-lg">Startap yangiliklari</h3>
                <p className="mb-3 text-sm leading-relaxed text-brand-dark/50 md:text-sm">
                  Eng so&apos;nggi yangiliklar, tahlillar va muvaffaqiyat hikoyalari
                </p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-dark/70 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-dark">
                  Maqolalarni o&apos;qish
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-brand-dark/30 to-brand-dark/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>

          {/* O'rganish card */}
          <Link href="/learn" className="group relative overflow-hidden rounded-2xl bg-brand-dark/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-brand-dark hover:shadow-xl">
            <div className="flex items-start gap-4 p-5 md:p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20 md:h-14 md:w-14">
                <svg className="h-6 w-6 text-brand md:h-7 md:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 text-base font-bold text-white md:text-lg">Startap yo&apos;li</h3>
                <p className="mb-3 text-sm leading-relaxed text-white/50 md:text-sm">
                  G&apos;oyadan mahsulotgacha — bosqichma-bosqich qo&apos;llanmalar
                </p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-brand transition-all duration-300 group-hover:translate-x-1">
                  O&apos;rganishni boshlash
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-brand/50 to-brand/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>
        </div>
      </section>

      {/* So'nggi blog maqolalar */}
      {blogArticles.length > 0 && (
        <section className="mb-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="mb-2 inline-block rounded-full bg-brand/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-dark">
                Blog
              </span>
              <h2 className="text-2xl font-extrabold md:text-3xl">So&apos;nggi maqolalar</h2>
              <p className="mt-1 text-sm text-muted">Startaplar haqida yangliklar va tahlillar</p>
            </div>
            <Link href="/blog" className="hidden rounded-full bg-surface px-5 py-2.5 text-sm font-semibold text-muted shadow-sm transition-all hover:-translate-y-0.5 hover:text-foreground hover:shadow-md sm:block">
              Barchasi &rarr;
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {blogArticles.map((article) => (
              <ArticleCard key={article.slug} {...article} type="blog" />
            ))}
          </div>
          <Link href="/blog" className="mt-6 block text-center text-sm font-semibold text-muted sm:hidden">
            Barcha maqolalar &rarr;
          </Link>
        </section>
      )}

      {/* So'nggi o'rganish maqolalar */}
      {learnArticles.length > 0 && (
        <section className="mb-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="mb-2 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent">
                O&apos;rganish
              </span>
              <h2 className="text-2xl font-extrabold md:text-3xl">O&apos;rganish materiallari</h2>
              <p className="mt-1 text-sm text-muted">Startap boshlash bo&apos;yicha qo&apos;llanmalar</p>
            </div>
            <Link href="/learn" className="hidden rounded-full bg-surface px-5 py-2.5 text-sm font-semibold text-muted shadow-sm transition-all hover:-translate-y-0.5 hover:text-foreground hover:shadow-md sm:block">
              Barchasi &rarr;
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {learnArticles.map((article) => (
              <ArticleCard key={article.slug} {...article} type="learn" />
            ))}
          </div>
          <Link href="/learn" className="mt-6 block text-center text-sm font-semibold text-muted sm:hidden">
            Barcha materiallar &rarr;
          </Link>
        </section>
      )}

      {/* CTA */}
      <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark via-brand-dark to-gray-800 p-10 text-center md:p-16">
        {/* Decorative */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-brand/10 animate-pulse-soft" />
        <div className="pointer-events-none absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-brand/10 animate-pulse-soft animation-delay-200" />

        <div className="relative z-10">
          <h2 className="mb-4 text-2xl font-extrabold text-white md:text-3xl">
            Startapingiz haqida yozamizmi?
          </h2>
          <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-white/60">
            Biz bilan bog&apos;laning — startapingiz haqida bepul maqola yozamiz va minglab o&apos;quvchilarga yetkazamiz
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-full bg-brand px-8 py-3.5 text-sm font-bold text-brand-dark shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            Bog&apos;lanish
          </Link>
        </div>
      </section>
    </div>
  );
}
