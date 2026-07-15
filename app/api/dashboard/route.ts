import { NextResponse } from "next/server";
import { getDashboardMetrics } from "@/lib/workflows";
import { safeErrorResponse } from "@/lib/server-guards";

export async function GET() {
  try {
    return NextResponse.json(await getDashboardMetrics());
  } catch (error) {
    return safeErrorResponse(error, "Unable to load dashboard");
  }
}
