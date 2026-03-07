import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import AnimatedLogo from "@/components/AnimatedLogo";
import { getAllArticles } from "@/lib/content";

export default function Home() {
  const blogArticles = getAllArticles("blog").slice(0, 3);
  const learnArticles = getAllArticles("learn").slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-5 py-32 text-center sm:py-40 md:py-48 lg:py-56">
        <h1 className="animate-slide-right font-display text-[clamp(72px,10vw,140px)] leading-[0.9] tracking-[.02em]">
          STEP<span className="text-brand">OLOG</span>
        </h1>

        {/* Animated logo with rotating text */}
        <AnimatedLogo className="animate-fade-up mt-6" />

        <p className="animate-fade-up mt-7 font-display text-2xl uppercase tracking-wide text-foreground md:text-4xl" style={{ maxWidth: "clamp(288px, 40vw, 560px)" }}>
          Startap va digital<br className="md:hidden" /> ekotizim platformasi
        </p>

        <div className="animate-fade-up mt-12 flex gap-3">
          <Link
            href="/learn"
            className="rounded-md border border-border bg-background px-5 py-2.5 text-sm font-bold text-foreground transition-all hover:border-brand hover:text-brand"
          >
            Startup asoslari
          </Link>
          <Link
            href="/kasblar"
            className="rounded-md border border-border bg-background px-5 py-2.5 text-sm font-bold text-foreground transition-all hover:border-brand hover:text-brand"
          >
            Kasblar xaritasi
          </Link>
        </div>

      </section>

      {/* Content sections */}
      <div className="mx-auto max-w-5xl px-5 py-20">
        {/* So'nggi blog maqolalar */}
        {blogArticles.length > 0 && (
          <section className="mb-20">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-display text-3xl uppercase tracking-wide md:text-4xl">So&apos;nggi maqolalar</h2>
                <p className="mt-1 text-sm text-muted">Startaplar haqida yangliklar va tahlillar</p>
              </div>
              <Link href="/blog" className="hidden text-sm font-semibold text-muted transition-colors hover:text-foreground sm:block">
                Barchasi &rarr;
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {blogArticles.map((article) => (
                <ArticleCard key={article.slug} {...article} type="blog" />
              ))}
            </div>
            <Link href="/blog" className="mt-5 block text-center text-sm font-semibold text-muted sm:hidden">
              Barcha maqolalar &rarr;
            </Link>
          </section>
        )}

        {/* So'nggi o'rganish maqolalar */}
        {learnArticles.length > 0 && (
          <section className="mb-20">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-display text-3xl uppercase tracking-wide md:text-4xl">O&apos;rganish materiallari</h2>
                <p className="mt-1 text-sm text-muted">Startap boshlash bo&apos;yicha qo&apos;llanmalar</p>
              </div>
              <Link href="/learn" className="hidden text-sm font-semibold text-muted transition-colors hover:text-foreground sm:block">
                Barchasi &rarr;
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {learnArticles.map((article) => (
                <ArticleCard key={article.slug} {...article} type="learn" />
              ))}
            </div>
            <Link href="/learn" className="mt-5 block text-center text-sm font-semibold text-muted sm:hidden">
              Barcha materiallar &rarr;
            </Link>
          </section>
        )}

        {/* CTA */}
        <section className="mb-8 overflow-hidden rounded-2xl bg-brand p-10 text-center md:p-14">
          <h2 className="mb-3 font-display text-3xl uppercase tracking-wide text-brand-dark md:text-4xl">
            Startapingiz haqida yozamizmi?
          </h2>
          <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-brand-dark/60">
            Biz bilan bog&apos;laning — startapingiz haqida bepul maqola yozamiz va minglab o&apos;quvchilarga yetkazamiz
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-md bg-brand-dark px-8 py-3.5 text-sm font-bold text-brand transition-all hover:-translate-y-[3px] hover:shadow-lg"
          >
            Bog&apos;lanish
          </Link>
        </section>
      </div>
    </div>
  );
}
