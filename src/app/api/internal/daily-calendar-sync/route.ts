/**
 * Yogshala LMS — Daily Calendar Sync Trigger
 * GET /api/internal/daily-calendar-sync
 * Vercel Cron enqueues the batch job via QStash and returns immediately.
 */

import { asyncHandler } from "@/utils/asyncHandler";
import { sendSuccess } from "@/utils/apiResponse";
import { withCronSecret } from "@/middleware/withCronSecret";
import { enqueueCalendarBatchSync } from "@/lib/qstash";

export const GET = asyncHandler(
  withCronSecret(async () => {
    const { messageId } = await enqueueCalendarBatchSync();

    return sendSuccess(
      { messageId, queued: true },
      "Daily calendar sync enqueued"
    );
  })
);
