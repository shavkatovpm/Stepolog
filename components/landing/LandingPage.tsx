import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import Header from "@/components/home/Header";
import FinalCta from "@/components/home/sections/FinalCta";
import { Reveal, TgPost } from "@/components/home/ui";
import { BOT, Y } from "@/components/home/data";
import { getLanding, type Landing } from "@/content/landing/uz";
import BotVisual from "./heroes/BotVisual";
import SiteVisual from "./heroes/SiteVisual";
import TranslateVisual from "./heroes/TranslateVisual";
import MarketingVisual from "./heroes/MarketingVisual";
import WaitlistVisual from "./heroes/WaitlistVisual";
import AutopostVisual from "./heroes/AutopostVisual";

// Har bir sahifaga o'z hero vizuali
const visuals: Record<string, () => React.JSX.Element> = {
  "telegram-yangiliklar-boti": BotVisual,
  "sayt-yangiliklarini-telegramga-yuborish": SiteVisual,
  "xorijiy-yangiliklar-ozbek-tilida": TranslateVisual,
  "marketing-yangiliklari": MarketingVisual,
  "suniy-intellekt-yangiliklari": WaitlistVisual,
  "telegram-kanalga-avtopost": AutopostVisual,
};

function Visual({ slug }: { slug: string }) {
  const V = visuals[slug];
  return V ? <V /> : null;
}

const SITE = "https://www.stepolog.uz";

// Strukturali ma'lumot: FAQ, breadcrumb va (bot sahifasida) ilova
function JsonLd({ l }: { l: Landing }) {
  const url = `${SITE}/uz/${l.slug}`;
  const graph: object[] = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Stepolog", item: `${SITE}/uz` },
        { "@type": "ListItem", position: 2, name: l.nav, item: url },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: l.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    { "@type": "WebPage", name: l.metaTitle, description: l.metaDescription, url, inLanguage: "uz" },
  ];
  if (l.app) {
    graph.push({
      "@type": "SoftwareApplication",
      name: "Stepolog",
      applicationCategory: "CommunicationApplication",
      operatingSystem: "Telegram",
      url: BOT,
      inLanguage: "uz",
      description: l.answer,
      offers: { "@type": "Offer", price: "0", priceCurrency: "UZS" },
    });
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  );
}

