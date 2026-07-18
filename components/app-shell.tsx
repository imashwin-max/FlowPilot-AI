"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bot, Home, LayoutDashboard, Inbox, CheckSquare, BarChart3, Settings, Menu, X, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "AI Chat", icon: Bot },
  { href: "/requests", label: "Requests", icon: Inbox },
  { href: "/admin", label: "Admin Panel (Demo)", icon: ShieldCheck },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<string>("manager");

  const hasClerkKeys = typeof window !== "undefined" && !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const match = document.cookie.match(/(^| )flowpilot_mock_role=([^;]+)/);
      if (match) {
        setActiveRole(match[2]);
      }
    }
  }, []);

  const handleSwitchRole = () => {
    const newRole = activeRole === "manager" ? "employee" : "manager";
    document.cookie = `flowpilot_mock_role=${newRole}; path=/; max-age=31536000`;
    setActiveRole(newRole);
    setProfileDropdownOpen(false);
    window.location.reload();
  };

  const handleSignOut = () => {
    document.cookie = "flowpilot_mock_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setProfileDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  const displayedNavItems = navItems;

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border/50 bg-background/60 backdrop-blur-md lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-border/50 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold tracking-tight">FlowPilot AI</p>
            <p className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground/80">Command Engine</p>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground">
            <Home className="h-4 w-4" />
            Landing
          </Link>
          {displayedNavItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                pathname === item.href
                  ? "bg-primary/5 text-primary border-l-2 border-primary rounded-r-lg rounded-l-none pl-2.5 font-semibold"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/45 bg-background/70 px-4 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-md"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold lg:hidden">
              <Bot className="h-5 w-5 text-primary" />
              FlowPilot AI
            </Link>
          </div>
          <div className="hidden text-xs font-semibold tracking-wider text-muted-foreground/60 uppercase lg:block">FlowPilot AI Command Engine</div>
          <div className="flex items-center gap-4">
            <Link href="/chat" className="rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 transition-all shadow-sm">
              New workflow
            </Link>
            {hasClerkKeys ? (
              <UserButton />
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs uppercase shadow-inner border border-primary/20 transition-all hover:bg-primary/20"
                >
                  {activeRole === "manager" ? "DM" : "DE"}
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-card p-1 shadow-lg z-50 text-xs">
                    <div className="px-3 py-2 text-muted-foreground border-b border-border/50">
                      Logged in as <span className="font-semibold text-foreground uppercase">{activeRole}</span> (Demo)
                    </div>
                    <button
                      onClick={handleSwitchRole}
                      className="w-full text-left px-3 py-2 hover:bg-muted/50 rounded-sm transition-colors text-foreground font-medium"
                    >
                      Switch to {activeRole === "manager" ? "Employee" : "Manager"}
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 hover:bg-red-500/10 text-red-500 rounded-sm transition-colors font-medium border-t border-border/50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t bg-card p-1 lg:hidden">
        {displayedNavItems.slice(0, 5).map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className={cn(
              "flex flex-col items-center gap-1 rounded-md px-1 py-2 text-[11px] transition-colors",
              pathname === item.href
                ? "text-foreground bg-muted"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label.replace("Dashboard", "Home").replace("Admin Panel (Demo)", "Admin (Demo)")}
          </Link>
        ))}
      </nav>
    </div>
  );
}
