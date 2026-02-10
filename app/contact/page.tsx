import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aloqa",
  description: "Stepolog jamoasi bilan bog'laning. Telegram, email yoki forma orqali.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-10">
        <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">Aloqa</h1>
        <p className="text-base text-muted">
          Savollaringiz bormi? Startapingiz haqida yozmoqchimisiz? Biz bilan bog&apos;laning!
        </p>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        <a
          href="https://t.me/stepolog"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 rounded-2xl bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/20 text-xl font-bold transition-colors group-hover:bg-brand/40">
            T
          </div>
          <div>
            <h3 className="font-bold">Telegram</h3>
            <p className="text-sm text-muted">@stepolog</p>
          </div>
        </a>

        <a
          href="mailto:hello@stepolog.uz"
          className="group flex items-center gap-4 rounded-2xl bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/20 text-xl font-bold transition-colors group-hover:bg-brand/40">
            @
          </div>
          <div>
            <h3 className="font-bold">Email</h3>
            <p className="text-sm text-muted">hello@stepolog.uz</p>
          </div>
        </a>
      </div>

      {/* Contact Form (UI only) */}
      <div className="rounded-2xl bg-surface p-7 shadow-sm md:p-9">
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
  );
}
