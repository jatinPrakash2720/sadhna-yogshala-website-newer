/**
 * Yogshala LMS — Upstash QStash Client
 * Publishes background jobs for reliable async processing with retries.
 * On localhost, runs jobs inline (QStash cannot call loopback URLs).
 */

import { Client } from "@upstash/qstash";
import { CourseScheduleService } from "@/services/courseSchedule.service";
import { EnrollmentService } from "@/services/enrollment.service";

let client: Client | null = null;

function getAppBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.AUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  if (!raw) {
    throw new Error(
      "NEXT_PUBLIC_BASE_URL is not configured. Set it to your app's public URL (e.g. http://localhost:3000)."
    );
  }

  return raw.replace(/\/$/, "");
}

function isLoopbackBaseUrl(baseUrl: string): boolean {
  try {
    const { hostname } = new URL(baseUrl);
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname === "[::1]"
    );
  } catch {
    return false;
  }
}

export interface QueueJobResult {
  messageId: string;
  /** True when the job ran inline (local dev) instead of via QStash */
  inline?: boolean;
}

export function getQStashClient(): Client {
  if (!client) {
    if (!process.env.QSTASH_TOKEN) {
      throw new Error("QSTASH_TOKEN is not configured");
    }
    client = new Client({ token: process.env.QSTASH_TOKEN });
  }
  return client;
}

export async function enqueueCalendarBatchSync(): Promise<QueueJobResult> {
  const baseUrl = getAppBaseUrl();

  if (isLoopbackBaseUrl(baseUrl)) {
    await EnrollmentService.processDailyCalendarSync();
    return { messageId: `local-inline-${Date.now()}`, inline: true };
  }

  const result = await getQStashClient().publishJSON({
    url: `${baseUrl}/api/queue/process-calendar-batch`,
    body: {
      job: "daily-calendar-sync",
      triggeredAt: new Date().toISOString(),
    },
    retries: 3,
  });

  return { messageId: result.messageId };
}

export async function enqueueCourseCalendarGeneration(
  courseId: string
): Promise<QueueJobResult> {
  const baseUrl = getAppBaseUrl();

  if (isLoopbackBaseUrl(baseUrl)) {
    await CourseScheduleService.generateCalendarForCourse(courseId);
    return { messageId: `local-inline-${Date.now()}`, inline: true };
  }

  const result = await getQStashClient().publishJSON({
    url: `${baseUrl}/api/queue/generate-course-calendar`,
    body: {
      job: "generate-course-calendar",
      courseId,
      triggeredAt: new Date().toISOString(),
    },
    retries: 3,
  });

  return { messageId: result.messageId };
}
