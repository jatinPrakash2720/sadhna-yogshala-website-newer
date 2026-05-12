/**
 * Yogshala LMS — Login API
 * POST /api/auth/login — Authenticate with email and password.
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendSuccess, sendBadRequest, sendUnauthorized } from "@/utils/apiResponse";
import { validateBody } from "@/middleware/withValidation";
import { loginSchema } from "@/validations/auth.validation";
import { signIn } from "@/config/auth";
import { AuthError } from "next-auth";

export const POST = asyncHandler(async (req: NextRequest) => {
  // Validate request body
  const validation = await validateBody(req, loginSchema);
  if (validation.error) return validation.error;

  try {
    // Use Auth.js signIn with Credentials provider
    const result = await signIn("credentials", {
      email: validation.data.email,
      password: validation.data.password,
      redirect: false,
    });

    return sendSuccess(
      { redirectUrl: result },
      "Login successful"
    );
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return sendUnauthorized("Invalid email or password");
        default:
          return sendBadRequest(error.message || "Authentication failed");
      }
    }

    // Re-throw NEXT_REDIRECT which is expected from signIn
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return sendSuccess(null, "Login successful");
    }

    throw error;
  }
});
