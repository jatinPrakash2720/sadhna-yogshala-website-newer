/**
 * Yogshala LMS — Change Password API
 * POST /api/auth/change-password — Change password for authenticated users.
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendSuccess, sendBadRequest } from "@/utils/apiResponse";
import { withAuth } from "@/middleware/withAuth";
import { validateBody } from "@/middleware/withValidation";
import { changePasswordSchema } from "@/validations/auth.validation";
import { AuthService } from "@/services/auth.service";

export const POST = asyncHandler(
  withAuth(async (req: NextRequest, { user }) => {
    // Validate request body
    const validation = await validateBody(req, changePasswordSchema);
    if (validation.error) return validation.error;

    try {
      await AuthService.changePassword(user.id, validation.data);
      return sendSuccess(null, "Password changed successfully");
    } catch (error) {
      if (error instanceof Error) {
        return sendBadRequest(error.message);
      }
      throw error;
    }
  })
);
