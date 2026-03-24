import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center justify-center px-5 py-28 text-center">
      <div className="mb-6 font-display text-[120px] leading-none tracking-wide text-brand/20 md:text-[160px]">404</div>
      <h2 className="mb-3 font-display text-3xl uppercase tracking-wide">{t("title")}</h2>
      <p className="mb-10 max-w-sm text-muted">
        {t("description")}
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-md bg-brand px-8 py-3.5 text-sm font-bold text-black transition-all hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(255,222,89,.3)]"
      >
        &larr; {t("backHome")}
      </Link>
    </div>
  );
}
