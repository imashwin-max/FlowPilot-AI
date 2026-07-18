"use client";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const hasClerkKeys = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const handleMockLogin = (role: "manager" | "employee") => {
    document.cookie = `flowpilot_mock_role=${role}; path=/; max-age=31536000`; // 1 year
    router.push("/dashboard");
    router.refresh();
  };

  if (!hasClerkKeys) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 flex flex-col items-center">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-foreground">
              Sign In (Demo Mode)
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Clerk is not configured. Access the workspace using a demo profile below.
            </p>
          </div>
          <div className="mt-8 space-y-4 w-full">
            <button
              onClick={() => handleMockLogin("manager")}
              className="group relative flex w-full justify-center rounded-lg border border-transparent bg-primary py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 transition-all shadow-md"
            >
              Sign In as Demo Manager
            </button>
            <button
              onClick={() => handleMockLogin("employee")}
              className="group relative flex w-full justify-center rounded-lg border border-border bg-card py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-card-foreground hover:bg-muted/40 transition-all shadow-sm"
            >
              Sign In as Demo Employee
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 flex justify-center">
        <SignIn />
      </div>
    </div>
  );
}
