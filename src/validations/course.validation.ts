/**
 * Yogshala LMS — Course Validation Schemas
 * Zod 4 schemas for course CRUD and query filtering.
 */

import { z } from "zod";
import { BatchType, MeetingPlatform } from "@/constants";
import { paginationSchema } from "./common.validation";

/**
 * Create course schema — admin only.
 */
export const createCourseSchema = z.object({
  title: z
    .string({ error: "Course title is required" })
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .trim(),
  description: z
    .string({ error: "Description is required" })
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must not exceed 5000 characters")
    .trim(),
  thumbnail: z.string().url("Must be a valid URL").optional(),
  price: z
    .number({ error: "Price is required" })
    .positive("Price must be a positive number")
    .max(100000, "Price must not exceed ₹1,00,000"),
  durationInMonths: z
    .number({ error: "Duration is required" })
    .int("Duration must be a whole number")
    .min(1, "Duration must be at least 1 month")
    .max(24, "Duration must not exceed 24 months"),
  batchType: z.nativeEnum(BatchType, {
    error: "Batch type must be morning, afternoon, or evening",
  }),
  startDate: z.string({ error: "Start date is required" }).datetime({ offset: true }).or(z.string().date()),
  endDate: z.string({ error: "End date is required" }).datetime({ offset: true }).or(z.string().date()),
  totalClasses: z
    .number({ error: "Total classes is required" })
    .int()
    .min(1, "Must have at least 1 class")
    .max(500, "Cannot exceed 500 classes"),
  instructorName: z
    .string({ error: "Instructor name is required" })
    .min(2, "Instructor name must be at least 2 characters")
    .max(100)
    .trim(),
  meetingPlatform: z.nativeEnum(MeetingPlatform, {
    error: "Meeting platform must be zoom or google-meet",
  }),
  isPublished: z.boolean().default(false).optional(),
});

/**
 * Update course schema — partial version of create.
 */
export const updateCourseSchema = createCourseSchema.partial();

/**
 * Course query params schema — for listing/filtering.
 */
export const courseQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  batchType: z.nativeEnum(BatchType).optional(),
  meetingPlatform: z.nativeEnum(MeetingPlatform).optional(),
  isPublished: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CourseQueryInput = z.infer<typeof courseQuerySchema>;
