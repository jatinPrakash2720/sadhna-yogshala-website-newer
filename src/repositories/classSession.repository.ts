/**
 * Yogshala LMS — ClassSession Repository
 * Data access layer for ClassSession model operations.
 */

import ClassSession from "@/models/ClassSession.model";
import { connectToDatabase } from "@/config/database";
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
}

export default ClassSessionRepository;
