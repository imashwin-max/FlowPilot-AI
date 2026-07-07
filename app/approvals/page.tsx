import { AppShell } from "@/components/app-shell";
import { ApprovalsBoard } from "@/components/approvals-board";
import { listWorkflows } from "@/lib/workflows";

export default async function ApprovalsPage() {
  const requests = await listWorkflows();
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
