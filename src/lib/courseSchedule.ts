/**
 * Yogshala LMS — Course schedule utilities
 */

import { GOOGLE_CALENDAR, BatchType, COURSE_TIME_SLOTS } from "@/constants";
import type { IScheduledSession } from "@/types";

export interface CourseScheduleInput {
  startDate: Date;
  endDate: Date;
  classDays: number[];
  totalClasses: number;
}

export function computeDurationInMonths(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  if (end.getDate() >= start.getDate()) {
    months += 1;
  }
  return Math.max(1, Math.min(24, months));
}

export function getDatesInRange(startDate: string, endDate: string): Date[] {
  const dates: Date[] = [];
  const cursor = new Date(startDate);
  cursor.setHours(12, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(12, 0, 0, 0);

  while (cursor <= end) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

export function formatDateKey(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function inferBatchType(sessions: IScheduledSession[]): BatchType {
  const withSlot = sessions.find((session) => session.slotKey);
  if (!withSlot?.slotKey) {
    return BatchType.MORNING;
  }
  const match = COURSE_TIME_SLOTS.find((slot) => slot.key === withSlot.slotKey);
  return match?.batchType ?? BatchType.MORNING;
}

export function sortScheduledSessions(
  sessions: IScheduledSession[]
): IScheduledSession[] {
  return [...sessions].sort((a, b) => {
    const dateCompare = a.scheduledDate.localeCompare(b.scheduledDate);
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });
}

export function validateScheduledSessions(sessions: IScheduledSession[]): void {
  if (sessions.length === 0) {
    throw new Error("Select at least one class on the schedule calendar");
  }

  for (const session of sessions) {
    if (!session.startTime || !session.endTime) {
      throw new Error(
        `Set start and end time for class on ${session.scheduledDate}`
      );
    }
    if (session.startTime >= session.endTime) {
      throw new Error(
        `End time must be after start time for ${session.scheduledDate}`
      );
    }
  }
}

export function countAvailableClassSlots(input: CourseScheduleInput): number {
  return computeClassDates(input).length;
}

export function computeClassDates(input: CourseScheduleInput): Date[] {
  const { startDate, endDate, classDays, totalClasses } = input;
  const allowedDays = new Set(classDays);
  const dates: Date[] = [];

  const cursor = new Date(startDate);
  cursor.setHours(12, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  while (cursor <= end && dates.length < totalClasses) {
    if (allowedDays.has(cursor.getDay())) {
      dates.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

export function validateScheduleCapacity(input: CourseScheduleInput): void {
  const available = countAvailableClassSlots(input);
  if (available < input.totalClasses) {
    throw new Error(
      `Schedule only fits ${available} classes between the selected dates and days, but ${input.totalClasses} were requested`
    );
  }
}

export function estimateCalendarGenerationSeconds(classCount: number): number {
  return Math.ceil(classCount * GOOGLE_CALENDAR.SECONDS_PER_EVENT);
}

export function formatGenerationEstimate(classCount: number): string {
  const seconds = estimateCalendarGenerationSeconds(classCount);
  if (seconds < 60) {
    return `~${seconds} seconds`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `~${minutes} minute${minutes === 1 ? "" : "s"}`;
}
