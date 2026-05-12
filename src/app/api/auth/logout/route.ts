/**
 * Yogshala LMS — Logout API
 * POST /api/auth/logout — Sign out and clear session.
 */

import { asyncHandler } from "@/utils/asyncHandler";
import { sendSuccess } from "@/utils/apiResponse";
import { signOut } from "@/config/auth";

export const POST = asyncHandler(async () => {
  try {
    await signOut({ redirect: false });
  } catch {
    // signOut may throw NEXT_REDIRECT, which is expected
  }

  return sendSuccess(null, "Logged out successfully");
});
