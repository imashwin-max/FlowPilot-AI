import { AppShell } from "@/components/app-shell";
import { WorkflowChat } from "@/components/workflow-chat";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  const hasClerkKeys = !!(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
  let clerkAuthenticated = false;

  if (hasClerkKeys) {
    try {
      const { userId } = await auth();
      if (userId) clerkAuthenticated = true;
    } catch (authError) {
      console.warn("[chat] Clerk auth check failed, checking mock role:", authError);
    }
  }

  if (!clerkAuthenticated) {
    const cookieStore = await cookies();
    if (!cookieStore.get("flowpilot_mock_role")?.value) {
      redirect("/sign-in");
    }
  }

  return (
    <AppShell>
      <div className="space-y-6 pb-16 lg:pb-0">
        <div>
          <h1 className="text-3xl font-semibold">AI Workflow Chat</h1>
          <p className="text-muted-foreground">Create approval workflows from natural language and inspect the extracted JSON.</p>
        </div>
        <WorkflowChat />
      </div>
    </AppShell>
  );
}
