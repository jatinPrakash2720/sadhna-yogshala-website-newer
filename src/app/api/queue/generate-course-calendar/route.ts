/**
 * Yogshala LMS — Course Calendar Generation Worker
 * POST /api/queue/generate-course-calendar
 */

import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { CourseScheduleService } from "@/services/courseSchedule.service";
import { sendSuccess, sendError } from "@/utils/apiResponse";
import { HTTP_STATUS } from "@/constants";

async function handler(req: Request) {
  try {
    const body = (await req.json()) as { courseId?: string };
    if (!body.courseId) {
      return sendError("courseId is required", HTTP_STATUS.BAD_REQUEST);
    }

    const result = await CourseScheduleService.generateCalendarForCourse(
      body.courseId
    );

    return sendSuccess(result, "Course calendar links generated");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Course calendar generation failed";
    return sendError(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

export const POST = verifySignatureAppRouter(handler);
