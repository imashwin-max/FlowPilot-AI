"use client";

import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PriorityBadge, StatusBadge } from "@/components/status-badge";
import type { WorkflowRequest, WorkflowStatus } from "@/lib/types";

export function ApprovalsBoard({ initialRequests }: { initialRequests: WorkflowRequest[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function decide(id: string, status: WorkflowStatus) {
    setLoadingId(id);
    try {
      const response = await fetch(`/api/workflows/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, comments: comments[id] || "", actor: localStorage.getItem("flowpilot_profile_name") || "Manager" })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");
      setRequests((items) => items.map((item) => (item.id === id ? data.workflow : item)));
      toast.success(`Request ${status}`, { description: data.workflow.title });
    } catch (error) {
      toast.error("Decision failed", { description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">{request.title}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">{request.requester} · {request.department}</p>
              </div>
              <StatusBadge status={request.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-6 text-muted-foreground">{request.summary}</p>
            <div className="flex flex-wrap gap-2">
              <PriorityBadge priority={request.priority} />
              <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium">Approver: {request.approver}</span>
              <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium">{request.request_type}</span>
            </div>
            <Textarea
              value={comments[request.id] || request.comments || ""}
              onChange={(event) => setComments((value) => ({ ...value, [request.id]: event.target.value }))}
              placeholder="Add manager comments"
            />
            <div className="flex gap-2">
              <Button onClick={() => decide(request.id, "approved")} disabled={loadingId === request.id || request.status !== "pending"} className="flex-1">
                {loadingId === request.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Approve
              </Button>
              <Button onClick={() => decide(request.id, "rejected")} disabled={loadingId === request.id || request.status !== "pending"} variant="destructive" className="flex-1">
                <X className="h-4 w-4" />
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
