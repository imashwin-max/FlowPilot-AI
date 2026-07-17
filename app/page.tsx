import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, GitBranch, LineChart, ShieldCheck, Sparkles, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Bot, title: "Natural Language Intake", text: "Submit approval requests in plain speech. Gemini handles entity extraction, severity evaluation, and structural conversion." },
  { icon: GitBranch, title: "Automated Routing Engine", text: "Assign departments, select manager supervisors, calculate SLA timelines, and identify backups on the fly." },
  { icon: ShieldCheck, title: "Unified Approval Console", text: "Track manager reviews, reject with comments, and audit an immutable timeline history of execution states." },
  { icon: LineChart, title: "Executive Analytics", text: "Inspect department workloads, average response velocity, SLA breaches, and historical trends in real time." }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between">
      {/* Dynamic top gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none blur-3xl" />

      {/* Modern Top Header */}
      <header className="relative w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black">
            <Bot className="h-5 w-5" />
          </div>
          <span className="font-bold tracking-tight text-foreground">FlowPilot AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold uppercase tracking-wider rounded-lg px-4 shadow-sm">
            <Link href="/chat">Launch Portal <ChevronRight className="h-3 w-3 ml-1" /></Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-20 pb-16 flex flex-col items-center text-center">
        <div className="max-w-4xl animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            AI-Driven Approval Orchestration
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl bg-gradient-to-b from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
            Workflow Command Center
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed text-muted-foreground">
            FlowPilot AI converts raw natural-language business requests into auditable, intelligently-routed workflows, department approvals, and capacity simulations.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-md px-8 rounded-lg font-semibold text-sm">
              <Link href="/dashboard">Enter Workspace <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border hover:bg-muted/40 transition-all px-8 rounded-lg font-semibold text-sm">
              <Link href="/chat">Try AI Intake Chat</Link>
            </Button>
          </div>
        </div>

        {/* Visual Engine flow Preview */}
        <div className="mt-20 w-full max-w-5xl rounded-xl border border-border/50 bg-card/50 p-1.5 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="rounded-lg border border-border/40 bg-background/50 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-stretch">
            
            {/* Input prompt */}
            <div className="flex-1 flex flex-col justify-between text-left p-4 rounded-lg bg-card border border-border/45">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-primary uppercase">Natural Language Request</span>
                <p className="mt-2 text-sm text-foreground italic font-medium">
                  &ldquo;I need to order an M3 Macbook Pro upgrade by this Friday because my local dev compile times are slowing project deployment. Estimated budget is $2,800. Project launch is scheduled for next month.&rdquo;
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border/30">
                <Bot className="h-4 w-4 text-primary" /> Extracted payload generated instantly
              </div>
            </div>

            {/* Transition Arrow */}
            <div className="flex items-center justify-center shrink-0">
              <div className="h-10 w-10 rounded-full border border-border/50 bg-background flex items-center justify-center shadow-sm">
                <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90 md:rotate-0" />
              </div>
            </div>

            {/* Extracted result schema */}
            <div className="flex-1 text-left p-4 rounded-lg bg-slate-950 text-slate-300 font-mono text-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">Engine Routing Payload</span>
                <pre className="mt-2 overflow-x-auto text-[11px] text-slate-100/90 leading-relaxed">
{`{
  "title": "Macbook Pro Hardware Upgrade",
  "department": "Engineering / IT Support",
  "priority": "high",
  "approver": "Lisa Wang (DevOps Lead)",
  "sla_hours": 12,
  "requires_coverage": false
}`}
                </pre>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[10px] text-emerald-500 font-semibold uppercase tracking-wider pt-3 border-t border-slate-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Auto-routed to department lead
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="w-full max-w-7xl mx-auto px-6 py-20 border-t border-border/40 relative z-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <div key={idx} className="rounded-xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center border border-primary/10 group-hover:scale-105 transition-all">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-base text-foreground tracking-tight">{feature.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sub Section Details */}
      <section className="w-full border-t border-border/40 bg-card/25 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="max-w-xl">
            <span className="text-[10px] font-bold tracking-wider text-primary uppercase">Risk & Capacity Management</span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mt-2">
              Predictive simulation for staff coverage and project SLAs.
            </h2>
            <p className="mt-4 text-xs md:text-sm leading-relaxed text-muted-foreground">
              Approved requests must respect team availability and client agreements. FlowPilot AI lets managers analyze criticality scores, active meeting overhead, and search backing coverage to prevent project delays.
            </p>
            <div className="mt-6">
              <Button asChild size="sm" variant="outline" className="border-border rounded-lg text-xs font-semibold">
                <Link href="/impact-simulator" className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-amber-500" /> Open Simulator Sandbox
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-4 lg:w-[50%]">
            {["Request Intake", "JSON Extract", "SLA Assignment", "Audit Trail"].map((step, index) => (
              <div key={step} className="rounded-lg border border-border/50 bg-background p-4 text-xs font-semibold text-foreground text-center flex flex-col items-center justify-center gap-2 shadow-sm">
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary font-mono text-[10px] flex items-center justify-center font-bold">{index + 1}</div>
                {step}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div>&copy; {new Date().getFullYear()} FlowPilot AI. All rights reserved.</div>
        <div className="flex gap-4">
          <Link href="/dashboard" className="hover:text-foreground">Console</Link>
          <Link href="/chat" className="hover:text-foreground">Intake Chat</Link>
          <Link href="/settings" className="hover:text-foreground">Settings</Link>
        </div>
      </footer>
    </main>
  );
}
