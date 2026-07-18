"use client";

import { useState, useEffect } from "react";
import { Bot, Loader2, Send, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PriorityBadge, StatusBadge } from "@/components/status-badge";
import type { ExtractedWorkflow, WorkflowRequest } from "@/lib/types";
import { useUser } from "@clerk/nextjs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  extracted?: ExtractedWorkflow;
  request?: WorkflowRequest;
};

const example = "I need leave tomorrow because of fever.";

export function WorkflowChat() {
  const hasClerkKeys = typeof window !== "undefined" && !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (hasClerkKeys) {
    return <ClerkWorkflowChat />;
  }

  return <DemoWorkflowChat />;
}

function ClerkWorkflowChat() {
  const { user } = useUser();
  const requesterName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || user.primaryEmailAddress?.emailAddress || "Demo User"
    : "Demo User";

  return <BaseWorkflowChat requesterName={requesterName} />;
}

function DemoWorkflowChat() {
  const [requesterName, setRequesterName] = useState("Demo Employee");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const profileName = localStorage.getItem("flowpilot_profile_name");
      if (profileName) {
        setRequesterName(profileName);
      } else {
        const match = document.cookie.match(/(^| )flowpilot_mock_role=([^;]+)/);
        if (match) {
          setRequesterName(match[2] === "manager" ? "Demo Manager" : "Demo Employee");
        }
      }
    }
  }, []);

  return <BaseWorkflowChat requesterName={requesterName} />;
}

function BaseWorkflowChat({ requesterName }: { requesterName: string }) {
  const [message, setMessage] = useState(example);
  const [loading, setLoading] = useState(false);
  const [pendingContext, setPendingContext] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Tell me what you need in normal language. I will extract the workflow, assign the approver, and create the request."
    }
  ]);

  async function submit() {
    if (!message.trim()) return;
    const current = message.trim();
    const combined = pendingContext ? `${pendingContext}\n\nAdditional detail: ${current}` : current;
    setLoading(true);
    setMessages((items) => [...items, { role: "user", content: current }]);
    setMessage("");

    try {
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: combined, requester: requesterName })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Workflow creation failed");

      if (data.status === "needs_clarification") {
        setPendingContext(combined);
        setMessages((items) => [...items, { role: "assistant", content: data.question }]);
        return;
      }

      setPendingContext(null);
      setMessages((items) => [
        ...items,
        {
          role: "assistant",
          content: "Workflow created and routed successfully.",
          extracted: data.extracted,
          request: data.request
        }
      ]);
      toast.success("Workflow created", { description: `Assigned to ${data.request.approver}` });
    } catch (error) {
      toast.error("Unable to create workflow", { description: error instanceof Error ? error.message : "Please try again." });
      setMessages((items) => [...items, { role: "assistant", content: "I could not create that workflow. Check configuration and try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <Card className="min-h-[620px]">
        <CardContent className="flex min-h-[620px] flex-col p-0">
          <div className="flex-1 space-y-4 overflow-y-auto p-5" role="log" aria-live="polite" aria-label="Workflow chat messages">
            {messages.map((item, index) => (
              <div key={index} className={`flex gap-3 ${item.role === "user" ? "justify-end" : "justify-start"}`}>
                {item.role === "assistant" ? <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground"><Bot className="h-4 w-4" /></div> : null}
                <div className={`max-w-[82%] rounded-lg border p-4 ${item.role === "user" ? "bg-primary text-primary-foreground" : "bg-background"}`}>
                  <p className="text-sm leading-6">{item.content}</p>
                  {item.extracted ? (
                    <pre className="mt-4 overflow-auto rounded-md bg-slate-950 p-3 text-xs text-slate-50">{JSON.stringify(item.extracted, null, 2)}</pre>
                  ) : null}
                  {item.request ? (
                    <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                      <span>Approver: {item.request.approver}</span>
                      <span>Department: {item.request.department}</span>
                      <span><PriorityBadge priority={item.request.priority} /></span>
                      <span><StatusBadge status={item.request.status} /></span>
                    </div>
                  ) : null}
                </div>
                {item.role === "user" ? <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground"><UserRound className="h-4 w-4" /></div> : null}
              </div>
            ))}
          </div>
          <div className="border-t p-4">
            <div className="flex gap-3">
              <Textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    submit();
                  }
                }}
                placeholder="Describe a business request... (Enter to send, Shift+Enter for a new line)"
                className="min-h-[72px]"
              />
              <Button onClick={submit} disabled={loading} size="icon" className="h-[72px] w-14 shrink-0" aria-label="Send request">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-4">
        {["Need vendor invoice approval by today for 18 lakh renewal.", "Request production log access for incident debugging ASAP.", "I need Friday off."].map((prompt) => (
          <button key={prompt} onClick={() => setMessage(prompt)} className="w-full rounded-lg border bg-card p-4 text-left text-sm leading-6 shadow-sm transition hover:bg-muted">
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
