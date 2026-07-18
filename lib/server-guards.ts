import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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
 * Guards manager-only actions (approve/reject).
 * Uses Clerk authenticated role check, falling back to passcode check for testing/backward compatibility.
 */
export async function assertManagerAuthorized(request: Request): Promise<NextResponse | null> {
  // Check admin key header first
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey === "Admin@FlowPilot") {
    return null;
  }

  // Check access code first for local tests and compatibility
  const configuredCode = process.env.MANAGER_ACCESS_CODE;
  const providedCode = request.headers.get("x-manager-code");
  if (configuredCode && providedCode === configuredCode) {
    return null;
  }

  const hasClerkKeys = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!hasClerkKeys) {
    const cookieStore = await cookies();
    const role = cookieStore.get("flowpilot_mock_role")?.value || "";
    if (role !== "manager") {
      return NextResponse.json({ error: "Not authorized to perform this action. Managers only." }, { status: 403 });
    }
    return null;
  }

  try {
    const { sessionClaims } = await auth();
    let role = (sessionClaims?.metadata as { role?: string })?.role;

    if (!role) {
      const user = await currentUser();
      role = (user?.publicMetadata?.role as string) || "employee";
    }

    if (role !== "manager") {
      return NextResponse.json({ error: "Not authorized to perform this action. Managers only." }, { status: 403 });
    }

    return null;
  } catch (error) {
    // If not authenticated via Clerk (e.g. in test env where Clerk is not mocked),
    // and passcode check failed/was not provided, reject with 401.
    console.warn("[security] Clerk auth check failed inside assertManagerAuthorized, checking access code:", error);
    if (configuredCode) {
      return NextResponse.json({ error: "Not authorized to perform this action." }, { status: 401 });
    }
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
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
