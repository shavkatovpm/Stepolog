import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiter for API routes (Edge-compatible)
const apiHits = new Map<string, { count: number; resetAt: number }>();

// API rate limit: 60 requests per minute per IP
const API_MAX = 60;
const API_WINDOW = 60 * 1000;

function getRateLimitKey(req: NextRequest): string {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "unknown";
  return `api:${ip}`;
}

export function middleware(req: NextRequest) {
  // Only rate-limit API routes
  if (!req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const key = getRateLimitKey(req);
  const now = Date.now();
  const entry = apiHits.get(key);

  if (!entry || entry.resetAt < now) {
    apiHits.set(key, { count: 1, resetAt: now + API_WINDOW });
    return NextResponse.next();
  }

  entry.count++;

  if (entry.count > API_MAX) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Juda ko'p so'rov. Biroz kuting." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
