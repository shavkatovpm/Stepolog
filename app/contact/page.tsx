import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aloqa",
  description: "Stepolog jamoasi bilan bog'laning. Telegram, email yoki forma orqali.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Aloqa",
    description: "Stepolog jamoasi bilan bog'laning.",
    url: "/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aloqa | Stepolog.uz",
    description: "Stepolog jamoasi bilan bog'laning.",
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-20">
      <div className="mb-12">
        <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-brand">Aloqa</span>
        <h1 className="font-display text-5xl uppercase tracking-wide md:text-6xl">Bog&apos;lanish</h1>
        <p className="mt-4 max-w-lg text-muted">
          Savollaringiz bormi? Startapingiz haqida yozmoqchimisiz? Biz bilan bog&apos;laning!
        </p>
      </div>

      <div className="mb-10 grid gap-5 sm:grid-cols-2">
        <a
          href="https://t.me/stepolog"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-6 transition-all hover:border-brand/40"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
            <svg className="h-5 w-5 text-brand" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-lg uppercase tracking-wide">Telegram</h3>
            <p className="text-sm text-muted">@stepolog</p>
          </div>
        </a>

        <a
          href="mailto:hello@stepolog.uz"
          className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-6 transition-all hover:border-brand/40"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
            <svg className="h-5 w-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-lg uppercase tracking-wide">Email</h3>
            <p className="text-sm text-muted">hello@stepolog.uz</p>
          </div>
        </a>
      </div>

      {/* Contact Form (UI only) */}
      <div className="rounded-xl border border-border bg-surface p-6 md:p-8">
        <h2 className="mb-6 font-display text-2xl uppercase tracking-wide">Xabar yuboring</h2>
        <form className="flex flex-col gap-5">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-bold">
              Ismingiz
            </label>
            <input
              type="text"
              id="name"
              placeholder="Ismingizni kiriting"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-brand"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-bold">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="email@example.com"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-brand"
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm font-bold">
              Xabar
            </label>
            <textarea
              id="message"
              rows={4}
              placeholder="Xabaringizni yozing..."
              className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-brand"
            />
          </div>
          <button
            type="button"
            className="rounded-md bg-brand px-8 py-3.5 text-sm font-bold text-black transition-all hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(255,222,89,.3)]"
          >
            Yuborish
          </button>
          <p className="text-xs text-muted">
            * Hozircha forma ishlamaydi. Telegram yoki email orqali bog&apos;laning.
          </p>
        </form>
      </div>
    </div>
  );
}
