/**
 * Yogshala LMS — Single Enrollment API
 * GET /api/enrollments/:id — Get enrollment details.
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendSuccess, sendNotFound, sendBadRequest } from "@/utils/apiResponse";
import { withAuth } from "@/middleware/withAuth";
import { EnrollmentService } from "@/services/enrollment.service";

export const GET = asyncHandler(
  withAuth(async (_req: NextRequest, { params, user }) => {
    const { id } = await params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return sendBadRequest("Invalid enrollment ID format");
    }

    try {
      const enrollment = await EnrollmentService.getEnrollmentById(
        id,
        user.id
      );

      return sendSuccess(
        { enrollment },
        "Enrollment retrieved successfully"
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
