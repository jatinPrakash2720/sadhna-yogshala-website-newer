/**
 * Yogshala LMS — Register API
 * POST /api/auth/register — Create a new user account.
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendCreated, sendBadRequest, sendConflict } from "@/utils/apiResponse";
import { validateBody } from "@/middleware/withValidation";
import { registerSchema } from "@/validations/auth.validation";
import { AuthService } from "@/services/auth.service";

export const POST = asyncHandler(async (req: NextRequest) => {
  // Validate request body
  const validation = await validateBody(req, registerSchema);
  if (validation.error) return validation.error;

  try {
    const user = await AuthService.register(validation.data);

    return sendCreated(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profileCompleted: user.profileCompleted,
        },
      },
      "Account created successfully"
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("already exists")) {
        return sendConflict(error.message);
      }
      return sendBadRequest(error.message);
    }
    throw error;
  }
});
