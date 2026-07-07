import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, GitBranch, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Bot, title: "AI intake", text: "Gemini reads plain language requests and turns them into structured workflow data." },
  { icon: GitBranch, title: "Routing engine", text: "Departments, priorities, and approvers are assigned automatically from every request." },
  { icon: ShieldCheck, title: "Approval control", text: "Managers approve, reject, and comment with an auditable activity trail." },
  { icon: LineChart, title: "Live analytics", text: "Teams see bottlenecks, approval rates, trends, and department load in real time." }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="flow-grid relative overflow-hidden border-b">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(110deg, rgba(15,159,143,.90), rgba(240,107,58,.74)), url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1800&auto=format&fit=crop')"
          }}
        />
        <div className="absolute inset-0 bg-background/10" />
        <div className="relative mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-center px-6 py-20 text-white">
          <div className="max-w-3xl animate-fade-up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-md bg-white/14 px-3 py-1 text-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              TakeOver&apos;26 Theme 2
            </div>
            <h1 className="text-5xl font-semibold leading-tight md:text-7xl">FlowPilot AI</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90">
              A production-ready workflow command center that turns business requests into routed approvals, activity logs, and executive analytics.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-slate-950 hover:bg-white/90">
                <Link href="/dashboard">Open dashboard <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/50 bg-white/10 text-white hover:bg-white/20">
                <Link href="/chat">Try AI workflow chat</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-lg border bg-card p-5 shadow-sm">
              <feature.icon className="h-6 w-6 text-primary" />
              <h2 className="mt-4 font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold">Architecture that judges can understand in 20 seconds.</h2>
            <p className="mt-4 text-muted-foreground">
              The MVP connects a natural-language request interface, Gemini extraction, a workflow engine, Supabase persistence, and analytics surfaces.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-5">
            {["User request", "Gemini JSON", "Workflow engine", "Supabase", "Dashboards"].map((step, index) => (
              <div key={step} className="relative rounded-lg border bg-background p-4 text-sm font-medium shadow-sm">
                <CheckCircle2 className="mb-3 h-5 w-5 text-primary" />
                {step}
                {index < 4 ? <ArrowRight className="absolute -right-5 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-muted-foreground sm:block" /> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-semibold">Ready for the hackathon demo loop.</h2>
          <p className="mt-2 text-muted-foreground">Create a request, route it, approve it, and watch the analytics move.</p>
        </div>
        <Button asChild size="lg">
          <Link href="/chat">Launch FlowPilot <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </section>
    </main>
  );
}
