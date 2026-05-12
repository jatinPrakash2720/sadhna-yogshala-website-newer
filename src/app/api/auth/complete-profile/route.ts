/**
 * Yogshala LMS — Complete Profile API
 * POST /api/auth/complete-profile — Complete profile for Google users.
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendSuccess, sendBadRequest } from "@/utils/apiResponse";
import { withAuth } from "@/middleware/withAuth";
import { validateBody } from "@/middleware/withValidation";
import { completeProfileSchema } from "@/validations/auth.validation";
import { AuthService } from "@/services/auth.service";

export const POST = asyncHandler(
  withAuth(async (req: NextRequest, { user }) => {
    // Check if profile is already complete
    if (user.profileCompleted) {
      return sendBadRequest("Profile is already complete");
    }

    // Validate request body
    const validation = await validateBody(req, completeProfileSchema);
    if (validation.error) return validation.error;

    const updatedUser = await AuthService.completeProfile(
      user.id,
      validation.data
    );

    return sendSuccess(
      { user: updatedUser },
      "Profile completed successfully"
    );
  })
);
