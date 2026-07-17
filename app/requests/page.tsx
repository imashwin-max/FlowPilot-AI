import { AppShell } from "@/components/app-shell";
import { WorkflowTable } from "@/components/workflow-table";
import { listWorkflows } from "@/lib/workflows";
import { auth, currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
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
