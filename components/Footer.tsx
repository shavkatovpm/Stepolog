import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-surface">
      <div className="mx-auto max-w-5xl px-5 py-12 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="text-xl font-extrabold tracking-tight">
              <span className="rounded-md bg-brand px-1.5 py-0.5 text-brand-dark">STEP</span>
              <span className="text-brand-dark">OLOG</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              O&apos;zbekistondagi startaplar va yangi bizneslar uchun bilim, xizmat va PR platformasi.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted">Sahifalar</h4>
              <ul className="flex flex-col gap-3 text-sm">
                <li><Link href="/" className="text-foreground/70 transition-colors hover:text-foreground">Asosiy</Link></li>
                <li><Link href="/blog" className="text-foreground/70 transition-colors hover:text-foreground">Bloglar</Link></li>
                <li><Link href="/learn" className="text-foreground/70 transition-colors hover:text-foreground">O&apos;rganish</Link></li>
                <li><Link href="/contact" className="text-foreground/70 transition-colors hover:text-foreground">Aloqa</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted">Tarmoqlar</h4>
              <ul className="flex flex-col gap-3 text-sm">
                <li>
                  <a href="https://t.me/stepolog" target="_blank" rel="noopener noreferrer" className="text-foreground/70 transition-colors hover:text-foreground">
                    Telegram
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com/stepolog.uz" target="_blank" rel="noopener noreferrer" className="text-foreground/70 transition-colors hover:text-foreground">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} Stepolog.uz — Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  );
}
