export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: "Avtorizatsiya kerak" }, { status: 401 });

  const prompts = await prisma.savedPrompt.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(prompts);
}

export async function POST(req: Request) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: "Avtorizatsiya kerak" }, { status: 401 });

  const data = await req.json();
  if (!data.title?.trim()) return NextResponse.json({ error: "Mavzuni kiriting" }, { status: 400 });

  const prompt = await prisma.savedPrompt.create({
    data: {
      title: data.title.trim(),
      purpose: data.purpose?.trim() || "",
      content: data.content?.trim() || "",
    },
  });
  return NextResponse.json(prompt, { status: 201 });
}
