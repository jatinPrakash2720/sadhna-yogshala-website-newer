/**
 * Yogshala LMS — ClassSession Service
 * Business logic for class session scheduling and management.
 */

import { ClassSessionRepository } from "@/repositories/classSession.repository";
import { CourseRepository } from "@/repositories/course.repository";
import type { IClassSession } from "@/types";
import type {
  CreateClassInput,
  UpdateClassInput,
} from "@/validations/class.validation";

export class ClassSessionService {
  /**
   * Create a new class session.
   */
  static async create(data: CreateClassInput): Promise<IClassSession> {
    // Verify the course exists
    const course = await CourseRepository.findById(data.courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    return ClassSessionRepository.create({
      course: data.courseId as unknown as IClassSession["course"],
      title: data.title,
      meetingLink: data.meetingLink,
      scheduledDate: new Date(data.scheduledDate),
      startTime: data.startTime,
      endTime: data.endTime,
    });
  }

  /**
   * Update a class session.
   */
  static async update(
    id: string,
    data: UpdateClassInput
  ): Promise<IClassSession | null> {
    const session = await ClassSessionRepository.findById(id);
    if (!session) {
      throw new Error("Class session not found");
    }

    const updateData: Record<string, unknown> = { ...data };
    if (data.scheduledDate) {
      updateData.scheduledDate = new Date(data.scheduledDate);
    }

    return ClassSessionRepository.updateById(id, updateData);
  }

  /**
   * Delete a class session.
   */
  static async delete(id: string): Promise<IClassSession | null> {
    const session = await ClassSessionRepository.findById(id);
    if (!session) {
      throw new Error("Class session not found");
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
    // Verify the course exists
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
