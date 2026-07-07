import { NextResponse } from "next/server";
import { createWorkflow, listWorkflows } from "@/lib/workflows";

export async function GET() {
  try {
    return NextResponse.json({ requests: await listWorkflows() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load workflows" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.message || typeof body.message !== "string") {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const apiKey = request.headers.get("x-gemini-api-key") || body.apiKey;
    const result = await createWorkflow({
      message: body.message,
      requester: body.requester,
      apiKey
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create workflow" }, { status: 500 });
  }
}
