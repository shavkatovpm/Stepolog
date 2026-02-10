import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { getAllArticles } from "@/lib/content";

export default function Home() {
  const blogArticles = getAllArticles("blog").slice(0, 3);
  const learnArticles = getAllArticles("learn").slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="py-20 text-center md:py-28">
        <div className="mb-5 inline-block rounded-full bg-brand/20 px-4 py-1.5 text-xs font-semibold text-brand-dark">
          O&apos;zbekistondagi birinchi startap platformasi
        </div>
        <h1 className="mb-5 text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl">
          Startapingizni{" "}
          <span className="inline-block rounded-xl bg-brand px-3 py-1">bilim</span>
          {" "}bilan boshlang
        </h1>
        <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-muted md:text-lg">
          Bilim, xizmat va PR — barchasi bir joyda. Startapingizni keyingi bosqichga olib chiqing.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/blog"
            className="rounded-full bg-brand px-7 py-3 text-sm font-bold text-brand-dark shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Blogni o&apos;qish
          </Link>
          <Link
            href="/learn"
            className="rounded-full bg-surface px-7 py-3 text-sm font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            O&apos;rganishni boshlash
          </Link>
        </div>
      </section>

      {/* Nima bu? */}
      <section className="mb-20">
        <h2 className="mb-8 text-center text-2xl font-extrabold md:text-3xl">Stepolog nima?</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl bg-surface p-7 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/20 text-lg font-bold">
              B
            </div>
            <h3 className="mb-2 text-base font-bold">Blog</h3>
            <p className="text-sm leading-relaxed text-muted">
              Startap ochish, biznes yuritish bo&apos;yicha o&apos;zbek tilidagi maqolalar
            </p>
          </div>
          <div className="rounded-2xl bg-surface p-7 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/20 text-lg font-bold">
              O
            </div>
            <h3 className="mb-2 text-base font-bold">O&apos;rganish</h3>
            <p className="text-sm leading-relaxed text-muted">
              Foydali bilimlar — startap boshlash, xatolardan qochish, o&apos;sish strategiyalari
            </p>
          </div>
        </div>
      </section>

      {/* So'nggi blog maqolalar */}
      {blogArticles.length > 0 && (
        <section className="mb-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold md:text-3xl">So&apos;nggi maqolalar</h2>
              <p className="mt-1 text-sm text-muted">Startaplar haqida yangliklar va tahlillar</p>
            </div>
            <Link href="/blog" className="hidden text-sm font-semibold text-muted transition-colors hover:text-foreground sm:block">
              Barchasi →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {blogArticles.map((article) => (
              <ArticleCard key={article.slug} {...article} type="blog" />
            ))}
          </div>
          <Link href="/blog" className="mt-5 block text-center text-sm font-semibold text-muted sm:hidden">
            Barcha maqolalar →
          </Link>
        </section>
      )}

      {/* So'nggi o'rganish maqolalar */}
      {learnArticles.length > 0 && (
        <section className="mb-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold md:text-3xl">O&apos;rganish materiallari</h2>
              <p className="mt-1 text-sm text-muted">Startap boshlash bo&apos;yicha qo&apos;llanmalar</p>
            </div>
            <Link href="/learn" className="hidden text-sm font-semibold text-muted transition-colors hover:text-foreground sm:block">
              Barchasi →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {learnArticles.map((article) => (
              <ArticleCard key={article.slug} {...article} type="learn" />
            ))}
          </div>
          <Link href="/learn" className="mt-5 block text-center text-sm font-semibold text-muted sm:hidden">
            Barcha materiallar →
          </Link>
        </section>
      )}

      {/* CTA */}
      <section className="mb-8 overflow-hidden rounded-3xl bg-brand p-10 text-center md:p-14">
        <h2 className="mb-3 text-2xl font-extrabold text-brand-dark md:text-3xl">
          Startapingiz haqida yozamizmi?
        </h2>
        <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-brand-dark/60">
          Biz bilan bog&apos;laning — startapingiz haqida bepul maqola yozamiz va minglab o&apos;quvchilarga yetkazamiz
        </p>
        <Link
          href="/contact"
          className="inline-block rounded-full bg-brand-dark px-8 py-3.5 text-sm font-bold text-brand shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          Bog&apos;lanish
        </Link>
      </section>
    </div>
  );
}
