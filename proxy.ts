import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { matchLegacy } from "./lib/legacy-urls";

const GONE_HTML = `<!doctype html><html lang="uz"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sahifa olib tashlangan | Stepolog</title></head><body style="font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0"><main style="text-align:center;padding:16px"><h1>Bu sahifa olib tashlangan</h1><p><a href="/">Stepolog bosh sahifasiga o'tish</a></p></main></body></html>`;

export function proxy(req: NextRequest) {
  const legacy = matchLegacy(req.nextUrl.pathname);
  if (!legacy) return NextResponse.next();

  if (legacy.type === "redirect") {
    return NextResponse.redirect(new URL(legacy.to, req.url), 301);
  }

  return new NextResponse(GONE_HTML, {
    status: 410,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "noindex",
    },
  });
}

export const config = {
  matcher: ["/((?!_next|icon|apple-icon|.*\\..*).*)"],
};
