import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { matchLegacy } from "./lib/legacy-urls";

// Tillar: "/" inglizcha (ichkarida /en), "/uz", "/ru"
const PREFIXED = ["uz", "ru"];

const GONE_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page removed | Stepolog</title></head><body style="font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#1c1c1c;color:#f2f2f2"><main style="text-align:center;padding:16px"><h1>This page has been removed</h1><p>Bu sahifa olib tashlangan · Страница удалена</p><p><a style="color:#FFDE59" href="/">stepolog.uz</a></p></main></body></html>`;

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Eski sayt sahifalari: 301 yoki 410
  const legacy = matchLegacy(pathname);
  if (legacy?.type === "redirect") return NextResponse.redirect(new URL(legacy.to, req.url), 301);
  if (legacy?.type === "gone") {
    return new NextResponse(GONE_HTML, {
      status: 410,
      headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" },
    });
  }

  // 2. /en/... ni kanonik prefikssiz manzilga
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 301);
  }

  // 3. /uz, /ru o'z holicha
  const first = pathname.split("/")[1];
  if (PREFIXED.includes(first)) return NextResponse.next();

  // 4. Qolgani inglizcha
  const url = req.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|api|icon|apple-icon|.*\\..*).*)"],
};
