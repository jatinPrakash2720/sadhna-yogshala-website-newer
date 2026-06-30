/**
 * Yogshala LMS — Calendar Batch Sync Worker
 * POST /api/queue/process-calendar-batch
 * QStash webhook: verifies signature, runs daily attendee sync.
 */

import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { EnrollmentService } from "@/services/enrollment.service";
import { sendSuccess, sendError } from "@/utils/apiResponse";
import { HTTP_STATUS } from "@/constants";

async function handler() {
  try {
    const result = await EnrollmentService.processDailyCalendarSync();
    return sendSuccess(result, "Daily calendar sync completed");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Daily calendar sync failed";
    return sendError(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

export const POST = verifySignatureAppRouter(handler);
