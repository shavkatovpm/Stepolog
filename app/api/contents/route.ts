export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: Request) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: "Avtorizatsiya kerak" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  const contents = await prisma.content.findMany({
    where: projectId ? { projectId } : undefined,
    orderBy: { publishDate: "asc" },
  });

  return NextResponse.json(contents);
}

export async function POST(req: Request) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: "Avtorizatsiya kerak" }, { status: 401 });

  const data = await req.json();
  if (!data.title?.trim()) return NextResponse.json({ error: "Sarlavhani kiriting" }, { status: 400 });
  if (!data.projectId) return NextResponse.json({ error: "Loyiha tanlang" }, { status: 400 });

  const content = await prisma.content.create({
    data: {
      projectId: data.projectId,
      title: data.title.trim(),
      publishDate: data.publishDate || "",
      status: data.status || "planned",
      note: data.note?.trim() || "",
      keyword: data.keyword?.trim() || "",
      keywords2: data.keywords2?.trim() || "",
      internalLink: data.internalLink?.trim() || "",
      intent: data.intent || "",
      source: data.source?.trim() || "",
      facts: data.facts?.trim() || "",
      brandCount: data.brandCount || "3",
      mainQuestion: data.mainQuestion?.trim() || "",
      blogTopics: data.blogTopics || "",
    },
  });

  return NextResponse.json(content, { status: 201 });
}
