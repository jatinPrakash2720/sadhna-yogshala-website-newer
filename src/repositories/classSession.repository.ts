/**
 * Yogshala LMS — ClassSession Repository
 * Data access layer for ClassSession model operations.
 */

import ClassSession from "@/models/ClassSession.model";
import { connectToDatabase } from "@/config/database";
import { ClassStatus, ClassSessionSource } from "@/constants";
import type { IClassSession } from "@/types";
import mongoose from "mongoose";

export class ClassSessionRepository {
  private static async connect() {
    await connectToDatabase();
  }

  /**
   * Create a class session.
   */
  static async create(data: Partial<IClassSession>): Promise<IClassSession> {
    await this.connect();
    const session = await ClassSession.create(data);
    return session.toJSON() as IClassSession;
  }

  /**
   * Find a class session by ID.
   */
  static async findById(id: string): Promise<IClassSession | null> {
    await this.connect();
    return ClassSession.findById(id)
      .populate("course", "title slug")
      .lean<IClassSession>();
  }

  /**
   * Update a class session.
   */
  static async updateById(
    id: string,
    data: mongoose.UpdateQuery<IClassSession>
  ): Promise<IClassSession | null> {
    await this.connect();
    return ClassSession.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean<IClassSession>();
  }

  /**
   * Delete a class session.
   */
  static async deleteById(id: string): Promise<IClassSession | null> {
    await this.connect();
    return ClassSession.findByIdAndDelete(id).lean<IClassSession>();
  }

  /**
   * Find all classes for a course, sorted by date.
   */
  static async findByCourse(
    courseId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ sessions: IClassSession[]; total: number }> {
    await this.connect();
    const skip = (page - 1) * limit;
    const filter = { course: courseId };

    const [sessions, total] = await Promise.all([
      ClassSession.find(filter)
        .sort({ scheduledDate: 1, startTime: 1 })
        .skip(skip)
        .limit(limit)
        .lean<IClassSession[]>(),
      ClassSession.countDocuments(filter),
    ]);

    return { sessions, total };
  }

  /**
   * Find upcoming class sessions with Google Calendar events for given courses.
   */
  static async findUpcomingByCourseIds(
    courseIds: string[]
  ): Promise<IClassSession[]> {
    await this.connect();

    if (courseIds.length === 0) {
      return [];
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    return ClassSession.find({
      course: { $in: courseIds },
      status: ClassStatus.UPCOMING,
      scheduledDate: { $gte: startOfToday },
      googleEventId: { $exists: true, $ne: null },
    })
      .sort({ scheduledDate: 1, startTime: 1 })
      .lean<IClassSession[]>();
  }

  /**
   * Find class sessions for a course by source type.
   */
  static async findByCourseAndSource(
    courseId: string,
    source: ClassSessionSource
  ): Promise<IClassSession[]> {
    await this.connect();
    return ClassSession.find({ course: courseId, source })
      .sort({ scheduledDate: 1, startTime: 1 })
      .lean<IClassSession[]>();
  }

  /**
   * Delete class sessions for a course by source type.
   */
  static async deleteByCourseAndSource(
    courseId: string,
    source: ClassSessionSource
  ): Promise<number> {
    await this.connect();
    const result = await ClassSession.deleteMany({ course: courseId, source });
    return result.deletedCount ?? 0;
  }
}

export default ClassSessionRepository;
