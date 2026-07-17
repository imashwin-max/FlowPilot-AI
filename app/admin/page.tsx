"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { DepartmentChart, StatusChart, TrendChart } from "@/components/charts";
import { MetricCard } from "@/components/metric-card";
import { ApprovalsBoard } from "@/components/approvals-board";
import { ImpactSimulator } from "@/components/impact-simulator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Lock, 
  BarChart3, 
  CheckSquare, 
  Zap, 
  Loader2, 
  Inbox, 
  Clock3, 
  CheckCircle2, 
  XCircle, 
  KeyRound,
  ShieldCheck
} from "lucide-react";
import { percentage } from "@/lib/utils";
import type { DashboardMetrics, WorkflowRequest } from "@/lib/types";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"analytics" | "approvals" | "simulator">("analytics");
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [requests, setRequests] = useState<WorkflowRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Always reset session and authentication state on initial page load / mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("flowpilot_admin_auth");
    }
    setIsAuthenticated(false);
  }, []);

  // Reset session and authentication on tab/page component unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("flowpilot_admin_auth");
      }
    };
  }, []);

  // Force re-authentication if browser tab/visibility state changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("flowpilot_admin_auth");
        }
        setIsAuthenticated(false);
        setMetrics(null);
        setRequests([]);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);



  // Fetch metrics & workflows once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  async function fetchAdminData() {
    setLoading(true);
    try {
      const headers = {
        "x-admin-key": "Admin@FlowPilot"
      };

      const [metricsRes, workflowsRes] = await Promise.all([
        fetch("/api/dashboard", { headers }),
        fetch("/api/workflows", { headers })
      ]);

      if (!metricsRes.ok || !workflowsRes.ok) {
        throw new Error("Failed to load administration data. Please check connection.");
      }

      const metricsData = await metricsRes.json();
      const workflowsData = await workflowsRes.json();

      setMetrics(metricsData);
      setRequests(workflowsData.requests);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load admin datasets.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    if (password === "Admin@FlowPilot") {
      sessionStorage.setItem("flowpilot_admin_auth", "true");
      setIsAuthenticated(true);
      setLoginError("");
      toast.success("Welcome back, Administrator.");
    } else {
      setLoginError("Invalid password credentials.");
      toast.error("Access denied.");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("flowpilot_admin_auth");
    setIsAuthenticated(false);
    setMetrics(null);
    setRequests([]);
    setPassword("");
    toast.info("Logged out of Admin Session.");
  }

  // --- RENDERING LOCK SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <Card className="w-full max-w-md bg-card/75 border-border backdrop-blur-md shadow-2xl relative z-10 animate-fade-up">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto h-12 w-12 bg-primary/10 border border-primary/20 text-primary flex items-center justify-center rounded-xl mb-4 shadow-inner">
              <Lock className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Admin Control Center</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Enter password credentials to bypass Clerk restrictions.</p>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background border-border text-foreground placeholder-muted-foreground h-11 focus-visible:ring-primary"
                  required
                />
                {loginError && (
                  <p className="text-xs text-red-500 font-medium pl-1">{loginError}</p>
                )}
              </div>
              <Button type="submit" className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-all">
                <KeyRound className="h-4 w-4 mr-2" /> Authenticate Securely
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- RENDERING ADMIN WORKSPACE ---
  return (
    <AppShell>
      <div className="space-y-6 pb-16 lg:pb-0">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6 border-border">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-primary" /> Admin Control Workspace
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Bypassed Employee view scope. Authenticated session active.
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="border-border hover:bg-muted text-foreground">
            Sign out Admin
          </Button>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 border-b border-border pb-px">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
              activeTab === "analytics"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="h-4 w-4" /> Operational Analytics
          </button>
          <button
            onClick={() => setActiveTab("approvals")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
              activeTab === "approvals"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <CheckSquare className="h-4 w-4" /> Approvals Board
          </button>
          <button
            onClick={() => setActiveTab("simulator")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
              activeTab === "simulator"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Zap className="h-4 w-4" /> AI Team Impact Simulator
          </button>
        </div>

        {/* Tab Contents */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Fetching administrative records...</p>
          </div>
        ) : (
          <div className="mt-4">
            {/* 1. Analytics Tab */}
            {activeTab === "analytics" && metrics && (
              <div className="space-y-6 animate-fade-in">
                {/* Metric Summary */}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <MetricCard 
                    title="Total Company Requests" 
                    value={metrics.total} 
                    hint={`${percentage(metrics.approved, metrics.total)}% approval rate`} 
                    icon={Inbox} 
                  />
                  <MetricCard title="Pending Review" value={metrics.pending} hint="Awaiting approval" icon={Clock3} />
                  <MetricCard title="Approved Requests" value={metrics.approved} hint="Finalized successfully" icon={CheckCircle2} />
                  <MetricCard title="Rejected Requests" value={metrics.rejected} hint="Flagged or revised" icon={XCircle} />
                </div>
                
                {/* Visual Charts */}
                <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
                  <Card className="bg-card border-border shadow-sm">
                    <CardHeader><CardTitle className="text-foreground font-semibold">Workflow trends</CardTitle></CardHeader>
                    <CardContent><TrendChart data={metrics.trendData} /></CardContent>
                  </Card>
                  <Card className="bg-card border-border shadow-sm">
                    <CardHeader><CardTitle className="text-foreground font-semibold">Status mix</CardTitle></CardHeader>
                    <CardContent><StatusChart data={metrics.statusData} /></CardContent>
                  </Card>
                </div>
                <div className="grid gap-4">
                  <Card className="bg-card border-border shadow-sm">
                    <CardHeader><CardTitle className="text-foreground font-semibold">Requests by department</CardTitle></CardHeader>
                    <CardContent><DepartmentChart data={metrics.departmentData} /></CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* 2. Approvals Tab */}
            {activeTab === "approvals" && (
              <div className="space-y-6 animate-fade-in">
                <div className="border border-border bg-card rounded-xl p-4 mb-4 shadow-sm">
                  <p className="text-sm text-muted-foreground font-medium">
                    Showing all pending/completed requests across departments. Approving here acts under the Administrator authority.
                  </p>
                </div>
                {requests.length === 0 ? (
                  <div className="text-center py-20 border border-border rounded-xl bg-muted/10">
                    <CheckSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No requests found in the system.</p>
                  </div>
                ) : (
                  <ApprovalsBoard initialRequests={requests} />
                )}
              </div>
            )}

            {/* 3. Impact Simulator Tab */}
            {activeTab === "simulator" && (
              <div className="animate-fade-in border border-border rounded-2xl overflow-hidden shadow-lg bg-card">
                <div className="p-4 bg-muted/40 border-b border-border">
                  <p className="text-sm text-muted-foreground">
                    Analyze project criticality and backup coverages before making leave request decisions.
                  </p>
                </div>
                <ImpactSimulator hideHeader={true} />
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
