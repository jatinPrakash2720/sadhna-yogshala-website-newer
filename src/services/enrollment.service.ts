/**
 * Yogshala LMS — Enrollment Service
 * Business logic for enrollment management and progress tracking.
 */

import { EnrollmentRepository } from "@/repositories/enrollment.repository";
import { ClassSessionRepository } from "@/repositories/classSession.repository";
import { CalendarService } from "@/services/calendar.service";
import { CalendarSyncStatus, PAGINATION } from "@/constants";
import type { IEnrollment } from "@/types";

export interface DailyCalendarSyncResult {
  processedCourses: number;
  syncedEnrollments: number;
  failedEnrollments: number;
  skippedSessions: number;
  errors: Array<{ enrollmentId: string; message: string }>;
}

function getStudentEmail(enrollment: IEnrollment): string | null {
  const student = enrollment.student as unknown as {
    email?: string;
  };

  if (student && typeof student === "object" && "email" in student) {
    return student.email?.trim().toLowerCase() ?? null;
  }

  return null;
}

function getCourseId(enrollment: IEnrollment): string {
  const course = enrollment.course as unknown;
  if (course && typeof course === "object" && "_id" in course) {
    return String((course as { _id: unknown })._id);
  }
  return String(enrollment.course);
}

export class EnrollmentService {
  /**
   * Get enrolled courses for a student.
   */
  static async getMyEnrollments(
    studentId: string,
    page: number = PAGINATION.DEFAULT_PAGE,
    limit: number = PAGINATION.DEFAULT_LIMIT
  ) {
    const { enrollments, total } =
      await EnrollmentRepository.findByStudent(studentId, page, limit);

    const totalPages = Math.ceil(total / limit);

    return {
      enrollments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Get a single enrollment by ID (with validation that it belongs to the student).
   */
  static async getEnrollmentById(enrollmentId: string, studentId: string) {
    const enrollment = await EnrollmentRepository.findById(enrollmentId);

    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    if (enrollment.student.toString() !== studentId) {
      throw new Error("You do not have access to this enrollment");
    }

    return enrollment;
  }

  /**
   * Update enrollment progress.
   */
  static async updateProgress(
    enrollmentId: string,
    progressPercentage: number
  ) {
    const completed = progressPercentage >= 100;

    return EnrollmentRepository.updateById(enrollmentId, {
      progressPercentage: Math.min(progressPercentage, 100),
      completed,
    });
  }

  /**
   * Daily batch: add pending enrollments as attendees on upcoming course calendar events.
   */
  static async processDailyCalendarSync(): Promise<DailyCalendarSyncResult> {
    const result: DailyCalendarSyncResult = {
      processedCourses: 0,
      syncedEnrollments: 0,
      failedEnrollments: 0,
      skippedSessions: 0,
      errors: [],
    };

    const pending = await EnrollmentRepository.findPendingCalendarSyncs();
    if (pending.length === 0) {
      return result;
    }

    const enrollmentsByCourse = new Map<string, IEnrollment[]>();

    for (const enrollment of pending) {
      const email = getStudentEmail(enrollment);
      if (!email) {
        const enrollmentId = enrollment._id.toString();
        await EnrollmentRepository.updateCalendarSyncStatus(
          enrollmentId,
          CalendarSyncStatus.FAILED,
          "Student email is missing"
        );
        result.failedEnrollments += 1;
        result.errors.push({
          enrollmentId,
          message: "Student email is missing",
        });
        continue;
      }

      const courseId = getCourseId(enrollment);
      const group = enrollmentsByCourse.get(courseId) ?? [];
      group.push(enrollment);
      enrollmentsByCourse.set(courseId, group);
    }

    const courseIds = Array.from(enrollmentsByCourse.keys());
    if (courseIds.length === 0) {
      return result;
    }

    const sessions = await ClassSessionRepository.findUpcomingByCourseIds(
      courseIds
    );

    const sessionsByCourse = new Map<string, typeof sessions>();
    for (const session of sessions) {
      const courseId = session.course.toString();
      const group = sessionsByCourse.get(courseId) ?? [];
      group.push(session);
      sessionsByCourse.set(courseId, group);
    }

    for (const [courseId, enrollments] of enrollmentsByCourse) {
      result.processedCourses += 1;

      const courseSessions = sessionsByCourse.get(courseId) ?? [];
      if (courseSessions.length === 0) {
        const message = "No upcoming calendar events for course";
        for (const enrollment of enrollments) {
          const enrollmentId = enrollment._id.toString();
          await EnrollmentRepository.updateCalendarSyncStatus(
            enrollmentId,
            CalendarSyncStatus.FAILED,
            message
          );
          result.failedEnrollments += 1;
          result.errors.push({ enrollmentId, message });
        }
        continue;
      }

      const emails = [
        ...new Set(
          enrollments
            .map((enrollment) => getStudentEmail(enrollment))
            .filter((email): email is string => Boolean(email))
        ),
      ];

      const patchErrors: string[] = [];

      for (const session of courseSessions) {
        if (!session.googleEventId) {
          result.skippedSessions += 1;
          continue;
        }

        try {
          await CalendarService.addAttendees(session.googleEventId, emails);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown calendar error";
          patchErrors.push(`${session._id.toString()}: ${message}`);
        }
      }

      if (patchErrors.length === 0) {
        for (const enrollment of enrollments) {
          await EnrollmentRepository.updateCalendarSyncStatus(
            enrollment._id.toString(),
            CalendarSyncStatus.SYNCED
          );
          result.syncedEnrollments += 1;
        }
      } else {
        const message = patchErrors.join("; ");
        for (const enrollment of enrollments) {
          const enrollmentId = enrollment._id.toString();
          await EnrollmentRepository.updateCalendarSyncStatus(
            enrollmentId,
            CalendarSyncStatus.FAILED,
            message
          );
          result.failedEnrollments += 1;
          result.errors.push({ enrollmentId, message });
        }
      }
    }

    return result;
  }
}

export default EnrollmentService;
