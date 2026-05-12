/**
 * Yogshala LMS — Reset Password API
 * POST /api/auth/reset-password — Reset password using a valid token.
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendSuccess, sendBadRequest } from "@/utils/apiResponse";
import { validateBody } from "@/middleware/withValidation";
import { resetPasswordSchema } from "@/validations/auth.validation";
import { AuthService } from "@/services/auth.service";

export const POST = asyncHandler(async (req: NextRequest) => {
  // Validate request body
  const validation = await validateBody(req, resetPasswordSchema);
  if (validation.error) return validation.error;

  try {
    await AuthService.resetPassword(
      validation.data.token,
      validation.data.newPassword
    );

    return sendSuccess(null, "Password reset successfully. You can now log in.");
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(error.message);
    }
    throw error;
  }
});
