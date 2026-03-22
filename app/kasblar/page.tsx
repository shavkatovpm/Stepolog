import type { Metadata } from "next";
import Link from "next/link";
import { careers, levelColor } from "@/lib/careers";

export const metadata: Metadata = {
  title: "Kasblar xaritasi",
  description:
    "IT sohasidagi kasblar xaritasi — qaysi yo'nalishni tanlash, nimalarni o'rganish va qanday boshlash kerak.",
  alternates: { canonical: "/kasblar" },
  openGraph: {
    title: "Kasblar xaritasi",
    description: "IT sohasidagi asosiy yo'nalishlar — qaysi kasbni tanlash va nimalarni o'rganish kerak.",
    url: "/kasblar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kasblar xaritasi | Stepolog.uz",
    description: "IT sohasidagi asosiy yo'nalishlar — qaysi kasbni tanlash va nimalarni o'rganish kerak.",
  },
};

export default function KasblarPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-20">
      <div className="mb-12">
        <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">
          Kasblar
        </span>
        <h1 className="font-display text-5xl uppercase tracking-wide md:text-6xl">
          Kasblar xaritasi
        </h1>
        <p className="mt-4 max-w-lg text-muted">
          IT sohasidagi asosiy yo&apos;nalishlar — kasbni tanlang va nima qilishi, qanday
          o&apos;sishi haqida batafsil bilib oling.
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
                {career.level}
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
              Batafsil &rarr;
            </span>
          </Link>
        ))}
      </div>

    </div>
  );
}
