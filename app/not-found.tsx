import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div className="mb-6 text-8xl font-extrabold text-brand">404</div>
      <h2 className="mb-3 text-2xl font-bold">Sahifa topilmadi</h2>
      <p className="mb-10 max-w-sm text-muted">
        Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki ko&apos;chirilgan.
      </p>
      <Link
        href="/"
        className="rounded-full bg-brand px-7 py-3 text-sm font-bold text-brand-dark shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        Asosiy sahifaga qaytish
      </Link>
    </div>
  );
}
