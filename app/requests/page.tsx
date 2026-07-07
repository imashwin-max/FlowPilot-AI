import { AppShell } from "@/components/app-shell";
import { WorkflowTable } from "@/components/workflow-table";
import { listWorkflows } from "@/lib/workflows";

export default async function RequestsPage() {
  const requests = await listWorkflows();
  return (
    <AppShell>
      <div className="space-y-6 pb-16 lg:pb-0">
        <div>
          <h1 className="text-3xl font-semibold">Requests</h1>
          <p className="text-muted-foreground">Search and audit every workflow request in the system.</p>
        </div>
        <WorkflowTable requests={requests} />
      </div>
    </AppShell>
  );
}
