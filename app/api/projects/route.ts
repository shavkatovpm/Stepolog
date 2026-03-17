export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: "Avtorizatsiya kerak" }, { status: 401 });

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { contents: true } } },
  });

  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: "Avtorizatsiya kerak" }, { status: 401 });

  const { name, domain, desc, color } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Loyiha nomini kiriting" }, { status: 400 });

  const project = await prisma.project.create({
    data: { name: name.trim(), domain: domain?.trim() || "", desc: desc?.trim() || "", color: color || "color-1" },
  });

  return NextResponse.json(project, { status: 201 });
}
