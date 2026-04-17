import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Simple in-memory rate limiter for API routes (Edge-compatible)
const apiHits = new Map<string, { count: number; resetAt: number }>();
const API_MAX = 60;
const API_WINDOW = 60 * 1000;

function trackPageView(req: NextRequest) {
  if (req.method !== "GET") return;
  const path = req.nextUrl.pathname;
  const userAgent = req.headers.get("user-agent") || "";
  const referer = req.headers.get("referer") || "";
  const forwardedFor = req.headers.get("x-forwarded-for") || "";

  fetch(`${req.nextUrl.origin}/api/analytics/track`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": forwardedFor,
    },
    body: JSON.stringify({ path, userAgent, referer }),
    keepalive: true,
  }).catch(() => {});
}

function getRateLimitKey(req: NextRequest): string {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  return `api:${ip}`;
}

function rateLimitApi(req: NextRequest): NextResponse | null {
  const key = getRateLimitKey(req);
  const now = Date.now();
  const entry = apiHits.get(key);

  if (!entry || entry.resetAt < now) {
    apiHits.set(key, { count: 1, resetAt: now + API_WINDOW });
    return null;
  }

  entry.count++;

  if (entry.count > API_MAX) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  return null;
}

export function middleware(req: NextRequest) {
  // API routes: rate limit only, skip i18n
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const limited = rateLimitApi(req);
    return limited ?? NextResponse.next();
  }

  // Admin panel: skip i18n
  if (req.nextUrl.pathname.startsWith("/modad")) {
    return NextResponse.next();
  }

  // Public routes: track page view (fire-and-forget) then handle i18n
  trackPageView(req);
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next|icon|opengraph-image|.*\\..*).*)"],
};
