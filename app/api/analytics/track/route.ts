import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/db";
import { detectBot } from "@/lib/bot-detection";

export const runtime = "nodejs";

const EXCLUDED_PREFIXES = [
  "/api/",
  "/modad",
  "/_next",
  "/icon",
  "/opengraph-image",
  "/robots.txt",
  "/sitemap.xml",
];

function shouldTrack(path: string): boolean {
  if (path.includes(".")) return false;
  for (const prefix of EXCLUDED_PREFIXES) {
    if (path.startsWith(prefix)) return false;
  }
  return true;
}

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").substring(0, 16);
}

function extractLocale(path: string): string | null {
  if (path === "/ru" || path.startsWith("/ru/")) return "ru";
  if (path === "/" || path.startsWith("/")) return "uz";
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const path: string = body.path || "/";
    const userAgent: string = body.userAgent || "";
    const referer: string = body.referer || "";

    if (!shouldTrack(path)) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const bot = detectBot(userAgent);
    const locale = extractLocale(path);

    await prisma.pageView.create({
      data: {
        path,
        locale,
        userAgent: userAgent.substring(0, 500),
        isBot: bot.isBot,
        isAiBot: bot.isAiBot,
        botName: bot.botName,
        referer: referer ? referer.substring(0, 500) : null,
        ipHash: ip !== "unknown" ? hashIp(ip) : null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Analytics track error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
