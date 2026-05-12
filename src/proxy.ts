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

import { auth } from "@/config/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // ─── Protected API routes (require authentication) ─────
  const protectedPatterns = [
    /^\/api\/enrollments/,
    /^\/api\/admin/,
    /^\/api\/auth\/me/,
    /^\/api\/auth\/change-password/,
    /^\/api\/auth\/complete-profile/,
    /^\/api\/auth\/logout/,
  ];

  // Check if the route requires authentication
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

  // ─── Admin-only routes ─────────────────────────────────
  if (pathname.startsWith("/api/admin") && isAuthenticated) {
    const role = (req.auth?.user as Record<string, unknown>)?.role;
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
