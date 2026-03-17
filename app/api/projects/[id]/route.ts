export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: "Avtorizatsiya kerak" }, { status: 401 });

  const { id } = await params;
  const { name, domain, desc, color, customIntents } = await req.json();

  const updateData: Record<string, unknown> = {};
  if (name !== undefined) updateData.name = name?.trim();
  if (domain !== undefined) updateData.domain = domain?.trim();
  if (desc !== undefined) updateData.desc = desc?.trim();
  if (color !== undefined) updateData.color = color;
  if (customIntents !== undefined) updateData.customIntents = customIntents;

  const project = await prisma.project.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(project);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: "Avtorizatsiya kerak" }, { status: 401 });

  const { id } = await params;
  await prisma.project.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
