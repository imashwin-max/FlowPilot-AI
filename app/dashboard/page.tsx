import { Activity, CheckCircle2, Clock3, Inbox, XCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DepartmentChart, StatusChart, TrendChart } from "@/components/charts";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardMetrics } from "@/lib/workflows";
import { formatDate, percentage } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();
  const approvalRate = percentage(metrics.approved, metrics.total);

  return (
    <AppShell>
      <div className="space-y-6 pb-16 lg:pb-0">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">Real-time overview of AI-routed business workflows.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Total Requests" value={metrics.total} hint={`${approvalRate}% approval rate`} icon={Inbox} />
          <MetricCard title="Pending" value={metrics.pending} hint="Awaiting manager action" icon={Clock3} />
          <MetricCard title="Approved" value={metrics.approved} hint="Completed successfully" icon={CheckCircle2} />
          <MetricCard title="Rejected" value={metrics.rejected} hint="Needs revision" icon={XCircle} />
        </div>
        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <Card>
            <CardHeader><CardTitle>Workflow trends</CardTitle></CardHeader>
            <CardContent><TrendChart data={metrics.trendData} /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Status mix</CardTitle></CardHeader>
            <CardContent><StatusChart data={metrics.statusData} /></CardContent>
          </Card>
        </div>
        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader><CardTitle>Requests by department</CardTitle></CardHeader>
            <CardContent><DepartmentChart data={metrics.departmentData} /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Recent activity</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {metrics.activities.map((activity) => (
                <div key={activity.id} className="rounded-md border bg-background p-3">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium">{activity.action}</p>
                    <span className="text-xs text-muted-foreground">{formatDate(activity.created_at)}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{activity.actor} · {activity.details}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
