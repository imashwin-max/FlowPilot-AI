import { NextResponse } from "next/server";
import { getClientKey, rateLimit } from "@/lib/server-guards";

// This endpoint exists so the admin password comparison happens on the
// server, never in client-side JavaScript. A client component cannot safely
// hold a secret to compare against - anything in client code ships in the
// browser bundle and is readable by anyone (view-source, devtools, or the
// public GitHub repo). The actual secret lives only in ADMIN_ACCESS_CODE,
// a server-only environment variable.
export async function POST(request: Request) {
  const { ok } = rateLimit(`admin-login:${getClientKey(request)}`, 10, 60_000);
  if (!ok) {
    return NextResponse.json({ error: "Too many attempts. Please wait a moment and try again." }, { status: 429 });
  }

  const configuredCode = process.env.ADMIN_ACCESS_CODE;
  if (!configuredCode) {
    return NextResponse.json({ error: "Admin access is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (password !== configuredCode) {
    return NextResponse.json({ error: "Invalid password credentials." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
