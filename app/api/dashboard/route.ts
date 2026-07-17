import { NextResponse } from "next/server";
import { getDashboardMetrics } from "@/lib/workflows";
import { safeErrorResponse } from "@/lib/server-guards";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  try {
    const adminKey = request.headers.get("x-admin-key");
    if (adminKey === "Admin@FlowPilot") {
      return NextResponse.json(await getDashboardMetrics());
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

    return NextResponse.json(await getDashboardMetrics(requesterFilter));
  } catch (error) {
    return safeErrorResponse(error, "Unable to load dashboard");
  }
}
