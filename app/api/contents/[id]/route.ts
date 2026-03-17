export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: "Avtorizatsiya kerak" }, { status: 401 });

  const { id } = await params;
  const data = await req.json();

  const updateData: Record<string, unknown> = {};
  const fields = ["title", "publishDate", "status", "note", "keyword", "keywords2", "internalLink", "intent", "source", "facts", "brandCount", "mainQuestion", "blogTopics", "contentText"];
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
