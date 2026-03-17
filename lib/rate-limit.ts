// In-memory rate limiter (resets on server restart, suitable for single-instance)
const attempts = new Map<string, { count: number; resetAt: number }>();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of attempts) {
    if (val.resetAt < now) attempts.delete(key);
  }
}, 5 * 60 * 1000);

/**
 * Check if request is rate-limited
 * @returns null if allowed, or seconds until reset if blocked
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): number | null {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  entry.count++;

  if (entry.count > maxAttempts) {
    return Math.ceil((entry.resetAt - now) / 1000);
  }

  return null;
}

/**
 * Get client IP from request headers
 */
export function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
