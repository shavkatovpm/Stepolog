export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendTelegram } from "@/lib/telegram";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  const contents = await prisma.content.findMany({
    where: { publishDate: today, status: { not: "published" } },
    include: { project: { select: { name: true, domain: true } } },
  });

  if (contents.length === 0) {
    return NextResponse.json({ message: "Bugun uchun kontent yo'q yoki hammasi joylashtirilgan" });
  }

  const statusLabel: Record<string, string> = { planned: "Rejalashtirilgan", ready: "Tayyor" };

  const lines = contents.map((c, i) => {
    const project = c.project.name || "—";
    const type = c.contentType === "brand" ? "Brend" : "Shaxsiy";
    const status = statusLabel[c.status] || c.status;
    return `${i + 1}. <b>${c.title}</b>\n   Loyiha: ${project} | Turi: ${type} | Holat: ${status}`;
  });

  const message =
    `⚠️ <b>Hali joylanmagan kontentlar (${today}):</b>\n\n` +
    lines.join("\n\n") +
    `\n\n📊 Jami: ${contents.length} ta kontent hali chiqarilmagan`;

  const sent = await sendTelegram(message);

  return NextResponse.json({
    date: today,
    count: contents.length,
    sent,
  });
}
