import { AppShell } from "@/components/app-shell";
import { DepartmentChart, StatusChart, TrendChart } from "@/components/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardMetrics } from "@/lib/workflows";
import { percentage } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const metrics = await getDashboardMetrics();
  const completed = metrics.approved + metrics.rejected;

  return (
    <AppShell>
      <div className="space-y-6 pb-16 lg:pb-0">
        <div>
          <h1 className="text-3xl font-semibold">Analytics</h1>
          <p className="text-muted-foreground">Operational insight into departments, approval health, and workflow velocity.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Approval rate</p><p className="mt-2 text-3xl font-semibold">{percentage(metrics.approved, metrics.total)}%</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Pending vs completed</p><p className="mt-2 text-3xl font-semibold">{metrics.pending}:{completed}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Departments active</p><p className="mt-2 text-3xl font-semibold">{metrics.departmentData.length}</p></CardContent></Card>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <Card><CardHeader><CardTitle>Requests by department</CardTitle></CardHeader><CardContent><DepartmentChart data={metrics.departmentData} /></CardContent></Card>
          <Card><CardHeader><CardTitle>Pending vs completed</CardTitle></CardHeader><CardContent><StatusChart data={metrics.statusData} /></CardContent></Card>
        </div>
        <Card><CardHeader><CardTitle>Workflow trends</CardTitle></CardHeader><CardContent><TrendChart data={metrics.trendData} /></CardContent></Card>
      </div>
    </AppShell>
  );
}
