import type { ActivityLog, WorkflowRequest } from "@/lib/types";

export const demoRequests: WorkflowRequest[] = [
  {
    id: "REQ-1001",
    title: "Medical leave for fever",
    requester: "Ananya Rao",
    request_type: "Leave Request",
    department: "Human Resources",
    priority: "medium",
    approver: "Meera Iyer",
    summary: "Employee requests one day of medical leave tomorrow due to fever.",
    status: "pending",
    comments: null,
    created_at: new Date(Date.now() - 1000 * 60 * 38).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 38).toISOString()
  },
  {
    id: "REQ-1002",
    title: "Laptop replacement approval",
    requester: "Vikram Menon",
    request_type: "Asset Procurement",
    department: "IT",
    priority: "high",
    approver: "Rohan Shah",
    summary: "Developer laptop battery has failed and needs replacement for sprint delivery.",
    status: "approved",
    comments: "Approved. IT procurement can issue a replacement today.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
  },
  {
    id: "REQ-1003",
    title: "Vendor invoice exception",
    requester: "Sara Khan",
    request_type: "Finance Approval",
    department: "Finance",
    priority: "urgent",
    approver: "Arjun Patel",
    summary: "Invoice exceeds purchase order by 8% and requires finance exception approval.",
    status: "pending",
    comments: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString()
  },
  {
    id: "REQ-1004",
    title: "Campaign budget extension",
    requester: "Neha Gupta",
    request_type: "Budget Approval",
    department: "Marketing",
    priority: "medium",
    approver: "Kavya Nair",
    summary: "Marketing requests an additional budget allocation for launch campaign creatives.",
    status: "rejected",
    comments: "Rejected until revised media plan and ROI estimate are attached.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString()
  },
  {
    id: "REQ-1005",
    title: "Access to production logs",
    requester: "Ishaan Bose",
    request_type: "Access Request",
    department: "Security",
    priority: "high",
    approver: "Priya Das",
    summary: "Engineer needs temporary production log access for incident diagnosis.",
    status: "approved",
    comments: "Approved for 24 hours with audit logging enabled.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 45).toISOString()
  }
];

export const demoActivities: ActivityLog[] = [
  {
    id: "ACT-9001",
    workflow_id: "REQ-1001",
    actor: "FlowPilot AI",
    action: "Workflow created",
    details: "Assigned Human Resources approval to Meera Iyer.",
    created_at: demoRequests[0].created_at
  },
  {
    id: "ACT-9002",
    workflow_id: "REQ-1002",
    actor: "Rohan Shah",
    action: "Approved request",
    details: "Laptop replacement cleared for procurement.",
    created_at: demoRequests[1].updated_at
  },
  {
    id: "ACT-9003",
    workflow_id: "REQ-1004",
    actor: "Kavya Nair",
    action: "Rejected request",
    details: "Budget extension needs stronger ROI estimate.",
    created_at: demoRequests[3].updated_at
  },
  {
    id: "ACT-9004",
    workflow_id: "REQ-1005",
    actor: "Priya Das",
    action: "Approved request",
    details: "Temporary access granted with audit controls.",
    created_at: demoRequests[4].updated_at
  }
];
