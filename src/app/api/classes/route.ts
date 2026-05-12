/**
 * Yogshala LMS — Classes API
 * POST /api/classes — Create a class session (admin only).
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendCreated, sendBadRequest } from "@/utils/apiResponse";
import { withAdmin } from "@/middleware/withAdmin";
import { validateBody } from "@/middleware/withValidation";
import { createClassSchema } from "@/validations/class.validation";
import { ClassSessionService } from "@/services/classSession.service";

export const POST = asyncHandler(
  withAdmin(async (req: NextRequest) => {
    const validation = await validateBody(req, createClassSchema);
    if (validation.error) return validation.error;

    try {
      const session = await ClassSessionService.create(validation.data);

      return sendCreated(
        { classSession: session },
        "Class session created successfully"
      );
    } catch (error) {
      if (error instanceof Error) {
        return sendBadRequest(error.message);
      }
      throw error;
    }
  })
);
