/**
 * Yogshala LMS — Classes API
 * GET  /api/classes — List class sessions (enrolled courses for students, all for admins).
 * POST /api/classes — Create a class session (admin only).
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendSuccess, sendCreated, sendBadRequest } from "@/utils/apiResponse";
import { withAdmin } from "@/middleware/withAdmin";
import { withAuth } from "@/middleware/withAuth";
import { validateBody } from "@/middleware/withValidation";
import { createClassSchema } from "@/validations/class.validation";
import { ClassSessionService } from "@/services/classSession.service";
import { EnrollmentRepository } from "@/repositories/enrollment.repository";
import ClassSession from "@/models/ClassSession.model";
import { UserRole } from "@/constants";

/**
 * GET /api/classes — List class sessions (enrolled courses for students, all for admins).
 */
export const GET = asyncHandler(
  withAuth(async (req: NextRequest, { user }) => {
    try {
      let filter = {};
      if (user.role !== UserRole.ADMIN) {
        const { enrollments } = await EnrollmentRepository.findByStudent(user.id, 1, 100);
        const courseIds = enrollments.map((e: any) => e.course._id);
        filter = { course: { $in: courseIds } };
      }

      const sessions = await ClassSession.find(filter)
        .populate("course", "title slug instructorName")
        .sort({ scheduledDate: 1, startTime: 1 })
        .lean();

      return sendSuccess({ sessions }, "Class sessions retrieved successfully");
    } catch (error) {
      if (error instanceof Error) {
        return sendBadRequest(error.message);
      }
      throw error;
    }
  })
);

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

