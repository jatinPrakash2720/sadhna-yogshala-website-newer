/**
 * Yogshala LMS — Update Profile API
 * POST /api/auth/update-profile — Update current authenticated user profile.
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendSuccess, sendBadRequest } from "@/utils/apiResponse";
import { withAuth } from "@/middleware/withAuth";
import { validateBody } from "@/middleware/withValidation";
import { updateProfileSchema } from "@/validations/auth.validation";
import { AuthService } from "@/services/auth.service";

export const POST = asyncHandler(
  withAuth(async (req: NextRequest, { user }) => {
    // Validate request body
    const validation = await validateBody(req, updateProfileSchema);
    if (validation.error) return validation.error;

    try {
      const updatedUser = await AuthService.updateProfile(user.id, validation.data);
      return sendSuccess({ user: updatedUser }, "Profile updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        return sendBadRequest(error.message);
      }
      throw error;
    }
  })
);
