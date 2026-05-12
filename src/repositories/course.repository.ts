/**
 * Yogshala LMS — Course Repository
 * Data access layer for Course model operations.
 */

import Course from "@/models/Course.model";
import { connectToDatabase } from "@/config/database";
import type { ICourse } from "@/types";
import mongoose from "mongoose";

export class CourseRepository {
  private static async connect() {
    await connectToDatabase();
  }

  /**
   * Find a course by ID.
   */
  static async findById(id: string): Promise<ICourse | null> {
    await this.connect();
    return Course.findById(id).lean<ICourse>();
  }

  /**
   * Find a course by slug.
   */
  static async findBySlug(slug: string): Promise<ICourse | null> {
    await this.connect();
    return Course.findOne({ slug }).lean<ICourse>();
  }

  /**
   * Create a new course.
   */
  static async create(data: Partial<ICourse>): Promise<ICourse> {
    await this.connect();
    const course = await Course.create(data);
    return course.toJSON() as ICourse;
  }

  /**
   * Update a course by ID.
   */
  static async updateById(
    id: string,
    data: mongoose.UpdateQuery<ICourse>
  ): Promise<ICourse | null> {
    await this.connect();
    return Course.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean<ICourse>();
  }

  /**
   * Delete a course by ID.
   */
  static async deleteById(id: string): Promise<ICourse | null> {
    await this.connect();
    return Course.findByIdAndDelete(id).lean<ICourse>();
  }

  /**
   * Find courses with pagination, search, and filtering.
   */
  static async findAll(options: {
    filter?: mongoose.QueryFilter<ICourse>;
    search?: string;
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  }): Promise<{ courses: ICourse[]; total: number }> {
    await this.connect();
    const {
      filter = {},
      search,
      page = 1,
      limit = 10,
      sort = { createdAt: -1 },
    } = options;

    const skip = (page - 1) * limit;
    const query: mongoose.QueryFilter<ICourse> = { ...filter };

    // Text search on title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const [courses, total] = await Promise.all([
      Course.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean<ICourse[]>(),
      Course.countDocuments(query),
    ]);

    return { courses, total };
  }

  /**
   * Count courses matching a filter.
   */
  static async count(filter: mongoose.QueryFilter<ICourse> = {}): Promise<number> {
    await this.connect();
    return Course.countDocuments(filter);
  }
}

export default CourseRepository;
