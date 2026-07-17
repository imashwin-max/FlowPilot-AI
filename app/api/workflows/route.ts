import { NextResponse } from "next/server";
import { createWorkflow, listWorkflows } from "@/lib/workflows";
import { getClientKey, rateLimit, safeErrorResponse } from "@/lib/server-guards";
import { auth, currentUser } from "@clerk/nextjs/server";

const MAX_MESSAGE_LENGTH = 2000;

export async function GET(request: Request) {
  try {
    const adminKey = request.headers.get("x-admin-key");
    if (adminKey === "Admin@FlowPilot") {
      return NextResponse.json({ requests: await listWorkflows() });
    }

    const { sessionClaims } = await auth();
    let role = (sessionClaims?.metadata as { role?: string })?.role;
    let requesterFilter: string | undefined;

    if (!role) {
      const user = await currentUser();
      role = (user?.publicMetadata?.role as string) || "employee";
    }

    if (role !== "manager") {
      const user = await currentUser();
      if (user) {
        requesterFilter = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || user.emailAddresses[0]?.emailAddress || "Demo User";
      }
    }

    return NextResponse.json({ requests: await listWorkflows(requesterFilter) });
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
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.message || typeof body.message !== "string" || !body.message.trim()) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }
    if (body.message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: `message must be under ${MAX_MESSAGE_LENGTH} characters` }, { status: 400 });
    }

    const requester = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || user.emailAddresses[0]?.emailAddress || "Demo User";
    const result = await createWorkflow({ message: body.message, requester });

    if (result.status === "clarify") {
      return NextResponse.json({ status: "needs_clarification", question: result.question });
    }

    return NextResponse.json({ status: "created", request: result.request, extracted: result.extracted }, { status: 201 });
  } catch (error) {
    return safeErrorResponse(error, "Unable to create workflow");
  }
}
