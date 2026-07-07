import { AppShell } from "@/components/app-shell";
import { WorkflowChat } from "@/components/workflow-chat";

export default function ChatPage() {
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
