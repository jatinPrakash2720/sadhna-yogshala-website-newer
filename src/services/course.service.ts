/**
 * Yogshala LMS — Course Service
 * Business logic for course CRUD, search, and filtering.
 */

import { CourseRepository } from "@/repositories/course.repository";
import type { ICourse } from "@/types";
import type {
  CreateCourseInput,
  UpdateCourseInput,
  CourseQueryInput,
} from "@/validations/course.validation";
import mongoose from "mongoose";
import { PAGINATION } from "@/constants";

export class CourseService {
  /**
   * Create a new course.
   */
  static async create(data: CreateCourseInput): Promise<ICourse> {
    return CourseRepository.create({
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    });
  }

  /**
   * Get a single course by ID.
   */
  static async getById(id: string): Promise<ICourse | null> {
    return CourseRepository.findById(id);
  }

  /**
   * Update a course by ID.
   */
  static async update(
    id: string,
    data: UpdateCourseInput
  ): Promise<ICourse | null> {
    const updateData: Record<string, unknown> = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);

    return CourseRepository.updateById(id, updateData);
  }

  /**
   * Delete a course by ID.
   */
  static async delete(id: string): Promise<ICourse | null> {
    return CourseRepository.deleteById(id);
  }

  /**
   * List courses with pagination, search, and filtering.
   */
  static async list(query: CourseQueryInput) {
    const page = query.page || PAGINATION.DEFAULT_PAGE;
    const limit = query.limit || PAGINATION.DEFAULT_LIMIT;

    // Build filter
    const filter: mongoose.QueryFilter<ICourse> = {};

    if (query.batchType) filter.batchType = query.batchType;
    if (query.meetingPlatform) filter.meetingPlatform = query.meetingPlatform;
    if (typeof query.isPublished === "boolean") {
      filter.isPublished = query.isPublished;
    }
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.price = {};
      if (query.minPrice !== undefined) filter.price.$gte = query.minPrice;
      if (query.maxPrice !== undefined) filter.price.$lte = query.maxPrice;
    }

    // Build sort
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder === "asc" ? 1 : -1;
    const sort = { [sortBy]: sortOrder } as Record<string, 1 | -1>;

    const { courses, total } = await CourseRepository.findAll({
      filter,
      search: query.search,
      page,
      limit,
      sort,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      courses,
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

export default CourseService;
