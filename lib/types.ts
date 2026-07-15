export type WorkflowStatus = "pending" | "approved" | "rejected";
export type Priority = "low" | "medium" | "high" | "urgent";

export type WorkflowRequest = {
  id: string;
  title: string;
  requester: string;
  request_type: string;
  department: string;
  priority: Priority;
  approver: string;
  summary: string;
  status: WorkflowStatus;
  comments: string | null;
  created_at: string;
  updated_at: string;
};

export type ActivityLog = {
  id: string;
  workflow_id: string | null;
  actor: string;
  action: string;
  details: string;
  created_at: string;
};

export type ExtractedWorkflow = {
  requestType: string;
  department: string;
  priority: Priority;
  requiredApprover: string;
  summary: string;
  confidence?: { requestType: number; requiredApprover: number };
};

export type ExtractionResult =
  | { status: "ok"; data: ExtractedWorkflow }
  | { status: "clarify"; question: string };

export type DashboardMetrics = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  departmentData: { name: string; value: number }[];
  statusData: { name: string; value: number }[];
  trendData: { date: string; requests: number; approved: number }[];
  activities: ActivityLog[];
  requests: WorkflowRequest[];
};
