/**
 * Yogshala LMS — Forgot Password API
 * POST /api/auth/forgot-password — Request a password reset token.
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendSuccess } from "@/utils/apiResponse";
import { validateBody } from "@/middleware/withValidation";
import { forgotPasswordSchema } from "@/validations/auth.validation";
import { AuthService } from "@/services/auth.service";

export const POST = asyncHandler(async (req: NextRequest) => {
  // Validate request body
  const validation = await validateBody(req, forgotPasswordSchema);
  if (validation.error) return validation.error;

  try {
    const resetToken = await AuthService.forgotPassword(validation.data.email);

    // In production, send email with reset link instead
    // For development, include the token in response
    const isDev = process.env.NODE_ENV === "development";

    return sendSuccess(
      isDev ? { resetToken } : null,
      "If an account with that email exists, a password reset link has been sent."
    );
  } catch (error) {
    // Silent error — don't reveal if email exists
    if (error instanceof Error && error.message === "_silent") {
      return sendSuccess(
        null,
        "If an account with that email exists, a password reset link has been sent."
      );
    }
    throw error;
  }
});
