/**
 * Yogshala LMS — Auth Middleware
 * Extracts and validates Auth.js session for protected API routes.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/config/auth";
import { sendUnauthorized } from "@/utils/apiResponse";
import type { SessionUser } from "@/types";

/**
 * Wraps an API route handler with authentication check.
 * Passes the authenticated user to the handler.
 */
export function withAuth(
  handler: (
    req: NextRequest,
    context: { params: Promise<Record<string, string>>; user: SessionUser }
  ) => Promise<NextResponse>
) {
  return async (
    req: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ): Promise<NextResponse> => {
    const session = await auth();

    if (!session?.user) {
      return sendUnauthorized("Authentication required. Please log in.");
    }

    const user: SessionUser = {
      id: (session.user as Record<string, unknown>).id as string,
      name: session.user.name || "",
      email: session.user.email || "",
      image: session.user.image || undefined,
      role: (session.user as Record<string, unknown>).role as SessionUser["role"],
      profileCompleted: (session.user as Record<string, unknown>).profileCompleted as boolean,
    };

    return handler(req, { ...context, user });
  };
}

export default withAuth;
