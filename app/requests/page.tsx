import { AppShell } from "@/components/app-shell";
import { WorkflowTable } from "@/components/workflow-table";
import { listWorkflows } from "@/lib/workflows";
import type { WorkflowRequest } from "@/lib/types";
import { auth, currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  let role = "manager";
  let requesterFilter: string | undefined;

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

        if (role !== "manager") {
          const user = await currentUser();
          if (user) {
            requesterFilter = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || user.emailAddresses[0]?.emailAddress || "Demo User";
          }
        }
      }
    } catch (authError) {
      console.warn("[requests] Clerk auth error, falling back to mock role:", authError);
    }
  }

  if (!clerkAuthenticated) {
    const cookieStore = await cookies();
    const mockRole = cookieStore.get("flowpilot_mock_role")?.value;
    if (!mockRole) {
      redirect("/sign-in");
    }
    role = mockRole;
    requesterFilter = role === "manager" ? undefined : "Demo Employee";
  }

  let requests: WorkflowRequest[] = [];
  try {
    requests = await listWorkflows(requesterFilter);
  } catch (err) {
    console.error("[requests] Error loading workflows:", err);
    requests = [];
  }
  return (
    <AppShell>
      <div className="space-y-6 pb-16 lg:pb-0">
        <div>
          <h1 className="text-3xl font-semibold">Requests</h1>
          <p className="text-muted-foreground">
            {role === "manager" 
              ? "Search and audit every workflow request in the system." 
              : "Track and audit your submitted workflow requests."}
          </p>
        </div>
        <WorkflowTable requests={requests} />
      </div>
    </AppShell>
  );
}
