import { Badge } from "@/components/ui/badge";
import type { Priority, WorkflowStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: WorkflowStatus }) {
  const variant = status === "approved" ? "success" : status === "rejected" ? "destructive" : "warning";
  return <Badge variant={variant}>{status}</Badge>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const variant = priority === "urgent" || priority === "high" ? "destructive" : priority === "medium" ? "warning" : "default";
  return <Badge variant={variant}>{priority}</Badge>;
}
