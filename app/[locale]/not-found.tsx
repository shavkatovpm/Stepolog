import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-5 text-center">
      <div>
        <div className="flex justify-center">
          <Logo />
        </div>
        <p className="mt-10 text-[72px] font-semibold leading-none tracking-[-0.04em]">404</p>
        <p className="mt-4 text-[16px] text-white/55">Page not found · Sahifa topilmadi · Страница не найдена</p>
        <div className="mt-8 flex justify-center gap-5 text-[15px] font-semibold text-[#FFDE59]">
          <Link href="/">Home</Link>
          <Link href="/uz">Bosh sahifa</Link>
          <Link href="/ru">Главная</Link>
        </div>
      </div>
    </main>
  );
}
