export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser, hashPassword } from "@/lib/auth";

export async function GET() {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: "Avtorizatsiya kerak" }, { status: 401 });

  let settings = await prisma.settings.findUnique({ where: { id: "default" } });
  if (!settings) {
    settings = await prisma.settings.create({ data: { id: "default" } });
  }

  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: "Avtorizatsiya kerak" }, { status: 401 });

  const data = await req.json();

  // Sozlamalar yangilash
  const updateData: Record<string, string> = {};
  for (const key of ["promptRole", "promptSeo", "promptGeo", "promptWriting", "customIntents"]) {
    if (data[key] !== undefined) updateData[key] = data[key];
  }

  const settings = await prisma.settings.upsert({
    where: { id: "default" },
    update: updateData,
    create: { id: "default", ...updateData },
  });

  // Parol o'zgartirish
  if (data.adminLogin && data.adminPassword) {
    if (typeof data.adminLogin !== "string" || data.adminLogin.trim().length < 3) {
      return NextResponse.json({ error: "Login kamida 3 ta belgi bo'lsin" }, { status: 400 });
    }
    if (typeof data.adminPassword !== "string" || data.adminPassword.length < 6) {
      return NextResponse.json({ error: "Parol kamida 6 ta belgi bo'lsin" }, { status: 400 });
    }
    if (data.adminLogin.length > 100 || data.adminPassword.length > 200) {
      return NextResponse.json({ error: "Login yoki parol juda uzun" }, { status: 400 });
    }
    const hashed = await hashPassword(data.adminPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { login: data.adminLogin.trim(), password: hashed },
    });
  }

  return NextResponse.json(settings);
}
