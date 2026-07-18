import { AppShell } from "@/components/app-shell";
import { WorkflowTable } from "@/components/workflow-table";
import { listWorkflows } from "@/lib/workflows";
import { auth, currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
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
    role = cookieStore.get("flowpilot_mock_role")?.value || "";
    if (!role) {
      redirect("/sign-in");
    }
    requesterFilter = role === "manager" ? undefined : "Demo Employee";
  }

  const requests = await listWorkflows(requesterFilter);
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
