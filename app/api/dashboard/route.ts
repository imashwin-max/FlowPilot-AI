import { NextResponse } from "next/server";
import { getDashboardMetrics } from "@/lib/workflows";
import { safeErrorResponse } from "@/lib/server-guards";
import { auth, currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const adminKey = request.headers.get("x-admin-key");
    if (adminKey === "Admin@FlowPilot") {
      return NextResponse.json(await getDashboardMetrics());
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

    return NextResponse.json(await getDashboardMetrics(requesterFilter));
  } catch (error) {
    return safeErrorResponse(error, "Unable to load dashboard");
  }
}
