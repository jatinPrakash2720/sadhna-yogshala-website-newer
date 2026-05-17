/**
 * Yogshala LMS — Me API
 * GET /api/auth/me — Get current authenticated user profile.
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendSuccess } from "@/utils/apiResponse";
import { withAuth } from "@/middleware/withAuth";
import { AuthService } from "@/services/auth.service";

export const revalidate = 0;

export const GET = asyncHandler(
  withAuth(async (_req: NextRequest, { user }) => {
    const profile = await AuthService.getProfile(user.id);

    return sendSuccess(
      { user: profile },
      "Profile retrieved successfully"
    );
  })
);
