export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendTelegram } from "@/lib/telegram";

// Kechki 20:00 — bugungi kontentlar holati
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

  const contents = await prisma.content.findMany({
    where: { publishDate: today },
    include: { project: { select: { name: true } } },
  });

  if (contents.length === 0) {
    return NextResponse.json({ message: "Bugun uchun kontent yo'q" });
  }

  const unpublished = contents.filter((c) => c.status !== "published");
  const statusLabel: Record<string, string> = {
    planned: "Rejalashtirilgan",
    ready: "Tayyor",
    published: "Joylashtirilgan",
  };

  const lines = contents.map((c, i) => {
    const project = c.project.name || "—";
    const type = c.contentType === "brand" ? "Brend" : "Shaxsiy";
    const status = statusLabel[c.status] || c.status;
    const mark = c.status !== "published" ? "🔴" : "✅";
    return `${mark} ${i + 1}. ${c.title}\n\nLoyiha: ${project}\nTuri: ${type}\nHolat: ${status}`;
  });

  const header =
    unpublished.length > 0
      ? `⚠️ ${unpublished.length} ta kontent hali joylanmagan! (${today})`
      : `✅ Barcha kontentlar joylashtirilgan (${today})`;

  const message = `${header}\n\n${lines.join("\n\n")}\n\n📊 Jami: ${contents.length} ta kontent`;

  const sent = await sendTelegram(message);

  return NextResponse.json({ date: today, count: contents.length, sent });
}
