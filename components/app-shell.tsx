import Link from "next/link";
import { Bot, BarChart3, CheckSquare, Home, Inbox, LayoutDashboard, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "AI Chat", icon: Bot },
  { href: "/requests", label: "Requests", icon: Inbox },
  { href: "/approvals", label: "Approvals", icon: CheckSquare },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-card lg:block">
        <div className="flex h-16 items-center gap-2 border-b px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">FlowPilot AI</p>
            <p className="text-xs text-muted-foreground">Workflow command center</p>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          <Link href="/" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
            <Home className="h-4 w-4" />
            Landing
          </Link>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold lg:hidden">
            <Bot className="h-5 w-5 text-primary" />
            FlowPilot AI
          </Link>
          <div className="hidden text-sm text-muted-foreground lg:block">TakeOver&apos;26 Theme 2 MVP</div>
          <Link href="/chat" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            New workflow
          </Link>
        </header>
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t bg-card p-1 lg:hidden">
        {navItems.slice(0, 5).map((item) => (
          <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 rounded-md px-1 py-2 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground">
            <item.icon className="h-4 w-4" />
            {item.label.replace("Dashboard", "Home")}
          </Link>
        ))}
      </nav>
    </div>
  );
}
