import Link from "next/link";
import StepologLogo from "@/components/StepologLogo";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biz haqimizda",
  description:
    "Stepolog — startaplar uchun IT loyihalarni boshqarish, investitsiya jalb qilish va startup bo'yicha bilim olish platformasi.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Biz haqimizda",
    description: "Stepolog — O'zbekiston startap ekotizimini rivojlantiruvchi platforma.",
    url: "/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Biz haqimizda | Stepolog.uz",
    description: "Stepolog — O'zbekiston startap ekotizimini rivojlantiruvchi platforma.",
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <div className="mb-12 text-center">
        <StepologLogo size={64} className="mx-auto mb-6 text-brand" />
        <h1 className="font-display text-5xl uppercase tracking-wide md:text-6xl">
          Biz haqimizda
        </h1>
        <p className="mt-4 text-muted">
          Stepolog — O&apos;zbekiston startap ekotizimini rivojlantiruvchi platforma
        </p>
      </div>

      <div className="space-y-8 text-base leading-[1.8] text-muted">
        <p>
          <strong className="text-foreground">Stepolog</strong> — startaplar uchun
          IT loyihalarni boshqarish, ularga investitsiya jalb qilish va startup
          bo&apos;yicha bilim oladigan platforma sifatida yaratilgan.
        </p>

        <p>
          Biz O&apos;zbekistondagi yosh tadbirkorlar va IT mutaxassislarga yordam
          beramiz — ularning g&apos;oyalarini real loyihalarga aylantirish,
          rivojlantirish va muvaffaqiyatga erishish yo&apos;lida.
        </p>

        <div className="rounded-xl border border-border bg-surface p-8">
          <h2 className="mb-4 font-display text-2xl uppercase tracking-wide">
            Missiyamiz
          </h2>
          <p>
            O&apos;zbekistonda startap madaniyatini shakllantirish va har bir
            g&apos;oyaga hayot bag&apos;ishlash imkonini yaratish.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-2 font-display text-3xl text-brand">01</div>
            <h3 className="mb-1 text-sm font-bold uppercase tracking-wide">
              Bilim
            </h3>
            <p className="text-sm text-muted">
              Startup asoslari va IT loyihalarni boshqarish bo&apos;yicha materiallar
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-2 font-display text-3xl text-brand">02</div>
            <h3 className="mb-1 text-sm font-bold uppercase tracking-wide">
              Amaliyot
            </h3>
            <p className="text-sm text-muted">
              Real loyihalar ustida ishlash va tajriba orttirish
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-2 font-display text-3xl text-brand">03</div>
            <h3 className="mb-1 text-sm font-bold uppercase tracking-wide">
              Investitsiya
            </h3>
            <p className="text-sm text-muted">
              Startaplarga investitsiya jalb qilish va rivojlantirish
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/contact"
          className="inline-block rounded-md bg-brand px-8 py-3.5 text-sm font-bold text-black transition-all hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(255,222,89,.3)]"
        >
          Bog&apos;lanish &rarr;
        </Link>
      </div>
    </div>
  );
}
