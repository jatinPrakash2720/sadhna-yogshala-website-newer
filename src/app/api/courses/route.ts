/**
 * Yogshala LMS — Courses API
 * GET  /api/courses — List courses (public, paginated, searchable)
 * POST /api/courses — Create course (admin only)
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendSuccess, sendPaginated, sendCreated } from "@/utils/apiResponse";
import { withAdmin } from "@/middleware/withAdmin";
import { validateBody, validateQuery } from "@/middleware/withValidation";
import {
  createCourseSchema,
  courseQuerySchema,
} from "@/validations/course.validation";
import { CourseService } from "@/services/course.service";

/**
 * GET /api/courses — Public course listing with pagination, search, and filtering.
 */
export const GET = asyncHandler(async (req: NextRequest) => {
  // Validate query params
  const validation = validateQuery(req, courseQuerySchema);
  if (validation.error) return validation.error;

  // Default to published courses for public listing
  const queryData = {
    ...validation.data,
    isPublished: validation.data.isPublished ?? true,
  };

  const { courses, pagination } = await CourseService.list(queryData);

  return sendPaginated(courses, pagination, "Courses retrieved successfully");
});

/**
 * POST /api/courses — Create a new course (admin only).
 */
export const POST = asyncHandler(
  withAdmin(async (req: NextRequest) => {
    // Validate request body
    const validation = await validateBody(req, createCourseSchema);
    if (validation.error) return validation.error;

    const course = await CourseService.create(validation.data);

    return sendCreated(
      { course },
      "Course created successfully"
    );
  })
);
