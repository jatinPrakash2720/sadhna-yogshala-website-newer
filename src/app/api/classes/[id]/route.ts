/**
 * Yogshala LMS — Single Class Session API
 * PUT    /api/classes/:id — Update class session (admin only)
 * DELETE /api/classes/:id — Delete class session (admin only)
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendSuccess, sendNotFound, sendBadRequest } from "@/utils/apiResponse";
import { withAdmin } from "@/middleware/withAdmin";
import { validateBody } from "@/middleware/withValidation";
import { updateClassSchema } from "@/validations/class.validation";
import { ClassSessionService } from "@/services/classSession.service";

/**
 * PUT /api/classes/:id — Update a class session.
 */
export const PUT = asyncHandler(
  withAdmin(async (req: NextRequest, { params }) => {
    const { id } = await params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return sendBadRequest("Invalid class session ID format");
    }

    const validation = await validateBody(req, updateClassSchema);
    if (validation.error) return validation.error;

    try {
      const session = await ClassSessionService.update(id, validation.data);

      return sendSuccess(
        { classSession: session },
        "Class session updated successfully"
      );
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("not found")) {
          return sendNotFound(error.message);
        }
        return sendBadRequest(error.message);
      }
      throw error;
    }
  })
);

/**
 * DELETE /api/classes/:id — Delete a class session.
 */
export const DELETE = asyncHandler(
  withAdmin(async (_req: NextRequest, { params }) => {
    const { id } = await params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return sendBadRequest("Invalid class session ID format");
    }

    try {
      await ClassSessionService.delete(id);
      return sendSuccess(null, "Class session deleted successfully");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("not found")) {
          return sendNotFound(error.message);
        }
        return sendBadRequest(error.message);
      }
      throw error;
    }
  })
);
