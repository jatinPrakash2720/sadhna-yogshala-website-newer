/**
 * Yogshala LMS — My Enrollments API
 * GET /api/enrollments/my-courses — Get authenticated user's enrolled courses.
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendPaginated } from "@/utils/apiResponse";
import { withAuth } from "@/middleware/withAuth";
import { validateQuery } from "@/middleware/withValidation";
import { paginationSchema } from "@/validations/common.validation";
import { EnrollmentService } from "@/services/enrollment.service";

export const GET = asyncHandler(
  withAuth(async (req: NextRequest, { user }) => {
    const validation = validateQuery(req, paginationSchema);
    if (validation.error) return validation.error;

    const { page, limit } = validation.data;

    const { enrollments, pagination } =
      await EnrollmentService.getMyEnrollments(
        user.id,
        page,
        limit
      );

    return sendPaginated(
      enrollments,
      pagination,
      "Enrolled courses retrieved successfully"
    );
  })
);
