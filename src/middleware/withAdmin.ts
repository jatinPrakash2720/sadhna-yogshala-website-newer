/**
 * Yogshala LMS — Admin Authorization Middleware
 * Ensures the authenticated user has admin role.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/config/auth";
import { sendUnauthorized, sendForbidden } from "@/utils/apiResponse";
import { UserRole } from "@/constants";
import type { SessionUser } from "@/types";

/**
 * Wraps an API route handler with admin authorization.
 * First checks authentication, then verifies admin role.
 */
export function withAdmin(
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

    const userRole = (session.user as Record<string, unknown>).role as string;

    if (userRole !== UserRole.ADMIN) {
      return sendForbidden("Admin access required. You do not have permission.");
    }

    const user: SessionUser = {
      id: (session.user as Record<string, unknown>).id as string,
      name: session.user.name || "",
      email: session.user.email || "",
      image: session.user.image || undefined,
      role: userRole as SessionUser["role"],
      profileCompleted: (session.user as Record<string, unknown>).profileCompleted as boolean,
    };

    return handler(req, { ...context, user });
  };
}

export default withAdmin;
