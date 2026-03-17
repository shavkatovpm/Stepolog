export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, createToken, setAuthCookie, hashPassword } from "@/lib/auth";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

// Login: max 5 attempts per 15 minutes per IP
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: Request) {
  // Rate limit check
  const ip = getClientIP(req);
  const retryAfter = checkRateLimit(`login:${ip}`, MAX_LOGIN_ATTEMPTS, LOGIN_WINDOW_MS);
  if (retryAfter !== null) {
    return NextResponse.json(
      { error: `Juda ko'p urinish. ${retryAfter} soniyadan keyin qayta urinib ko'ring.` },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  let body;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const { login, password } = body;

  if (!login || !password || typeof login !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Login va parol kerak" }, { status: 400 });
  }

  if (login.length > 100 || password.length > 200) {
    return NextResponse.json({ error: "Login yoki parol noto'g'ri" }, { status: 401 });
  }

  // Agar hali user yo'q bo'lsa — birinchi admin yaratamiz
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    if (password.length < 6) {
      return NextResponse.json({ error: "Parol kamida 6 ta belgi bo'lsin" }, { status: 400 });
    }
    const hashed = await hashPassword(password);
    await prisma.user.create({ data: { login: login.trim(), password: hashed } });
  }

  const user = await prisma.user.findUnique({ where: { login: login.trim() } });
  if (!user) {
    return NextResponse.json({ error: "Login yoki parol noto'g'ri" }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Login yoki parol noto'g'ri" }, { status: 401 });
  }

  const token = createToken(user.id);
  await setAuthCookie(token);

  return NextResponse.json({ ok: true });
}
