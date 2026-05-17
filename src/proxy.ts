/**
 * Yogshala LMS — Next.js 16 Proxy
 * Replaces the deprecated middleware.ts.
 * Lightweight route protection at the network boundary.
 *
 * Per Next.js 16 best practices:
 * - Only used for routing, redirects, and header manipulation
 * - Auth checks are also performed inside API route handlers
 * - No heavy business logic here
 */

import { edgeAuth } from "@/config/auth.config";
import { NextResponse } from "next/server";

export default edgeAuth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;
  const role = (req.auth?.user as Record<string, unknown>)?.role;

  // ─── Protected Frontend Routes ─────────────────────────
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin") && !pathname.startsWith("/api/admin");

  if ((isDashboardRoute || isAdminRoute) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // ─── Role-Based Redirection ─────────────────────────────
  if (isAuthenticated) {
    // If Admin goes to Student Dashboard -> Redirect to Admin Panel
    if (isDashboardRoute && role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.nextUrl));
    }

    // If Student goes to Admin Panel -> Redirect to Student Dashboard
    if (isAdminRoute && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  }

  // ─── Protected API routes (require authentication) ─────
  const protectedPatterns = [
    /^\/api\/enrollments/,
    /^\/api\/admin/,
    /^\/api\/auth\/me/,
    /^\/api\/auth\/change-password/,
    /^\/api\/auth\/complete-profile/,
    /^\/api\/auth\/logout/,
  ];

  const isProtectedRoute = protectedPatterns.some((pattern) =>
    pattern.test(pathname)
  );

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication required",
      },
      { status: 401 }
    );
  }

  // ─── Admin-only API routes ─────────────────────────────
  if (pathname.startsWith("/api/admin") && isAuthenticated) {
    if (role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
});

/**
 * Proxy matcher — run on these paths only.
 */
export const config = {
  matcher: [
    // Frontend Routes
    "/dashboard/:path*",
    "/admin/:path*",
    // API Routes
    "/api/enrollments/:path*",
    "/api/admin/:path*",
    "/api/auth/me",
    "/api/auth/change-password",
    "/api/auth/complete-profile",
    "/api/auth/logout",
    "/api/classes/:path*",
    "/api/payments/:path*",
  ],
};
