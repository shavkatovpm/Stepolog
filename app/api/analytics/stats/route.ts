import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const userId = await getAuthUser();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(today);
  monthAgo.setDate(monthAgo.getDate() - 30);

  const [
    totalViews,
    todayViews,
    yesterdayViews,
    weekViews,
    monthViews,
    todayBots,
    todayAiBots,
    todayHumans,
    aiBotBreakdown,
    searchBotBreakdown,
    topPages,
    localeBreakdown,
    dailySeries,
    topReferers,
    hourlyDistribution,
  ] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.count({ where: { createdAt: { gte: today } } }),
    prisma.pageView.count({
      where: { createdAt: { gte: yesterday, lt: today } },
    }),
    prisma.pageView.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.pageView.count({ where: { createdAt: { gte: monthAgo } } }),
    prisma.pageView.count({
      where: { createdAt: { gte: today }, isBot: true },
    }),
    prisma.pageView.count({
      where: { createdAt: { gte: today }, isAiBot: true },
    }),
    prisma.pageView.count({
      where: { createdAt: { gte: today }, isBot: false },
    }),
    prisma.pageView.groupBy({
      by: ["botName"],
      where: { isAiBot: true, createdAt: { gte: monthAgo } },
      _count: { _all: true },
      orderBy: { _count: { botName: "desc" } },
    }),
    prisma.pageView.groupBy({
      by: ["botName"],
      where: { isBot: true, isAiBot: false, createdAt: { gte: monthAgo } },
      _count: { _all: true },
      orderBy: { _count: { botName: "desc" } },
    }),
    prisma.pageView.groupBy({
      by: ["path"],
      where: { isBot: false, createdAt: { gte: monthAgo } },
      _count: { _all: true },
      orderBy: { _count: { path: "desc" } },
      take: 15,
    }),
    prisma.pageView.groupBy({
      by: ["locale"],
      where: { isBot: false, createdAt: { gte: monthAgo } },
      _count: { _all: true },
    }),
    prisma.$queryRaw<Array<{ day: Date; total: bigint; humans: bigint; bots: bigint; ai_bots: bigint }>>`
      SELECT
        DATE_TRUNC('day', "createdAt") as day,
        COUNT(*)::bigint as total,
        COUNT(*) FILTER (WHERE "isBot" = false)::bigint as humans,
        COUNT(*) FILTER (WHERE "isBot" = true)::bigint as bots,
        COUNT(*) FILTER (WHERE "isAiBot" = true)::bigint as ai_bots
      FROM "PageView"
      WHERE "createdAt" >= ${monthAgo}
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY day ASC
    `,
    prisma.pageView.groupBy({
      by: ["referer"],
      where: {
        isBot: false,
        createdAt: { gte: monthAgo },
        referer: { not: null },
      },
      _count: { _all: true },
      orderBy: { _count: { referer: "desc" } },
      take: 10,
    }),
    prisma.$queryRaw<Array<{ hour: number; count: bigint }>>`
      SELECT
        EXTRACT(HOUR FROM "createdAt")::int as hour,
        COUNT(*)::bigint as count
      FROM "PageView"
      WHERE "createdAt" >= ${weekAgo} AND "isBot" = false
      GROUP BY EXTRACT(HOUR FROM "createdAt")
      ORDER BY hour ASC
    `,
  ]);

  const serialize = (arr: Array<{ day: Date; total: bigint; humans: bigint; bots: bigint; ai_bots: bigint }>) =>
    arr.map((r) => ({
      day: r.day.toISOString().split("T")[0],
      total: Number(r.total),
      humans: Number(r.humans),
      bots: Number(r.bots),
      aiBots: Number(r.ai_bots),
    }));

  const hourly = Array.from({ length: 24 }, (_, h) => {
    const found = hourlyDistribution.find((x) => x.hour === h);
    return { hour: h, count: found ? Number(found.count) : 0 };
  });

  return NextResponse.json({
    summary: {
      totalViews,
      todayViews,
      yesterdayViews,
      weekViews,
      monthViews,
      todayBots,
      todayAiBots,
      todayHumans,
    },
    aiBots: aiBotBreakdown.map((b) => ({
      name: b.botName || "Unknown",
      count: b._count._all,
    })),
    searchBots: searchBotBreakdown.map((b) => ({
      name: b.botName || "Unknown",
      count: b._count._all,
    })),
    topPages: topPages.map((p) => ({
      path: p.path,
      count: p._count._all,
    })),
    locales: localeBreakdown.map((l) => ({
      locale: l.locale || "unknown",
      count: l._count._all,
    })),
    daily: serialize(dailySeries),
    topReferers: topReferers.map((r) => ({
      referer: r.referer || "",
      count: r._count._all,
    })),
    hourly,
  });
}
