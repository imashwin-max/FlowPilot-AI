"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, RefreshCw, Sparkles } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();

  const handleEnterDemoMode = () => {
    document.cookie = "flowpilot_mock_role=manager; path=/; max-age=31536000";
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md w-full rounded-xl border border-border/60 bg-card p-6 text-center shadow-lg">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-4">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Something went wrong</h1>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          {error?.message && !error.message.includes("Server Components render")
            ? error.message
            : "An unexpected error occurred while loading this view."}
        </p>

        {error?.digest && (
          <p className="mt-2 font-mono text-[10px] text-muted-foreground/60">
            Digest: {error.digest}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2.5">
          <Button onClick={reset} className="w-full flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4" /> Try again
          </Button>

          <Button
            onClick={handleEnterDemoMode}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-primary/30 text-primary hover:bg-primary/5"
          >
            <Sparkles className="h-4 w-4" /> Open in Demo Mode (Manager)
          </Button>

          <Button asChild variant="ghost" className="w-full text-xs text-muted-foreground">
            <Link href="/">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Return to Landing Page
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
