export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendTelegram } from "@/lib/telegram";

// Kechki 20:00 — bugungi + kechikkan kontentlar holati
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Tashkent" })
  )
    .toISOString()
    .split("T")[0];

  // Bugungi barcha kontentlar
  const todayContents = await prisma.content.findMany({
    where: { publishDate: today },
    include: { project: { select: { name: true } } },
  });

  // Kechikkan: o'tgan sanali, hali joylanmagan
  const overdueContents = await prisma.content.findMany({
    where: {
      publishDate: { lt: today, not: "" },
      status: { not: "published" },
    },
    include: { project: { select: { name: true } } },
  });

  if (todayContents.length === 0 && overdueContents.length === 0) {
    return NextResponse.json({ message: "Bugun uchun kontent yo'q" });
  }

  const statusLabel: Record<string, string> = {
    planned: "Rejalashtirilgan",
    ready: "Tayyor",
    published: "Joylashtirilgan",
  };

  const formatLine = (c: any, i: number, overdue = false) => {
    const project = c.project.name || "—";
    const type = c.contentType === "brand" ? "Brend" : "Shaxsiy";
    const status = statusLabel[c.status] || c.status;
    const mark = c.status !== "published" ? "🔴" : "✅";
    const date = overdue ? `\nSana: ${c.publishDate}` : "";
    return `${mark} ${i + 1}. ${c.title}\n\nLoyiha: ${project}\nTuri: ${type}\nHolat: ${status}${date}`;
  };

  const parts: string[] = [];

  if (todayContents.length > 0) {
    const unpublished = todayContents.filter((c) => c.status !== "published");
    const header =
      unpublished.length > 0
        ? `⚠️ ${unpublished.length} ta kontent hali joylanmagan! (${today})`
        : `✅ Barcha kontentlar joylashtirilgan (${today})`;
    const lines = todayContents.map((c, i) => formatLine(c, i));
    parts.push(`${header}\n\n${lines.join("\n\n")}`);
  }

  if (overdueContents.length > 0) {
    const lines = overdueContents.map((c, i) => formatLine(c, i, true));
    parts.push(`🚨 Kechikkan kontentlar: ${overdueContents.length} ta\n\n${lines.join("\n\n")}`);
  }

  const total = todayContents.length + overdueContents.length;
  const message = parts.join("\n\n━━━━━━━━━━━━━━━\n\n") + `\n\n📊 Jami: ${total} ta kontent`;

  const sent = await sendTelegram(message);

  return NextResponse.json({ date: today, count: total, sent });
}
