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
    const hashed = await hashPassword(data.adminPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { login: data.adminLogin, password: hashed },
    });
  }

  return NextResponse.json(settings);
}
