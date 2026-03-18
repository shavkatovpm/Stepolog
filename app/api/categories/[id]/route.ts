export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: "Avtorizatsiya kerak" }, { status: 401 });

  const { id } = await params;
  let body;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const { name } = body;
  const category = await prisma.category.update({
    where: { id },
    data: { ...(name !== undefined && { name: name.trim() }) },
  });
  return NextResponse.json(category);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: "Avtorizatsiya kerak" }, { status: 401 });

  const { id } = await params;
  // Move all projects in this category to "Barchasi" (uncategorized)
  await prisma.project.updateMany({ where: { categoryId: id }, data: { categoryId: null } });
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
