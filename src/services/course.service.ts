/**
 * Yogshala LMS — Course Service
 * Business logic for course CRUD, search, and filtering.
 */

import { CourseRepository } from "@/repositories/course.repository";
import { deleteMedia, deleteMultipleMedia } from "@/utils/media";
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
   * Get a single course by slug.
   */
  static async getBySlug(slug: string): Promise<ICourse | null> {
    return CourseRepository.findBySlug(slug);
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
   * Delete a course by ID, cleaning up all Cloudinary media first.
   */
  static async delete(id: string): Promise<ICourse | null> {
    const course = await CourseRepository.findById(id);
    if (!course) return null;

    // Clean up all Cloudinary assets before deleting the document
    await CourseService.deleteAllCourseMedia(course);

    return CourseRepository.deleteById(id);
  }

  /**
   * Delete all Cloudinary assets attached to a course.
   * Uses allSettled so partial failures don't abort the deletion.
   */
  static async deleteAllCourseMedia(course: ICourse): Promise<void> {
    const deletions: Promise<void>[] = [];

    if (course.thumbnail?.public_id) {
      deletions.push(deleteMedia(course.thumbnail.public_id, "image"));
    }

    if (course.gallery && course.gallery.length > 0) {
      const galleryIds = course.gallery
        .map((g) => g.public_id)
        .filter(Boolean);
      deletions.push(deleteMultipleMedia(galleryIds, "image"));
    }

    if (course.introVideo?.public_id) {
      deletions.push(deleteMedia(course.introVideo.public_id, "video"));
    }

    await Promise.allSettled(deletions);
  }

  /**
   * List courses with pagination, search, and filtering.
   */
  static async list(query: CourseQueryInput) {
    const page = query.page || PAGINATION.DEFAULT_PAGE;
    const limit = query.limit || PAGINATION.DEFAULT_LIMIT;

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
