import { AppShell } from "@/components/app-shell";
import { WorkflowChat } from "@/components/workflow-chat";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const hasClerkKeys = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!hasClerkKeys) {
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
