import { NextResponse } from "next/server";

/**
 * Very small in-memory sliding-window rate limiter.
 *
 * This is intentionally simple: it's per-instance memory (resets on cold start,
 * won't coordinate across multiple serverless instances). That's an acceptable
 * tradeoff for a hackathon MVP to stop naive abuse/cost spikes, but it is NOT a
 * substitute for a real distributed limiter (e.g. Upstash Redis) in production.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; remaining: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0 };
  }

  bucket.count += 1;
  return { ok: true, remaining: limit - bucket.count };
}

export function getClientKey(request: Request): string {
  // Vercel/most proxies set x-forwarded-for; fall back to a constant so
  // local dev doesn't throw, at the cost of a shared bucket locally.
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "local";
}

/**
 * Guards manager-only actions (approve/reject) behind a shared passcode.
 * Not a real auth system - but it means these actions require something
 * the caller must have been given out-of-band, instead of being wide open
 * to anyone who can guess or enumerate a request id.
 *
 * Set MANAGER_ACCESS_CODE in your environment (Vercel + .env.local) to enable.
 * If it's unset, the app falls back to open access so local/demo setups
 * without the env var don't break - but a console warning is logged so this
 * is never silently insecure without the developer knowing.
 */
export function assertManagerAuthorized(request: Request): NextResponse | null {
  const configuredCode = process.env.MANAGER_ACCESS_CODE;

  if (!configuredCode) {
    console.warn(
      "[security] MANAGER_ACCESS_CODE is not set - approve/reject endpoints are UNPROTECTED. Set this env var before your demo/deploy."
    );
    return null;
  }

  const providedCode = request.headers.get("x-manager-code");
  if (providedCode !== configuredCode) {
    return NextResponse.json({ error: "Not authorized to perform this action." }, { status: 401 });
  }

  return null;
}

/**
 * Strips internal error detail before it reaches the client. Logs the full
 * error server-side (visible in Vercel function logs) but only ever returns
 * a safe, generic message to the caller.
 */
export function safeErrorResponse(error: unknown, publicMessage: string, status = 500): NextResponse {
  console.error(`[api-error] ${publicMessage}:`, error);
  return NextResponse.json({ error: publicMessage }, { status });
}
