import { NextResponse } from "next/server";
import { extractWorkflow } from "@/lib/workflows";
import { getClientKey, rateLimit, safeErrorResponse } from "@/lib/server-guards";

const MAX_MESSAGE_LENGTH = 2000;

export async function POST(request: Request) {
  const { ok } = rateLimit(`extract:${getClientKey(request)}`, 15, 60_000);
  if (!ok) {
    return NextResponse.json({ error: "Too many requests. Please slow down and try again shortly." }, { status: 429 });
  }

  try {
    const body = await request.json();
    if (!body.message || typeof body.message !== "string" || !body.message.trim()) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }
    if (body.message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: `message must be under ${MAX_MESSAGE_LENGTH} characters` }, { status: 400 });
    }

    return NextResponse.json(await extractWorkflow(body.message));
  } catch (error) {
    return safeErrorResponse(error, "Unable to extract workflow");
  }
}
