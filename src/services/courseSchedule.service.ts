/**
 * Yogshala LMS — Course Schedule Service
 * Generates ClassSession records + Google Calendar events from course timetable.
 */

import { CourseRepository } from "@/repositories/course.repository";
import { ClassSessionRepository } from "@/repositories/classSession.repository";
import { UserRepository } from "@/repositories/user.repository";
import { CalendarService } from "@/services/calendar.service";
import { ClassSessionSource, ALL_CLASS_DAYS } from "@/constants";
import {
  computeClassDates,
  validateScheduleCapacity,
  formatGenerationEstimate,
  sortScheduledSessions,
  validateScheduledSessions,
} from "@/lib/courseSchedule";
import type { ICourse } from "@/types";

export interface GenerateCourseCalendarResult {
  courseId: string;
  sessionsCreated: number;
  estimatedDuration: string;
}

interface ResolvedClassSlot {
  scheduledDate: Date;
  startTime: string;
  endTime: string;
}

export class CourseScheduleService {
  static getGenerationEstimate(course: Pick<ICourse, "totalClasses">): string {
    return formatGenerationEstimate(course.totalClasses);
  }

  private static resolveClassSlots(course: ICourse): ResolvedClassSlot[] {
    if (course.scheduledSessions && course.scheduledSessions.length > 0) {
      validateScheduledSessions(course.scheduledSessions);
      return sortScheduledSessions(course.scheduledSessions).map((session) => ({
        scheduledDate: new Date(session.scheduledDate),
        startTime: session.startTime,
        endTime: session.endTime,
      }));
    }

    const scheduleInput = {
      startDate: new Date(course.startDate),
      endDate: new Date(course.endDate),
      classDays: course.classDays ?? [...ALL_CLASS_DAYS],
      totalClasses: course.totalClasses,
    };

    validateScheduleCapacity(scheduleInput);
    return computeClassDates(scheduleInput).map((scheduledDate) => ({
      scheduledDate,
      startTime: course.classStartTime,
      endTime: course.classEndTime,
    }));
  }

  /**
   * Replace auto-generated sessions and create Google Calendar events for each class.
   */
  static async generateCalendarForCourse(
    courseId: string
  ): Promise<GenerateCourseCalendarResult> {
    const course = await CourseRepository.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    const classSlots = this.resolveClassSlots(course);

    const existingScheduled =
      await ClassSessionRepository.findByCourseAndSource(
        courseId,
        ClassSessionSource.COURSE_SCHEDULE
      );

    for (const session of existingScheduled) {
      if (session.googleEventId) {
        try {
          await CalendarService.deleteEvent(session.googleEventId);
        } catch {
          // Continue cleanup even if Google event is already gone
        }
      }
    }

    await ClassSessionRepository.deleteByCourseAndSource(
      courseId,
      ClassSessionSource.COURSE_SCHEDULE
    );

    let sessionsCreated = 0;

    for (let index = 0; index < classSlots.length; index++) {
      const slot = classSlots[index];
      const sessionNumber = index + 1;
      const title = `${course.title} — Class ${sessionNumber}`;

      const calendarEvent = await CalendarService.createEventWithMeet({
        title,
        scheduledDate: slot.scheduledDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
        description: course.title,
      });

      await ClassSessionRepository.create({
        course: course._id,
        title,
        meetingLink: calendarEvent.meetingLink,
        googleEventId: calendarEvent.googleEventId,
        scheduledDate: slot.scheduledDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
        source: ClassSessionSource.COURSE_SCHEDULE,
        sessionNumber,
      });

      sessionsCreated += 1;
    }

    await CourseRepository.updateById(courseId, {
      calendarLinksGenerated: true,
      calendarLinksGeneratedAt: new Date(),
    });

    return {
      courseId,
      sessionsCreated,
      estimatedDuration: formatGenerationEstimate(classSlots.length),
    };
  }

  /**
   * Resolve instructor display fields from selected user or fall back to manual name.
   */
  static async resolveInstructorFields(
    instructorUserId: string | undefined,
    instructorName: string | undefined,
    instructor?: { title?: string; bio?: string }
  ) {
    if (!instructorUserId) {
      return {
        instructorUser: undefined,
        instructorName,
        instructor: instructorName
          ? {
              name: instructorName,
              title: instructor?.title ?? "",
              bio: instructor?.bio ?? "",
            }
          : undefined,
      };
    }

    const user = await UserRepository.findById(instructorUserId);
    if (!user) {
      throw new Error("Selected instructor user not found");
    }

    return {
      instructorUser: user._id,
      instructorName: user.name,
      instructor: {
        name: user.name,
        title: instructor?.title ?? "",
        bio: instructor?.bio ?? "",
      },
    };
  }
}

export default CourseScheduleService;
