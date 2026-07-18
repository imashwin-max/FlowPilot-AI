import { Activity, CheckCircle2, Clock3, Inbox, XCircle, ArrowRight, Sparkles, Cpu, Clock, Zap } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DepartmentChart, StatusChart, TrendChart } from "@/components/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getDashboardMetrics } from "@/lib/workflows";
import { formatDate, percentage } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let role = "manager";
  let requesterFilter: string | undefined;

  const hasClerkKeys = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (hasClerkKeys) {
    const { sessionClaims } = await auth();
    role = (sessionClaims?.metadata as { role?: string })?.role || "";

    if (!role) {
      const user = await currentUser();
      role = (user?.publicMetadata?.role as string) || "employee";
    }

    if (role !== "manager") {
      const user = await currentUser();
      if (user) {
        requesterFilter = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || user.emailAddresses[0]?.emailAddress || "Demo User";
      }
    }
  } else {
    const cookieStore = await cookies();
    role = cookieStore.get("flowpilot_mock_role")?.value || "";
    if (!role) {
      redirect("/sign-in");
    }
    requesterFilter = role === "manager" ? undefined : "Demo Employee";
  }

  const metrics = await getDashboardMetrics(requesterFilter);
  const approvalRate = percentage(metrics.approved, metrics.total);

  if (role === "manager") {
    return (
      <AppShell>
        <div className="space-y-6 pb-16 lg:pb-0 animate-fade-up">
          {/* Header Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Workflow Dashboard</h1>
              <p className="text-muted-foreground text-xs mt-1">Real-time overview of AI-routed business approvals and operational states.</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 self-start sm:self-auto shadow-sm">
              <Cpu className="h-3.5 w-3.5 animate-pulse" /> AI Router active
            </div>
          </div>

          {/* Metric Summary Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-5 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[2.5px] bg-primary/70" />
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Requests</p>
                  <h3 className="text-3xl font-extrabold mt-2 tracking-tight text-foreground">{metrics.total}</h3>
                </div>
                <div className="p-2 bg-primary/5 text-primary border border-primary/10 rounded-lg"><Inbox className="h-4.5 w-4.5" /></div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 font-semibold text-primary/80">{approvalRate}% approval velocity</p>
            </Card>
            
            <Card className="p-5 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[2.5px] bg-amber-500/80" />
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Awaiting Review</p>
                  <h3 className="text-3xl font-extrabold mt-2 tracking-tight text-foreground">{metrics.pending}</h3>
                </div>
                <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg"><Clock3 className="h-4.5 w-4.5" /></div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 font-medium">Pending manager action</p>
            </Card>
            
            <Card className="p-5 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[2.5px] bg-emerald-500/80" />
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Approved Items</p>
                  <h3 className="text-3xl font-extrabold mt-2 tracking-tight text-foreground">{metrics.approved}</h3>
                </div>
                <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg"><CheckCircle2 className="h-4.5 w-4.5" /></div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 font-medium">Completed successfully</p>
            </Card>
            
            <Card className="p-5 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[2.5px] bg-red-500/80" />
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Rejected Requests</p>
                  <h3 className="text-3xl font-extrabold mt-2 tracking-tight text-foreground">{metrics.rejected}</h3>
                </div>
                <div className="p-2 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg"><XCircle className="h-4.5 w-4.5" /></div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 font-medium">Needs correction</p>
            </Card>
          </div>

          {/* Rearranged 2-Column Layout */}
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            {/* LEFT COLUMN: Main Area Trends & Recent Logs */}
            <div className="space-y-6">
              <Card className="bg-card border-border/40 shadow-sm relative overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-foreground">Workflow Velocity Trends</CardTitle>
                  <p className="text-xs text-muted-foreground">Volume of system approvals and requests logged over the past week.</p>
                </CardHeader>
                <CardContent className="pt-2"><TrendChart data={metrics.trendData} /></CardContent>
              </Card>

              <Card className="bg-card border-border/40 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Activity className="h-4.5 w-4.5 text-primary" /> System Audit Stream
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">Latest changes and system events logged across teams.</p>
                </CardHeader>
                <CardContent className="space-y-2.5 pt-2 max-h-[360px] overflow-y-auto">
                  {metrics.activities.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-8">No recent activities logged.</p>
                  ) : (
                    metrics.activities.map((activity) => (
                      <div key={activity.id} className="rounded-lg border border-border/40 bg-background/40 p-3 text-xs flex flex-col gap-1 shadow-inner">
                        <div className="flex items-center justify-between gap-4">
                          <p className="font-semibold text-foreground">{activity.action}</p>
                          <span className="text-[10px] text-muted-foreground/80">{formatDate(activity.created_at)}</span>
                        </div>
                        <p className="text-muted-foreground">{activity.actor} &middot; {activity.details}</p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN: charts & SLA info */}
            <div className="space-y-6">
              <Card className="bg-card border-border/40 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-foreground">Requests by Department</CardTitle>
                  <p className="text-xs text-muted-foreground">Distribution of active workload queue.</p>
                </CardHeader>
                <CardContent className="pt-2"><DepartmentChart data={metrics.departmentData} /></CardContent>
              </Card>

              <Card className="bg-card border-border/40 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-foreground">Status Mix Ratio</CardTitle>
                  <p className="text-xs text-muted-foreground">Pending compared to final approval states.</p>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center pt-2"><StatusChart data={metrics.statusData} /></CardContent>
              </Card>

              <Card className="bg-card border-border/40 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[3px] h-full bg-primary" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" /> AI System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-2 text-xs">
                  <div className="flex items-center justify-between border-b pb-2 border-border/40">
                    <span className="text-muted-foreground">Intake Confidence</span>
                    <span className="font-bold text-foreground">94.8%</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2 border-border/40">
                    <span className="text-muted-foreground">Mean SLA Resolution</span>
                    <span className="font-bold text-foreground">1.4 hrs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Database Sync</span>
                    <span className="font-semibold text-emerald-500 flex items-center gap-1">Live <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" /></span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // --- EMPLOYEE VIEW RENDERING ---
  return (
    <AppShell>
      <div className="space-y-6 pb-16 lg:pb-0 animate-fade-up">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Request Command Center</h1>
            <p className="text-muted-foreground text-xs mt-1">Submit new work requests, monitor approval states, and review timelines.</p>
          </div>
          <div className="flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-lg px-3 py-1.5 text-xs font-semibold text-primary self-start sm:self-auto shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Employee Portal
          </div>
        </div>

        {/* Metrics Summary Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2.5px] bg-primary/70" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">My Submissions</p>
                <h3 className="text-3xl font-extrabold mt-2 tracking-tight text-foreground">{metrics.total}</h3>
              </div>
              <div className="p-2 bg-primary/5 text-primary border border-primary/10 rounded-lg"><Inbox className="h-4.5 w-4.5" /></div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 font-semibold text-primary/80">{approvalRate}% approval rate</p>
          </Card>
          
          <Card className="p-5 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2.5px] bg-amber-500/80" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Awaiting Decision</p>
                <h3 className="text-3xl font-extrabold mt-2 tracking-tight text-foreground">{metrics.pending}</h3>
              </div>
              <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg"><Clock3 className="h-4.5 w-4.5" /></div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 font-medium">Pending manager review</p>
          </Card>
          
          <Card className="p-5 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2.5px] bg-emerald-500/80" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Approved Requests</p>
                <h3 className="text-3xl font-extrabold mt-2 tracking-tight text-foreground">{metrics.approved}</h3>
              </div>
              <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg"><CheckCircle2 className="h-4.5 w-4.5" /></div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 font-medium">Completed & logged</p>
          </Card>
          
          <Card className="p-5 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2.5px] bg-red-500/80" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Rejected Requests</p>
                <h3 className="text-3xl font-extrabold mt-2 tracking-tight text-foreground">{metrics.rejected}</h3>
              </div>
              <div className="p-2 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg"><XCircle className="h-4.5 w-4.5" /></div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 font-medium">Needs correction</p>
          </Card>
        </div>

        {/* 2-Column Rearranged Layout */}
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          {/* LEFT COLUMN: Submit Card & Personal requests */}
          <div className="space-y-6">
            <Card className="bg-card border-border/40 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-primary/40" />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-foreground">Need Something Approved?</CardTitle>
                <p className="text-xs text-muted-foreground">Describe your request in natural language. FlowPilot AI will process and route it instantly.</p>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  Submit hardware upgrades, medical leaves, client NDA approvals, budget clearances, or network access permissions. The AI reviews criticality, identifies backing supervisors, and registers audit trails.
                </p>
                
                {/* Quick start tags */}
                <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3 pt-2">
                  {[
                    "I need leaf tomorrow due to viral fever.",
                    "Require IT software update log approvals.",
                    "Review vendor NDA proposal by end of today."
                  ].map((prompt, i) => (
                    <Button 
                      key={i} 
                      variant="outline" 
                      asChild 
                      className="text-left justify-start h-auto py-2.5 px-3 text-xs leading-normal font-medium border-border/55 hover:bg-muted text-muted-foreground hover:text-foreground break-words transition-all whitespace-normal flex items-start gap-1 shadow-sm hover:scale-[1.01]"
                    >
                      <Link href={`/chat?message=${encodeURIComponent(prompt)}`}>
                        <Sparkles className="h-3 w-3 mt-0.5 text-primary shrink-0 animate-pulse" />
                        <span>{prompt}</span>
                      </Link>
                    </Button>
                  ))}
                </div>

                <div className="pt-2">
                  <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-md rounded-lg font-semibold text-xs uppercase tracking-wider px-4">
                    <Link href="/chat" className="inline-flex items-center">
                      Launch AI Chat Portal <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/40 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-foreground">My Request History</CardTitle>
                <p className="text-xs text-muted-foreground">Audit log of your submitted workflows.</p>
              </CardHeader>
              <CardContent className="pt-2 max-h-[360px] overflow-y-auto space-y-3">
                {metrics.requests.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8 font-medium">No requests submitted yet.</p>
                ) : (
                  metrics.requests.slice(0, 5).map((request) => (
                    <div key={request.id} className="border border-border/40 bg-background/20 rounded-lg p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-2">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-xs text-foreground tracking-tight">{request.title}</h4>
                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          request.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                          request.status === 'rejected' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}>{request.status}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{request.summary}</p>
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-2 border-t border-border/30">
                        <span>Supervisor: {request.approver}</span>
                        <span>{formatDate(request.created_at)}</span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: Personal Mix, SLA guidelines, activity logs */}
          <div className="space-y-6">
            <Card className="bg-card border-border/40 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-foreground">My Request Mix</CardTitle>
                <p className="text-xs text-muted-foreground">Ratio of your active workflow statuses.</p>
              </CardHeader>
              <CardContent className="h-[180px] flex items-center justify-center pt-2">
                {metrics.total === 0 ? (
                  <p className="text-xs text-muted-foreground">No records available to chart.</p>
                ) : (
                  <StatusChart data={metrics.statusData} />
                )}
              </CardContent>
            </Card>

            {/* SLA GUIDELINES CONTENT CARD */}
            <Card className="bg-card border-border/40 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[3px] h-full bg-primary" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" /> Average Routing SLAs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-2 text-xs leading-relaxed text-muted-foreground">
                <p>
                  FlowPilot AI classifies severity level and assigns estimated response timelines per department category:
                </p>
                <div className="space-y-2 pt-1 border-t border-border/30">
                  <div className="flex justify-between border-b pb-1.5 border-border/30 mt-1.5">
                    <span>Human Resources (Leaves)</span>
                    <span className="font-semibold text-foreground">&lt; 24 hrs</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5 border-border/30">
                    <span>IT & Systems Support</span>
                    <span className="font-semibold text-foreground">&lt; 12 hrs</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5 border-border/30">
                    <span>Finance Approvals</span>
                    <span className="font-semibold text-foreground">&lt; 8 hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Legal & NDAs</span>
                    <span className="font-semibold text-foreground">&lt; 48 hrs</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal activity logs */}
            <Card className="bg-card border-border/40 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Activity className="h-4.5 w-4.5 text-primary" /> Activity Log
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 pt-2 max-h-[220px] overflow-y-auto">
                {metrics.activities.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6 font-medium">No active activity logs.</p>
                ) : (
                  metrics.activities.map((activity) => (
                    <div key={activity.id} className="rounded-lg border border-border/40 bg-background/40 p-2.5 text-xs shadow-inner flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-foreground">{activity.action}</p>
                        <span className="text-[9px] text-muted-foreground/80">{formatDate(activity.created_at)}</span>
                      </div>
                      <p className="text-muted-foreground">{activity.actor} &middot; {activity.details}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
