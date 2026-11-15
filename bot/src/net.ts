// Tashqi saytlarni xavfsiz o'qish: faqat ochiq internet manzillari (server ichki tarmog'i emas) va hajm chegarasi
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export const UA = "Mozilla/5.0 (compatible; StepologBot/1.0; +https://www.stepolog.uz)";
const MAX_BYTES = 2_000_000; // 2 MB dan katta javob o'qilmaydi

function privateIp(ip: string): boolean {
  if (ip.includes(":")) {
    const v = ip.toLowerCase();
    return v === "::1" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80") || v.startsWith("::ffff:") && privateIp(v.slice(7));
  }
  const [a, b] = ip.split(".").map(Number);
  return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
}

// Manzil ochiq internetdami (localhost, 10.x, 192.168.x, 169.254.x va h.k. emas)
export async function isPublicUrl(url: string): Promise<boolean> {
  try {
    const u = new URL(url);
    if (!["http:", "https:"].includes(u.protocol)) return false;
    if (u.port && !["80", "443", "8080"].includes(u.port)) return false;
    const host = u.hostname.replace(/^\[|\]$/g, "");
    const ips = isIP(host) ? [host] : (await lookup(host, { all: true })).map((r) => r.address);
    return ips.length > 0 && !ips.some(privateIp);
  } catch {
    return false;
  }
}

// Sahifani o'qish: tekshiruv, vaqt va hajm chegarasi bilan. Yo'naltirishlar ham qo'lda tekshiriladi
export async function fetchText(url: string, timeoutMs = 10000): Promise<{ text: string; url: string; type: string } | null> {
  let current = url;
  for (let hop = 0; hop < 4; hop++) {
    if (!(await isPublicUrl(current))) return null;
    const res = await fetch(current, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(timeoutMs), redirect: "manual" });
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      current = new URL(res.headers.get("location")!, current).href;
      continue;
    }
    if (!res.ok || !res.body) return null;
    if (Number(res.headers.get("content-length") ?? 0) > MAX_BYTES) return null;
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > MAX_BYTES) { await reader.cancel(); break; }
      chunks.push(value);
    }
    return { text: Buffer.concat(chunks).toString("utf8"), url: current, type: res.headers.get("content-type") ?? "" };
  }
  return null;
}
