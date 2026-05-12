/**
 * Yogshala LMS — Single Course API
 * GET    /api/courses/:id — Get course details
 * PUT    /api/courses/:id — Update course (admin only)
 * DELETE /api/courses/:id — Delete course (admin only)
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendSuccess, sendNotFound, sendBadRequest } from "@/utils/apiResponse";
import { withAdmin } from "@/middleware/withAdmin";
import { validateBody } from "@/middleware/withValidation";
import { updateCourseSchema } from "@/validations/course.validation";
import { CourseService } from "@/services/course.service";

/**
 * GET /api/courses/:id — Get a single course by ID.
 */
export const GET = asyncHandler(
  async (_req: NextRequest, context?: { params: Promise<Record<string, string>> }) => {
    const { id } = await context!.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return sendBadRequest("Invalid course ID format");
    }

    const course = await CourseService.getById(id);
    if (!course) {
      return sendNotFound("Course not found");
    }

    return sendSuccess({ course }, "Course retrieved successfully");
  }
);

/**
 * PUT /api/courses/:id — Update a course (admin only).
 */
export const PUT = asyncHandler(
  withAdmin(async (req: NextRequest, { params }) => {
    const { id } = await params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return sendBadRequest("Invalid course ID format");
    }

    const validation = await validateBody(req, updateCourseSchema);
    if (validation.error) return validation.error;

    const course = await CourseService.update(id, validation.data);
    if (!course) {
      return sendNotFound("Course not found");
    }

    return sendSuccess({ course }, "Course updated successfully");
  })
);

/**
 * DELETE /api/courses/:id — Delete a course (admin only).
 */
export const DELETE = asyncHandler(
  withAdmin(async (_req: NextRequest, { params }) => {
    const { id } = await params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return sendBadRequest("Invalid course ID format");
    }

    const course = await CourseService.delete(id);
    if (!course) {
      return sendNotFound("Course not found");
    }

    return sendSuccess(null, "Course deleted successfully");
  })
);
