export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, createToken, setAuthCookie, hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const { login, password } = await req.json();

  if (!login || !password) {
    return NextResponse.json({ error: "Login va parol kerak" }, { status: 400 });
  }

  // Agar hali user yo'q bo'lsa — birinchi admin yaratamiz
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    const hashed = await hashPassword(password);
    await prisma.user.create({ data: { login, password: hashed } });
  }

  const user = await prisma.user.findUnique({ where: { login } });
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
