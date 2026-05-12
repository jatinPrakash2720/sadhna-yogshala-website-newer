/**
 * Yogshala LMS — Course Classes API
 * GET /api/classes/course/:courseId — Get all classes for a course.
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendPaginated, sendBadRequest } from "@/utils/apiResponse";
import { withAuth } from "@/middleware/withAuth";
import { validateQuery } from "@/middleware/withValidation";
import { paginationSchema } from "@/validations/common.validation";
import { ClassSessionService } from "@/services/classSession.service";

export const GET = asyncHandler(
  withAuth(async (req: NextRequest, { params }) => {
    const { courseId } = await params;

    if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
      return sendBadRequest("Invalid course ID format");
    }

    const validation = validateQuery(req, paginationSchema);
    if (validation.error) return validation.error;

    try {
      const { sessions, pagination } = await ClassSessionService.getByCourse(
        courseId,
        validation.data.page,
        validation.data.limit
      );

      return sendPaginated(
        sessions,
        pagination,
        "Class sessions retrieved successfully"
      );
    } catch (error) {
      if (error instanceof Error) {
        return sendBadRequest(error.message);
      }
      throw error;
    }
  })
);
