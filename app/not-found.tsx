import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div className="relative mb-8">
        <div className="text-[120px] font-extrabold leading-none text-brand/20 md:text-[160px]">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="h-16 w-16 text-brand md:h-20 md:w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
          </svg>
        </div>
      </div>
      <h2 className="mb-3 text-2xl font-bold">Sahifa topilmadi</h2>
      <p className="mb-10 max-w-sm text-muted">
        Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki ko&apos;chirilgan.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-bold text-brand-dark shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Asosiy sahifaga qaytish
      </Link>
    </div>
  );
}
