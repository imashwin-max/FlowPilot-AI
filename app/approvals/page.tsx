import { AppShell } from "@/components/app-shell";
import { ApprovalsBoard } from "@/components/approvals-board";
import { listWorkflows } from "@/lib/workflows";
import type { WorkflowRequest } from "@/lib/types";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  let role = "manager";
  const hasClerkKeys = !!(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
  let clerkAuthenticated = false;

  if (hasClerkKeys) {
    try {
      const { userId, sessionClaims } = await auth();
      if (userId) {
        clerkAuthenticated = true;
        role = (sessionClaims?.metadata as { role?: string })?.role || "";

        if (!role) {
          const user = await currentUser();
          role = (user?.publicMetadata?.role as string) || "employee";
        }
      }
    } catch (authError) {
      console.warn("[approvals] Clerk auth error, falling back to mock role:", authError);
    }
  }

  if (!clerkAuthenticated) {
    const cookieStore = await cookies();
    const mockRole = cookieStore.get("flowpilot_mock_role")?.value;
    if (!mockRole) {
      redirect("/sign-in");
    }
    role = mockRole;
  }

  if (role !== "manager") {
    redirect("/dashboard");
  }

  let requests: WorkflowRequest[] = [];
  try {
    requests = await listWorkflows();
  } catch (err) {
    console.error("[approvals] Error loading workflows:", err);
    requests = [];
  }
  return (
    <AppShell>
      <div className="space-y-6 pb-16 lg:pb-0">
        <div>
          <h1 className="text-3xl font-semibold">Approvals</h1>
          <p className="text-muted-foreground">Manager workspace for reviewing, approving, and rejecting routed requests.</p>
        </div>
        <ApprovalsBoard initialRequests={requests} />
      </div>
    </AppShell>
  );
}
