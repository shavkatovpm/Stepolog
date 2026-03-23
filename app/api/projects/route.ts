export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: "Avtorizatsiya kerak" }, { status: 401 });

  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { contents: true } } },
  });

  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: "Avtorizatsiya kerak" }, { status: 401 });

  let body;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const { name, domain, desc, positioning, color, categoryId } = body;
  if (!name?.trim()) return NextResponse.json({ error: "Loyiha nomini kiriting" }, { status: 400 });
  if (name.length > 200 || (domain && domain.length > 200) || (desc && desc.length > 1000)) {
    return NextResponse.json({ error: "Matn juda uzun" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: { name: name.trim(), domain: domain?.trim() || "", desc: desc?.trim() || "", positioning: positioning?.trim() || "", color: color || "color-1", categoryId: categoryId || null },
  });

  return NextResponse.json(project, { status: 201 });
}
