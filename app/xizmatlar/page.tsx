import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Xizmatlar",
  description:
    "Stepolog xizmatlari — bilim platformasi, PR va maqolalar, konsalting. Startapingizni boshlash va rivojlantirishda yordam beramiz.",
  alternates: { canonical: "/xizmatlar" },
  openGraph: {
    title: "Xizmatlar",
    description:
      "Startapingizni boshlash va rivojlantirishda har tomonlama yordam beramiz.",
    url: "/xizmatlar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Xizmatlar | Stepolog.uz",
    description:
      "Startapingizni boshlash va rivojlantirishda har tomonlama yordam beramiz.",
  },
};

const services = [
  {
    title: "Bilim platformasi",
    description:
      "Startap boshlash, rivojlantirish va kengaytirish bo\u2018yicha bepul o\u2018quv materiallar va qo\u2018llanmalar. G\u2018oyadan MVPgacha, biznes model, jamoa qurish va investitsiya jalb qilish mavzularini qamrab olamiz.",
    icon: (
      <svg className="h-6 w-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    link: "/learn",
    linkText: "O'quv materiallarga o'tish",
  },
  {
    title: "PR va maqolalar",
    description:
      "Startapingiz haqida professional maqola yozamiz va minglab o\u2018quvchilarga yetkazamiz. SEO optimizatsiya qilingan kontent orqali brendingizni keng auditoriyaga tanishtiring.",
    icon: (
      <svg className="h-6 w-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    link: "/blog",
    linkText: "Maqolalarni ko'rish",
  },
  {
    title: "Konsalting",
    description:
      "Biznes model, mahsulot strategiyasi va investitsiya jalb qilish bo\u2018yicha individual maslahat. Tajribali mentorlar bilan ishlang va startapingizni keyingi bosqichga olib chiqing.",
    icon: (
      <svg className="h-6 w-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    link: "/contact",
    linkText: "Maslahat olish",
  },
];

export default function XizmatlarPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-20">
      <div className="mb-12">
        <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">
          Xizmatlar
        </span>
        <h1 className="font-display text-5xl uppercase tracking-wide md:text-6xl">
          Nima qilamiz?
        </h1>
        <p className="mt-4 max-w-lg text-muted">
          Startapingizni boshlash va rivojlantirishda har tomonlama yordam beramiz
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.title}
            className="group flex flex-col rounded-xl border border-border bg-surface p-6 transition-all hover:border-brand/40"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
              {service.icon}
            </div>
            <h2 className="mb-2 font-display text-xl uppercase tracking-wide">
              {service.title}
            </h2>
            <p className="mb-6 flex-1 text-sm leading-relaxed text-muted">
              {service.description}
            </p>
            <Link
              href={service.link}
              className="text-sm font-bold text-foreground transition-colors hover:text-brand"
            >
              {service.linkText} &rarr;
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-xl border border-border bg-surface p-8 text-center md:p-12">
        <h2 className="mb-3 font-display text-2xl uppercase tracking-wide md:text-3xl">
          Hamkorlik qilmoqchimisiz?
        </h2>
        <p className="mx-auto mb-6 max-w-md text-sm text-muted">
          Startapingiz yoki loyihangiz haqida batafsil gaplashaylik
        </p>
        <Link
          href="/contact"
          className="inline-block rounded-md bg-brand px-8 py-3.5 text-sm font-bold text-black transition-all hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(255,222,89,.3)]"
        >
          Bog&apos;lanish &rarr;
        </Link>
      </div>
    </div>
  );
}
