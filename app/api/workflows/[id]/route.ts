import { NextResponse } from "next/server";
import { updateWorkflowStatus } from "@/lib/workflows";
import type { WorkflowStatus } from "@/lib/types";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const status = body.status as WorkflowStatus;

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "status must be approved or rejected" }, { status: 400 });
    }

    const workflow = await updateWorkflowStatus(id, status, body.comments || "", body.actor || "Manager");
    return NextResponse.json({ workflow });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update workflow" }, { status: 500 });
  }
}
