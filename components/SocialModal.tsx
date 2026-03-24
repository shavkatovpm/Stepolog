"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";

const STORAGE_KEY = "stepolog_social_dismissed";

const texts = {
  uz: {
    title: "Hamjamiyat",
    description: "Ijtimoiy tarmoqlarda bizga obuna bo\u2019ling va hamjamiyatimizga qo\u2019shiling",
    close: "Yopish",
    cardTitle: "Hamjamiyat",
    cardDesc: "O\u2019zbekiston startap ekotizimi va tadbirkorlar uchun hamjamiyat",
  },
  ru: {
    title: "Сообщество",
    description: "Подпишитесь на нас в социальных сетях и присоединяйтесь к нашему сообществу",
    close: "Закрыть",
    cardTitle: "Сообщество",
    cardDesc: "Сообщество для молодых предпринимателей и IT-специалистов Узбекистана",
  },
};

function ModalContent({ onClose, locale }: { onClose: () => void; locale: string }) {
  const t = texts[locale as keyof typeof texts] || texts.uz;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-background p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-2 font-display text-2xl uppercase tracking-wide">
          {t.title}
        </h3>
        <p className="mb-6 text-sm text-muted">
          {t.description}
        </p>

        <div className="space-y-3">
          <a
            href="https://t.me/stepolog"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl border border-border p-4 transition-all hover:border-brand/40"
          >
            <svg className="h-8 w-8 shrink-0 text-brand" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            <div>
              <div className="text-sm font-bold">Telegram</div>
              <div className="text-xs text-muted">t.me/stepolog</div>
            </div>
          </a>

          <a
            href="https://instagram.com/stepolog.uz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl border border-border p-4 transition-all hover:border-brand/40"
          >
            <svg className="h-8 w-8 shrink-0 text-brand" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
            <div>
              <div className="text-sm font-bold">Instagram</div>
              <div className="text-xs text-muted">instagram.com/stepolog.uz</div>
            </div>
          </a>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg border border-border py-2.5 text-sm font-bold text-foreground transition-colors hover:border-brand/40"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
}

export default function SocialModal() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const t = texts[locale as keyof typeof texts] || texts.uz;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl border border-border bg-surface p-6 text-left transition-all hover:border-brand/40"
      >
        <div className="mb-3 font-display text-3xl text-brand">03</div>
        <h3 className="mb-1 text-sm font-bold uppercase tracking-wide">{t.cardTitle}</h3>
        <p className="text-xs leading-relaxed text-muted">{t.cardDesc}</p>
      </button>

      {open && <ModalContent onClose={() => setOpen(false)} locale={locale} />}
    </>
  );
}

export function SocialPopup() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    const timer = setTimeout(() => setOpen(true), 60000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  if (!open) return null;
  return <ModalContent onClose={handleClose} locale={locale} />;
}
