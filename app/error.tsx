"use client";

import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md rounded-lg border bg-card p-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error.message || "FlowPilot could not load this view."}</p>
        <Button onClick={reset} className="mt-5">Try again</Button>
      </div>
    </div>
  );
}
