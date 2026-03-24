import Link from "next/link";
import StepologLogo from "@/components/StepologLogo";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biz haqimizda",
  description:
    "Stepolog — O'zbekistonda startap ekotizimini rivojlantirish va IT kasblari bo'yicha bepul bilim beruvchi platforma.",
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
          Stepolog — O&apos;zbekiston digital ekotizimi uchun bepul bilim platformasi
        </p>
      </div>

      <div className="space-y-8 text-base leading-[1.8] text-muted">
        <div className="grid gap-5 sm:grid-cols-2">
          <Link href="/about/missiya" className="group rounded-xl border border-border bg-surface p-6 transition-all hover:border-brand/40">
            <div className="mb-2 font-display text-3xl text-brand">01</div>
            <h3 className="mb-1 text-sm font-bold uppercase tracking-wide">
              Missiya
            </h3>
            <p className="text-sm text-muted">
              Stepolog nima uchun mavjud va biz qanday maqsadni ko&apos;zlaymiz
            </p>
          </Link>
          <Link href="/about/bilim" className="group rounded-xl border border-border bg-surface p-6 transition-all hover:border-brand/40">
            <div className="mb-2 font-display text-3xl text-brand">02</div>
            <h3 className="mb-1 text-sm font-bold uppercase tracking-wide">
              Bilim
            </h3>
            <p className="text-sm text-muted">
              Startap, IT va kasblar bo&apos;yicha bepul bilim va materiallar
            </p>
          </Link>
          <Link href="/about/hamjamiyat" className="group rounded-xl border border-border bg-surface p-6 transition-all hover:border-brand/40">
            <div className="mb-2 font-display text-3xl text-brand">03</div>
            <h3 className="mb-1 text-sm font-bold uppercase tracking-wide">
              Hamjamiyat
            </h3>
            <p className="text-sm text-muted">
              Yosh tadbirkorlar va IT mutaxassislari uchun hamjamiyat
            </p>
          </Link>
          <Link href="/about/yol-xarita" className="group rounded-xl border border-border bg-surface p-6 transition-all hover:border-brand/40">
            <div className="mb-2 font-display text-3xl text-brand">04</div>
            <h3 className="mb-1 text-sm font-bold uppercase tracking-wide">
              Yo&apos;l xarita
            </h3>
            <p className="text-sm text-muted">
              Qayerdan boshlashni bilmaydiganlar uchun bosqichma-bosqich yo&apos;nalish
            </p>
          </Link>
        </div>
      </div>

    </div>
  );
}
