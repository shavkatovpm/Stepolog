export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: "Avtorizatsiya kerak" }, { status: 401 });

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: "Avtorizatsiya kerak" }, { status: 401 });

  let body;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const { name } = body;
  if (!name?.trim()) return NextResponse.json({ error: "Kategoriya nomini kiriting" }, { status: 400 });

  const category = await prisma.category.create({ data: { name: name.trim() } });
  return NextResponse.json(category, { status: 201 });
}
