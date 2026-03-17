export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: "Avtorizatsiya kerak" }, { status: 401 });

  const { id } = await params;
  let data;
  try { data = await req.json(); } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  if (data.title && data.title.length > 500) return NextResponse.json({ error: "Sarlavha juda uzun" }, { status: 400 });
  if (data.contentText && data.contentText.length > 100000) return NextResponse.json({ error: "Kontent juda uzun" }, { status: 400 });

  const updateData: Record<string, unknown> = {};
  const fields = ["title", "publishDate", "status", "note", "keyword", "keywords2", "internalLink", "intent", "source", "facts", "brandCount", "mainQuestion", "blogTopics", "contentText", "contentType"];
  for (const key of fields) {
    if (data[key] !== undefined) updateData[key] = data[key];
  }

  // Status o'zgarganda vaqtlarni belgilash
  if (data.status === "ready") updateData.readyAt = new Date();
  if (data.status === "published") updateData.publishedAt = new Date();

  const content = await prisma.content.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(content);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: "Avtorizatsiya kerak" }, { status: 401 });

  const { id } = await params;
  await prisma.content.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
