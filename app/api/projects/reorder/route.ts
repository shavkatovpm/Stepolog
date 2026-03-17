export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function PUT(req: Request) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: "Avtorizatsiya kerak" }, { status: 401 });

  let body;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const { ids } = body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "ids massivi kerak" }, { status: 400 });
  }

  await prisma.$transaction(
    ids.map((id: string, index: number) =>
      prisma.project.update({ where: { id }, data: { sortOrder: index } })
    )
  );

  return NextResponse.json({ ok: true });
}
