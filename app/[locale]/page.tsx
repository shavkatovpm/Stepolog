import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import AnimatedLogo from "@/components/AnimatedLogo";
import StepologLogo from "@/components/StepologLogo";
import SocialModal, { SocialPopup } from "@/components/SocialModal";
import { getLearnCategories } from "@/lib/learn-categories";
import { getCareers, getLevelLabels, levelColor } from "@/lib/careers";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("home");

  const careers = getCareers(locale);
  const homeCareers = careers.filter((c) =>
    ["frontend-developer", "ui-ux-designer", "seo-specialist", "digital-marketing"].includes(c.slug)
  );
  const homeCategories = getLearnCategories(locale).slice(0, 4);
  const levelLabels = getLevelLabels(locale);

  return (
    <div>
      <SocialPopup />
      {/* 1. Hero */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-5 pt-[6.4rem] pb-32 text-center sm:pt-32 sm:pb-40 md:pt-[9.6rem] md:pb-48 lg:pt-[11.2rem] lg:pb-56">
        <h1 className="animate-slide-right font-display text-[clamp(72px,10vw,140px)] leading-[0.9] tracking-[.02em]">
          STEP<span className="text-brand">OLOG</span>
        </h1>

        <AnimatedLogo className="animate-fade-up mt-6" />

        <p className="animate-fade-up mt-7 font-display text-2xl uppercase tracking-wide text-foreground md:text-4xl" style={{ maxWidth: "clamp(288px, 50vw, 640px)" }}>
          {t("subtitle")}
        </p>

        <div className="animate-fade-up mt-12 flex gap-3">
          <Link
            href="/learn"
            className="rounded-md border border-border bg-background px-5 py-2.5 text-sm font-bold text-foreground transition-all hover:border-brand hover:text-brand"
          >
            {t("learnButton")}
          </Link>
          <Link
            href="/kasblar"
            className="rounded-md border border-border bg-background px-5 py-2.5 text-sm font-bold text-foreground transition-all hover:border-brand hover:text-brand"
          >
            {t("careersButton")}
          </Link>
        </div>
      </section>

      {/* 2. STEPOLOG kim? */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-5xl px-5 py-24 md:py-32">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">{t("aboutLabel")}</span>
              <h2 className="font-display text-4xl uppercase tracking-wide md:text-5xl">
                {t("whoTitle")}
              </h2>
              <p className="mt-6 leading-relaxed text-muted">
                {t("whoDescription")}
              </p>
              <Link
                href="/about"
                className="mt-8 inline-block text-sm font-bold text-foreground transition-colors hover:text-brand"
              >
                {t("moreDetails")} &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <a href="#startap-asoslari" className="rounded-xl border border-border bg-surface p-6 transition-all hover:border-brand/40">
                <div className="mb-3 font-display text-3xl text-brand">01</div>
                <h3 className="mb-1 text-sm font-bold uppercase tracking-wide">{t("card01Title")}</h3>
                <p className="text-xs leading-relaxed text-muted">{t("card01Desc")}</p>
              </a>
              <a href="#kasblar" className="rounded-xl border border-border bg-surface p-6 transition-all hover:border-brand/40">
                <div className="mb-3 font-display text-3xl text-brand">02</div>
                <h3 className="mb-1 text-sm font-bold uppercase tracking-wide">{t("card02Title")}</h3>
                <p className="text-xs leading-relaxed text-muted">{t("card02Desc")}</p>
              </a>
              <SocialModal />
              <div className="flex items-center justify-center rounded-xl border border-brand/20 bg-brand/5 p-6">
                <StepologLogo size={64} className="text-brand" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Kasblar xaritasi */}
      <section id="kasblar" className="border-t border-border bg-surface">
        <div className="mx-auto max-w-5xl px-5 py-24 md:py-32">
          <div className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">{t("careersLabel")}</span>
              <h2 className="font-display text-4xl uppercase tracking-wide md:text-5xl">{t("careersTitle")}</h2>
              <p className="mt-4 max-w-lg text-muted">
                {t("careersDescription")}
              </p>
            </div>
            <Link
              href="/kasblar"
              className="text-sm font-bold text-foreground transition-colors hover:text-brand"
            >
              {t("allCareers")} &rarr;
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
                    {levelLabels[career.level]}
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
      <section id="startap-asoslari" className="border-t border-border bg-surface">
        <div className="mx-auto max-w-5xl px-5 py-24 md:py-32">
          <div className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">{t("learnLabel")}</span>
              <h2 className="font-display text-4xl uppercase tracking-wide md:text-5xl">{t("learnTitle")}</h2>
              <p className="mt-4 max-w-lg text-muted">
                {t("learnDescription")}
              </p>
            </div>
            <Link
              href="/learn"
              className="text-sm font-bold text-foreground transition-colors hover:text-brand"
            >
              {t("allLearn")} &rarr;
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
