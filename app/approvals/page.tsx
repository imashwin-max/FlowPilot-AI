import { AppShell } from "@/components/app-shell";
import { ApprovalsBoard } from "@/components/approvals-board";
import { listWorkflows } from "@/lib/workflows";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const { sessionClaims } = await auth();
  let role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!role) {
    const user = await currentUser();
    role = (user?.publicMetadata?.role as string) || "employee";
  }

  if (role !== "manager") {
    redirect("/dashboard");
  }

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
