import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aloqa",
  description: "Stepolog jamoasi bilan bog'laning. Telegram, email yoki forma orqali.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl">
      {/* Page header */}
      <div className="mb-12 rounded-2xl bg-gradient-to-r from-brand/20 via-brand/10 to-transparent p-8 md:p-10">
        <span className="mb-3 inline-block rounded-full bg-brand/30 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-dark">
          Aloqa
        </span>
        <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">Bog&apos;lanish</h1>
        <p className="max-w-lg text-base text-muted">
          Savollaringiz bormi? Startapingiz haqida yozmoqchimisiz? Biz bilan bog&apos;laning!
        </p>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        <a
          href="https://t.me/stepolog"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden rounded-2xl bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-brand/10 transition-all group-hover:bg-brand/20" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 transition-colors group-hover:bg-blue-100">
              <svg className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold">Telegram</h3>
              <p className="text-sm text-muted">@stepolog</p>
            </div>
          </div>
        </a>

        <a
          href="mailto:hello@stepolog.uz"
          className="group relative overflow-hidden rounded-2xl bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-accent/10 transition-all group-hover:bg-accent/20" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 transition-colors group-hover:bg-accent/20">
              <svg className="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold">Email</h3>
              <p className="text-sm text-muted">hello@stepolog.uz</p>
            </div>
          </div>
        </a>
      </div>

      {/* Contact Form (UI only) */}
      <div className="overflow-hidden rounded-2xl bg-surface shadow-sm">
        <div className="h-1.5 bg-gradient-to-r from-brand via-accent to-brand" />
        <div className="p-7 md:p-9">
          <h2 className="mb-6 text-xl font-bold">Xabar yuboring</h2>
          <form className="flex flex-col gap-5">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-semibold">
                Ismingiz
              </label>
              <input
                type="text"
                id="name"
                placeholder="Ismingizni kiriting"
                className="w-full rounded-xl border-0 bg-background px-4 py-3 text-sm shadow-sm outline-none ring-1 ring-border transition-all focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="email@example.com"
                className="w-full rounded-xl border-0 bg-background px-4 py-3 text-sm shadow-sm outline-none ring-1 ring-border transition-all focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-semibold">
                Xabar
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="Xabaringizni yozing..."
                className="w-full resize-none rounded-xl border-0 bg-background px-4 py-3 text-sm shadow-sm outline-none ring-1 ring-border transition-all focus:ring-2 focus:ring-brand"
              />
            </div>
            <button
              type="button"
              className="rounded-full bg-brand px-7 py-3 text-sm font-bold text-brand-dark shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Yuborish
            </button>
            <p className="text-xs text-muted">
              * Hozircha forma ishlamaydi. Telegram yoki email orqali bog&apos;laning.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
