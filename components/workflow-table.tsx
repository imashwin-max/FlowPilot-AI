"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PriorityBadge, StatusBadge } from "@/components/status-badge";
import type { WorkflowRequest } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function WorkflowTable({ requests }: { requests: WorkflowRequest[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const search = query.toLowerCase();
    return requests.filter((request) =>
      [request.title, request.requester, request.department, request.request_type, request.approver, request.status]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [query, requests]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search requests, people, departments" className="pl-9" />
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Approver</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="font-medium">{request.title}</div>
                  <div className="text-xs text-muted-foreground">{request.requester} · {request.request_type}</div>
                </TableCell>
                <TableCell>{request.department}</TableCell>
                <TableCell>{request.approver}</TableCell>
                <TableCell><PriorityBadge priority={request.priority} /></TableCell>
                <TableCell><StatusBadge status={request.status} /></TableCell>
                <TableCell>{formatDate(request.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
