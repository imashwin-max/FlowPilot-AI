"use client";

import { useState } from "react";
import { Bot, Loader2, Send, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PriorityBadge, StatusBadge } from "@/components/status-badge";
import type { ExtractedWorkflow, WorkflowRequest } from "@/lib/types";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  extracted?: ExtractedWorkflow;
  request?: WorkflowRequest;
};

const example = "I need leave tomorrow because of fever.";

export function WorkflowChat() {
  const [message, setMessage] = useState(example);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Tell me what you need in normal language. I will extract the workflow, assign the approver, and create the request."
    }
  ]);

  async function submit() {
    if (!message.trim()) return;
    const current = message.trim();
    setLoading(true);
    setMessages((items) => [...items, { role: "user", content: current }]);
    setMessage("");

    try {
      const apiKey = localStorage.getItem("flowpilot_gemini_key") || "";
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-gemini-api-key": apiKey } : {})
        },
        body: JSON.stringify({ message: current, requester: localStorage.getItem("flowpilot_profile_name") || "Demo User" })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Workflow creation failed");

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
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
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
              <Textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Describe a business request..." className="min-h-[72px]" />
              <Button onClick={submit} disabled={loading} size="icon" className="h-[72px] w-14 shrink-0">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-4">
        {["Need vendor invoice approval by today for 18 lakh renewal.", "Request production log access for incident debugging ASAP.", "Need extra launch campaign budget for paid social creatives."].map((prompt) => (
          <button key={prompt} onClick={() => setMessage(prompt)} className="w-full rounded-lg border bg-card p-4 text-left text-sm leading-6 shadow-sm transition hover:bg-muted">
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
