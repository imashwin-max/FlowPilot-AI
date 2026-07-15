import { NextResponse } from "next/server";
import { createWorkflow, listWorkflows } from "@/lib/workflows";
import { getClientKey, rateLimit, safeErrorResponse } from "@/lib/server-guards";

const MAX_MESSAGE_LENGTH = 2000;

export async function GET() {
  try {
    return NextResponse.json({ requests: await listWorkflows() });
  } catch (error) {
    return safeErrorResponse(error, "Unable to load workflows");
  }
}

export async function POST(request: Request) {
  const { ok } = rateLimit(`create:${getClientKey(request)}`, 15, 60_000);
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

    const requester = typeof body.requester === "string" && body.requester.trim() ? body.requester.slice(0, 120) : undefined;
    const result = await createWorkflow({ message: body.message, requester });

    if (result.status === "clarify") {
      return NextResponse.json({ status: "needs_clarification", question: result.question });
    }

    return NextResponse.json({ status: "created", request: result.request, extracted: result.extracted }, { status: 201 });
  } catch (error) {
    return safeErrorResponse(error, "Unable to create workflow");
  }
}
