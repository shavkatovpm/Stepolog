export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendTelegram } from "@/lib/telegram";

// Kechki 20:00 — hali joylanmagan kontentlar eslatmasi
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tashkent" })).toISOString().split("T")[0];

  const contents = await prisma.content.findMany({
    where: { publishDate: today, status: { not: "published" } },
    include: { project: { select: { name: true, domain: true } } },
  });

  if (contents.length === 0) {
    return NextResponse.json({ message: "Hammasi joylashtirilgan yoki bugun uchun kontent yo'q" });
  }

  const statusLabel: Record<string, string> = { planned: "Rejalashtirilgan", ready: "Tayyor" };

  const lines = contents.map((c, i) => {
    const project = c.project.name || "—";
    const type = c.contentType === "brand" ? "Brend" : "Shaxsiy";
    const status = statusLabel[c.status] || c.status;
    return `${i + 1}. ${c.title}\n\nLoyiha: ${project}\nTuri: ${type}\nHolat: ${status}`;
  });

  const message =
    `🔴 Hali joylanmagan kontentlar (${today}):\n\n` +
    lines.join("\n\n") +
    `\n\n⚠️ ${contents.length} ta kontent hali chiqarilmagan!`;

  const sent = await sendTelegram(message);

  return NextResponse.json({ date: today, count: contents.length, sent });
}
