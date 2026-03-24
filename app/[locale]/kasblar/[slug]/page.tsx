import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getCareers, getCareerBySlug, getLevelLabels, levelColor } from "@/lib/careers";
import CareerRoadmap from "@/components/CareerRoadmap";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const locales = ["uz", "ru"];
  return locales.flatMap((locale) =>
    getCareers(locale).map((c) => ({ locale, slug: c.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const career = getCareerBySlug(slug, locale);
  if (!career) return {};

  const t = await getTranslations({ locale, namespace: "careers" });

  return {
    title: `${career.title} — ${t("title")}`,
    description: t("detailMetaDescription", { title: career.title }),
    alternates: { canonical: `/kasblar/${slug}` },
    openGraph: {
      title: `${career.title} — ${t("title")}`,
      description: career.description,
      url: `/kasblar/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${career.title} | Stepolog.uz`,
      description: career.description,
    },
  };
}

export default async function CareerDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const career = getCareerBySlug(slug, locale);

  if (!career) notFound();

  const t = await getTranslations({ locale, namespace: "careers" });
  const levelLabels = getLevelLabels(locale);

  const urlPrefix = locale === "ru" ? "/ru" : "";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${career.title} — ${t("title")}`,
    description: career.description,
    mainEntityOfPage: `https://stepolog.uz${urlPrefix}/kasblar/${slug}`,
    publisher: {
      "@type": "Organization",
      name: "Stepolog",
      url: "https://stepolog.uz",
    },
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/kasblar"
        className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-brand"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        {t("backToCareers")}
      </Link>

      {/* Header */}
      <div className="mb-12">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-[.2em] text-brand">{t("label")}</span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${levelColor[career.level]}`}
          >
            {levelLabels[career.level]}
          </span>
        </div>
        <h1 className="font-display text-4xl uppercase tracking-wide md:text-5xl">
          {career.title}
        </h1>
        <p className="mt-4 text-lg text-muted">{career.description}</p>
      </div>

      {/* Nima qiladi */}
      <section className="mb-12">
        <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">{t("whatDoes")}</h2>
        <div className="space-y-3">
          {career.whatDoes.map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-foreground/80">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Kompaniyada o'rni */}
      <section className="mb-12">
        <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">{t("companyRole")}</h2>
        <div className="rounded-xl border border-border bg-surface p-6">
          <p className="text-sm leading-relaxed text-foreground/80">{career.companyRole}</p>
        </div>
      </section>

      {/* Roadmap */}
      <section className="mb-12">
        <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">{t("growthPath")}</h2>
        <CareerRoadmap steps={career.roadmap} />
      </section>

      {/* Ko'nikmalar */}
      <section className="mb-12">
        <h2 className="mb-5 font-display text-2xl uppercase tracking-wide">{t("coreSkills")}</h2>
        <div className="flex flex-wrap gap-2">
          {career.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-strong"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

    </div>
  );
}
