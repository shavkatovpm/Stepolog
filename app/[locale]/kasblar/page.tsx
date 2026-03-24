import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getCareers, getLevelLabels, levelColor } from "@/lib/careers";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "careers" });

  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: { canonical: "/kasblar" },
    openGraph: {
      title: t("title"),
      description: t("metaOgDescription"),
      url: "/kasblar",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("title")} | Stepolog.uz`,
      description: t("metaOgDescription"),
    },
  };
}

export default async function KasblarPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "careers" });
  const careers = getCareers(locale);
  const levelLabels = getLevelLabels(locale);

  return (
    <div className="mx-auto max-w-5xl px-5 py-20">
      <div className="mb-12">
        <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">
          {t("listLabel")}
        </span>
        <h1 className="font-display text-5xl uppercase tracking-wide md:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-lg text-muted">
          {t("listDescription")}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {careers.map((career) => (
          <Link
            key={career.slug}
            href={`/kasblar/${career.slug}`}
            className="group rounded-xl border border-border bg-surface p-6 transition-all hover:border-brand/40"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl uppercase tracking-wide">
                {career.title}
              </h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${levelColor[career.level]}`}
              >
                {levelLabels[career.level]}
              </span>
            </div>

            <p className="mb-4 text-sm leading-relaxed text-muted">
              {career.description}
            </p>

            <div className="mb-4 flex flex-wrap gap-1.5">
              {career.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-strong"
                >
                  {skill}
                </span>
              ))}
            </div>

            <span className="text-sm font-bold text-foreground transition-colors group-hover:text-brand">
              {t("details")} &rarr;
            </span>
          </Link>
        ))}
      </div>

    </div>
  );
}
