/**
 * Yogshala LMS — ClassSession Service
 * Business logic for class session scheduling and management.
 */

import { ClassSessionRepository } from "@/repositories/classSession.repository";
import { CourseRepository } from "@/repositories/course.repository";
import { CalendarService } from "@/services/calendar.service";
import { GOOGLE_CALENDAR, ClassSessionSource } from "@/constants";
import type { IClassSession } from "@/types";
import type {
  CreateClassInput,
  UpdateClassInput,
} from "@/validations/class.validation";

function formatDatePart(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildEventDateTime(scheduledDate: Date, time: string) {
  return {
    dateTime: `${formatDatePart(scheduledDate)}T${time}:00`,
    timeZone: GOOGLE_CALENDAR.TIMEZONE,
  };
}

export class ClassSessionService {
  /**
   * Create a new class session with a Google Calendar event and Meet link.
   */
  static async create(data: CreateClassInput): Promise<IClassSession> {
    const course = await CourseRepository.findById(data.courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    const scheduledDate = new Date(data.scheduledDate);

    const calendarEvent = await CalendarService.createEventWithMeet({
      title: data.title,
      scheduledDate,
      startTime: data.startTime,
      endTime: data.endTime,
      description: course.title,
    });

    return ClassSessionRepository.create({
      course: data.courseId as unknown as IClassSession["course"],
      title: data.title,
      meetingLink: calendarEvent.meetingLink,
      googleEventId: calendarEvent.googleEventId,
      scheduledDate,
      startTime: data.startTime,
      endTime: data.endTime,
      source: ClassSessionSource.MANUAL,
    });
  }

  /**
   * Update a class session and sync changes to Google Calendar when applicable.
   */
  static async update(
    id: string,
    data: UpdateClassInput
  ): Promise<IClassSession | null> {
    const session = await ClassSessionRepository.findById(id);
    if (!session) {
      throw new Error("Class session not found");
    }

    const scheduledDate = data.scheduledDate
      ? new Date(data.scheduledDate)
      : new Date(session.scheduledDate);
    const title = data.title ?? session.title;
    const startTime = data.startTime ?? session.startTime;
    const endTime = data.endTime ?? session.endTime;

    const scheduleChanged =
      data.scheduledDate !== undefined ||
      data.startTime !== undefined ||
      data.endTime !== undefined ||
      data.title !== undefined;

    let googleEventId = session.googleEventId;
    let meetingLink = session.meetingLink;

    if (scheduleChanged) {
      if (googleEventId) {
        await CalendarService.patchEvent(googleEventId, {
          summary: title,
          start: buildEventDateTime(scheduledDate, startTime),
          end: buildEventDateTime(scheduledDate, endTime),
        });
      } else {
        const course = await CourseRepository.findById(session.course.toString());
        const calendarEvent = await CalendarService.createEventWithMeet({
          title,
          scheduledDate,
          startTime,
          endTime,
          description: course?.title,
        });
        googleEventId = calendarEvent.googleEventId;
        meetingLink = calendarEvent.meetingLink;
      }
    }

    const updateData: Record<string, unknown> = { ...data };
    if (data.scheduledDate) {
      updateData.scheduledDate = scheduledDate;
    }
    if (googleEventId) {
      updateData.googleEventId = googleEventId;
    }
    if (meetingLink) {
      updateData.meetingLink = meetingLink;
    }

    return ClassSessionRepository.updateById(id, updateData);
  }

  /**
   * Delete a class session and its Google Calendar event.
   */
  static async delete(id: string): Promise<IClassSession | null> {
    const session = await ClassSessionRepository.findById(id);
    if (!session) {
      throw new Error("Class session not found");
    }

    if (session.googleEventId) {
      await CalendarService.deleteEvent(session.googleEventId);
    }

    return ClassSessionRepository.deleteById(id);
  }

  /**
   * Get all classes for a specific course.
   */
  static async getByCourse(
    courseId: string,
    page: number = 1,
    limit: number = 20
  ) {
    const course = await CourseRepository.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    const { sessions, total } = await ClassSessionRepository.findByCourse(
      courseId,
      page,
      limit
    );

    const totalPages = Math.ceil(total / limit);

    return {
      sessions,
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
}

export default ClassSessionService;
