import { NextResponse } from "next/server";
import { createWorkflow, listWorkflows } from "@/lib/workflows";
import { getClientKey, isAdminAuthorized, rateLimit, safeErrorResponse } from "@/lib/server-guards";
import { auth, currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";

const MAX_MESSAGE_LENGTH = 2000;

export async function GET(request: Request) {
  try {
    if (isAdminAuthorized(request)) {
      return NextResponse.json({ requests: await listWorkflows() });
    }

    let role = "manager";
    let requesterFilter: string | undefined;

    const hasClerkKeys = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

    if (hasClerkKeys) {
      const { sessionClaims } = await auth();
      role = (sessionClaims?.metadata as { role?: string })?.role || "";

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
    } else {
      const cookieStore = await cookies();
      role = cookieStore.get("flowpilot_mock_role")?.value || "manager";
      requesterFilter = role === "manager" ? undefined : "Demo Employee";
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
    const body = await request.json();
    if (!body.message || typeof body.message !== "string" || !body.message.trim()) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }
    if (body.message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: `message must be under ${MAX_MESSAGE_LENGTH} characters` }, { status: 400 });
    }

    let requester = "Demo User";
    const hasClerkKeys = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

    if (hasClerkKeys) {
      const user = await currentUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      requester = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || user.emailAddresses[0]?.emailAddress || "Demo User";
    } else {
      const cookieStore = await cookies();
      const role = cookieStore.get("flowpilot_mock_role")?.value || "manager";
      requester = body.requester || (role === "manager" ? "Demo Manager" : "Demo Employee");
    }
    const result = await createWorkflow({ message: body.message, requester });

    if (result.status === "clarify") {
      return NextResponse.json({ status: "needs_clarification", question: result.question });
    }

    return NextResponse.json({ status: "created", request: result.request, extracted: result.extracted }, { status: 201 });
  } catch (error) {
    return safeErrorResponse(error, "Unable to create workflow");
  }
}
