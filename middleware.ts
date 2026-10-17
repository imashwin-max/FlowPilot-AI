import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define which routes are public (unprotected)
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

const hasClerkKeys = !!(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);

let middlewareExport;

if (hasClerkKeys) {
  middlewareExport = clerkMiddleware(async (auth, request) => {
    // If user has chosen a demo mode profile, permit access
    const mockRole = request.cookies.get("flowpilot_mock_role")?.value;
    if (mockRole) {
      return NextResponse.next();
    }

    if (!isPublicRoute(request)) {
      try {
        await auth.protect();
      } catch (err) {
        // If auth.protect() throws (e.g., handshake missing in production), redirect to /sign-in
        console.warn("[middleware] auth.protect error, redirecting to /sign-in:", err);
        const signInUrl = new URL("/sign-in", request.url);
        signInUrl.searchParams.set("redirect_url", request.url);
        return NextResponse.redirect(signInUrl);
      }
    }
  });
} else {
  // Return dummy middleware if keys are absent
  middlewareExport = () => {
    return NextResponse.next();
  };
}

export default middlewareExport;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