export default function LandingPage({ l }: { l: Landing }) {
  const soon = l.status === "soon";
  const related = l.related.map(getLanding).filter((x): x is Landing => Boolean(x));

  return (
    <>
      <JsonLd l={l} />
      <Header />
      <main>
        {/* Hero: chapda matn, o'ngda sahifaga xos jonli vizual */}
        <section className="flex items-center lg:min-h-[calc(100svh-4rem)]">
          <div className="mx-auto w-full max-w-[1160px] px-5 py-12 md:py-16">
            <nav aria-label="Breadcrumb" className="text-[13.5px] text-white/40">
              <Link href="/uz" className="hover:text-white">Bosh sahifa</Link>
              <span className="mx-2">/</span>
              <span className="text-white/70">{l.nav}</span>
            </nav>

            <div className="mt-10 grid items-center gap-14 md:mt-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
              <div className="anim-rise">
                <p className="inline-flex items-center gap-2 rounded-md bg-white/[0.06] px-2.5 py-1.5 text-[13.5px] font-medium" style={{ color: Y }}>
                  <LogoMark size={13} /> {l.kicker}
                </p>
                <h1 className="mt-6 text-balance text-[38px] font-semibold leading-[1.04] tracking-[-0.04em] md:text-[56px]">{l.h1}</h1>
                <p className="mt-6 max-w-[540px] text-[17px] leading-[1.65] text-white/60 md:text-[18px]">{l.lead}</p>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <a href={BOT} className="btn-y rounded-md px-7 py-4 text-[15px] font-semibold text-[#1c1c1c]" style={{ background: Y }}>
                    {l.cta}
                  </a>
                  <a href="#imkoniyatlar" className="rounded-md border border-white/[0.14] px-7 py-4 text-[15px] font-semibold text-white/85 transition-colors hover:border-white/40">
                    Batafsil
                  </a>
                </div>
                <p className="mt-6 text-[13.5px] text-white/40">
                  {soon ? "Hozircha navbatga yozilish mumkin · bepul" : "Bepul boshlash · ro'yxatdan o'tish shart emas"}
                </p>
              </div>

              <div className="anim-rise" style={{ animationDelay: "150ms" }}>
                <Visual slug={l.slug} />
              </div>
            </div>
          </div>
        </section>

        {/* GEO: qisqa javob */}
        <section className="border-y border-white/[0.08] bg-[#191919]">
          <div className="mx-auto grid max-w-[1160px] gap-4 px-5 py-12 md:grid-cols-[200px_1fr] md:gap-10 md:py-14">
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: Y }}>
              Qisqa javob
            </p>
            <p className="max-w-[820px] text-[18px] leading-[1.65] text-white/80 md:text-[20px]">{l.answer}</p>
          </div>
        </section>

        {/* Imkoniyatlar */}
        <section id="imkoniyatlar" className="scroll-mt-16">
          <div className="mx-auto max-w-[1160px] px-5 py-24 md:py-28">
            <Reveal>
              <h2 className="text-balance text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] md:text-[44px]">{l.featuresTitle}</h2>
            </Reveal>
            <div className="mt-14 grid gap-x-16 md:grid-cols-2">
              {l.features.map((f, i) => (
                <Reveal key={f.title} delay={(i % 2) * 80}>
                  <div className="flex gap-5 border-t border-white/[0.1] py-7">
                    <span className="pt-1 text-[13px] font-semibold tabular-nums" style={{ color: Y }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-[20px] font-semibold tracking-[-0.02em]">{f.title}</h3>
                      <p className="mt-2 text-[15.5px] leading-[1.65] text-white/55">{f.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Qadamlar + post namunasi (och fon) */}
        <section className="bg-[#f3f1ea] text-[#1c1c1c]">
          <div className="mx-auto grid max-w-[1160px] gap-16 px-5 py-24 md:grid-cols-[1fr_1fr] md:items-center md:gap-20 md:py-28">
            <Reveal>
              <h2 className="text-balance text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] md:text-[44px]">{l.stepsTitle}</h2>
              <ol className="mt-10 border-t border-black/15">
                {l.steps.map((s, i) => (
                  <li key={s.title} className="flex gap-5 border-b border-black/15 py-6">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[#1c1c1c] text-[14px] font-bold" style={{ color: Y }}>
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-[19px] font-semibold tracking-[-0.02em]">{s.title}</h3>
                      <p className="mt-1.5 text-[15.5px] leading-[1.6] text-black/60">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={120}>
              <p className="mb-4 text-[14px] font-medium text-black/50">{l.postTitle}</p>
              <div className="w-full max-w-[480px] rounded-[28px] bg-[#1c1c1c] p-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,.45)]">
                <div className="flex items-center gap-3 px-3 pb-3 pt-2 text-white">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#2b2b2b]">
                    <LogoMark size={16} />
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold">Stepolog</p>
                    <p className="text-[12px] text-white/45">namuna post</p>
                  </div>
                </div>
                <div className="rounded-[20px] bg-[#141414] px-4 py-10 md:px-6">
                  <TgPost p={l.post} />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Kimlar uchun */}
        <section>
          <div className="mx-auto max-w-[1160px] px-5 py-24 md:py-28">
            <Reveal>
              <h2 className="text-balance text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] md:text-[44px]">{l.audienceTitle}</h2>
            </Reveal>
            <div className="mt-14 grid border-t border-white/[0.1] sm:grid-cols-2 lg:grid-cols-4">
              {l.audience.map((a, i) => (
                <Reveal key={a.title} delay={i * 60}>
                  <div className={`h-full border-b border-white/[0.1] py-7 sm:pr-8 ${i > 0 ? "lg:border-l lg:pl-8" : ""}`}>
                    <h3 className="text-[18px] font-semibold tracking-[-0.01em]">{a.title}</h3>
                    <p className="mt-2 text-[15px] leading-[1.6] text-white/55">{a.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Savol-javob: matn HTML'da doim bor (SEO), details orqali ochiladi */}
        <section className="border-t border-white/[0.08]">
          <div className="mx-auto grid max-w-[1160px] gap-12 px-5 py-24 md:grid-cols-[0.8fr_1.4fr] md:py-28">
            <Reveal>
              <h2 className="text-balance text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] md:text-[44px]">Savol-javob</h2>
              <p className="mt-5 text-[16px] text-white/55">
                Javob topmadingizmi?{" "}
                <a href={BOT} className="font-semibold hover:underline" style={{ color: Y }}>
                  Botga yozing
                </a>
              </p>
            </Reveal>
            <div className="border-t border-white/[0.12]">
              {l.faq.map((f, i) => (
                <details key={f.q} className="faq group border-b border-white/[0.12]" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6">
                    <h3 className="text-[18px] font-medium text-white/80 group-open:text-white">{f.q}</h3>
                    <span className="text-[24px] leading-none text-white/40 transition-transform duration-300 group-open:rotate-45 group-open:text-[#FFDE59]">+</span>
                  </summary>
                  <p className="max-w-[640px] pb-6 text-[15.5px] leading-[1.65] text-white/60">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Boshqa imkoniyatlar */}
        <section className="border-t border-white/[0.08]">
          <div className="mx-auto max-w-[1160px] px-5 py-20">
            <p className="text-[14px] text-white/45">Boshqa imkoniyatlar</p>
            <div className="mt-6 border-t border-white/[0.1]">
              {related.map((r) => (
                <Link key={r.slug} href={`/uz/${r.slug}`} className="group flex items-center justify-between gap-6 border-b border-white/[0.1] py-6">
                  <div>
                    <p className="text-[22px] font-semibold tracking-[-0.02em] transition-colors group-hover:text-[#FFDE59] md:text-[28px]">{r.nav}</p>
                    <p className="mt-1 max-w-[640px] text-[14.5px] text-white/45">{r.lead}</p>
                  </div>
                  <span className="text-[24px] text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-[#FFDE59]">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <FinalCta />
    </>
  );
}
