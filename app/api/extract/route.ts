import { NextResponse } from "next/server";
import { extractWorkflow } from "@/lib/workflows";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.message || typeof body.message !== "string") {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const apiKey = request.headers.get("x-gemini-api-key") || body.apiKey;
    return NextResponse.json(await extractWorkflow(body.message, apiKey));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to extract workflow" }, { status: 500 });
  }
}
