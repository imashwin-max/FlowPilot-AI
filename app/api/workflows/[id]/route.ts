import { NextResponse } from "next/server";
import { updateWorkflowStatus } from "@/lib/workflows";
import type { WorkflowStatus } from "@/lib/types";
import { assertManagerAuthorized, getClientKey, rateLimit, safeErrorResponse } from "@/lib/server-guards";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = assertManagerAuthorized(request);
  if (authError) return authError;

  const { ok } = rateLimit(`patch:${getClientKey(request)}`, 20, 60_000);
  if (!ok) {
    return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const status = body.status as WorkflowStatus;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "A valid workflow id is required" }, { status: 400 });
    }

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "status must be approved or rejected" }, { status: 400 });
    }

    const comments = typeof body.comments === "string" ? body.comments.slice(0, 2000) : "";
    const actor = typeof body.actor === "string" && body.actor.trim() ? body.actor.slice(0, 120) : "Manager";

    const workflow = await updateWorkflowStatus(id, status, comments, actor);
    return NextResponse.json({ workflow });
  } catch (error) {
    return safeErrorResponse(error, "Unable to update workflow");
  }
}
