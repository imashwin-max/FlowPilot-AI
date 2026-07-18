import { AppShell } from "@/components/app-shell";
import { ApprovalsBoard } from "@/components/approvals-board";
import { listWorkflows } from "@/lib/workflows";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  let role = "manager";
  const hasClerkKeys = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (hasClerkKeys) {
    const { sessionClaims } = await auth();
    role = (sessionClaims?.metadata as { role?: string })?.role || "";

    if (!role) {
      const user = await currentUser();
      role = (user?.publicMetadata?.role as string) || "employee";
    }
  } else {
    const cookieStore = await cookies();
    role = cookieStore.get("flowpilot_mock_role")?.value || "";
    if (!role) {
      redirect("/sign-in");
    }
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
