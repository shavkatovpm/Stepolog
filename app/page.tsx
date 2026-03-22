import Link from "next/link";
import AnimatedLogo from "@/components/AnimatedLogo";
import StepologLogo from "@/components/StepologLogo";
import { learnCategories } from "@/lib/learn-categories";
import { careers, levelColor } from "@/lib/careers";

const homeCareers = careers.slice(0, 4);

const homeCategories = learnCategories.slice(0, 4);

export default function Home() {
  return (
    <div>
      {/* 1. Hero */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-5 pt-[6.4rem] pb-32 text-center sm:pt-32 sm:pb-40 md:pt-[9.6rem] md:pb-48 lg:pt-[11.2rem] lg:pb-56">
        <AnimatedLogo className="animate-fade-up" />

        <h1 className="animate-slide-right mt-6 font-display text-[clamp(72px,10vw,140px)] leading-[0.9] tracking-[.02em]">
          STEP<span className="text-brand">OLOG</span>
        </h1>

        <p className="animate-fade-up mt-7 font-display text-2xl uppercase tracking-wide text-foreground md:text-4xl" style={{ maxWidth: "clamp(288px, 40vw, 560px)" }}>
          Bepul bilim<br className="md:hidden" /> platformasi
        </p>

        <div className="animate-fade-up mt-12 flex gap-3">
          <Link
            href="/learn"
            className="rounded-md border border-border bg-background px-5 py-2.5 text-sm font-bold text-foreground transition-all hover:border-brand hover:text-brand"
          >
            Startap asoslari
          </Link>
          <Link
            href="/kasblar"
            className="rounded-md border border-border bg-background px-5 py-2.5 text-sm font-bold text-foreground transition-all hover:border-brand hover:text-brand"
          >
            Kasblar xaritasi
          </Link>
        </div>
      </section>

      {/* 2. STEPOLOG kim? */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-5xl px-5 py-24 md:py-32">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">Biz haqimizda</span>
              <h2 className="font-display text-4xl uppercase tracking-wide md:text-5xl">
                STEPOLOG<br />kim?
              </h2>
              <p className="mt-6 leading-relaxed text-muted">
                Stepolog — O&apos;zbekiston digital ekotizimi uchun bepul bilim platformasi.
                Startaplar, kasblar xaritasi va foydali maqolalar orqali
                yosh tadbirkorlar va IT mutaxassislariga bilim beramiz.
              </p>
              <Link
                href="/about"
                className="mt-8 inline-block text-sm font-bold text-foreground transition-colors hover:text-brand"
              >
                Batafsil &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-surface p-6">
                <div className="mb-3 font-display text-3xl text-brand">01</div>
                <h3 className="mb-1 text-sm font-bold uppercase tracking-wide">Bilim</h3>
                <p className="text-xs leading-relaxed text-muted">Startap asoslari va IT loyihalar bo&apos;yicha materiallar</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-6">
                <div className="mb-3 font-display text-3xl text-brand">02</div>
                <h3 className="mb-1 text-sm font-bold uppercase tracking-wide">Amaliyot</h3>
                <p className="text-xs leading-relaxed text-muted">Real loyihalar ustida ishlash va tajriba orttirish</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-6">
                <div className="mb-3 font-display text-3xl text-brand">03</div>
                <h3 className="mb-1 text-sm font-bold uppercase tracking-wide">Investitsiya</h3>
                <p className="text-xs leading-relaxed text-muted">Startaplarga investitsiya jalb qilish va rivojlantirish</p>
              </div>
              <div className="flex items-center justify-center rounded-xl border border-brand/20 bg-brand/5 p-6">
                <StepologLogo size={64} className="text-brand" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Kasblar xaritasi */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-5xl px-5 py-24 md:py-32">
          <div className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">Kasblar</span>
              <h2 className="font-display text-4xl uppercase tracking-wide md:text-5xl">Kasblar xaritasi</h2>
              <p className="mt-4 max-w-lg text-muted">
                IT sohasidagi asosiy yo&apos;nalishlar — qaysi kasbni tanlash va nimalarni o&apos;rganish kerak
              </p>
            </div>
            <Link
              href="/kasblar"
              className="text-sm font-bold text-foreground transition-colors hover:text-brand"
            >
              Barchasi &rarr;
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {homeCareers.map((career) => (
              <Link
                key={career.slug}
                href={`/kasblar/${career.slug}`}
                className="group rounded-xl border border-border bg-surface p-6 transition-all hover:border-brand/40"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-display text-xl uppercase tracking-wide">
                    {career.title}
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${levelColor[career.level]}`}
                  >
                    {career.level}
                  </span>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-muted">
                  {career.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {career.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-strong"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Startap asoslari */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-5xl px-5 py-24 md:py-32">
          <div className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">O&apos;rganish</span>
              <h2 className="font-display text-4xl uppercase tracking-wide md:text-5xl">Startap asoslari</h2>
              <p className="mt-4 max-w-lg text-muted">
                G&apos;oyadan mahsulotgacha — bosqichma-bosqich qo&apos;llanmalar va bilimlar
              </p>
            </div>
            <Link
              href="/learn"
              className="text-sm font-bold text-foreground transition-colors hover:text-brand"
            >
              Barchasi &rarr;
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {homeCategories.map((cat) => (
              <Link
                key={cat.number}
                href="/learn"
                className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-brand/40"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-display text-xl uppercase tracking-wide">
                    {cat.title}
                  </h3>
                  <span className="font-display text-3xl text-brand/20 transition-colors group-hover:text-brand">
                    {cat.number}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
