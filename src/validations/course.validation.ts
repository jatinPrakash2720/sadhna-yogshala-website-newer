/**
 * Yogshala LMS — Course Validation Schemas (Extended)
 * Zod 4 schemas for course CRUD and query filtering.
 * Includes curriculum, instructor, SEO, and extended fields.
 */

import { z } from "zod";
import { BatchType, MeetingPlatform } from "@/constants";
import { paginationSchema } from "./common.validation";

// ─── Sub-schemas ─────────────────────────────────────────

const curriculumLessonSchema = z.object({
  title: z.string().min(1, "Lesson title is required").max(200).trim(),
  duration: z.number().min(0).default(0),
  isPreview: z.boolean().default(false),
});

const curriculumSectionSchema = z.object({
  sectionTitle: z.string().min(1, "Section title is required").max(200).trim(),
  lessons: z.array(curriculumLessonSchema).default([]),
});

const instructorSchema = z.object({
  name: z.string().min(2, "Instructor name must be at least 2 characters").max(100).trim(),
  title: z.string().max(150).trim().optional().default(""),
  bio: z.string().max(1000).trim().optional().default(""),
});

const seoSchema = z.object({
  metaTitle: z.string().max(70).trim().optional().default(""),
  metaDescription: z.string().max(160).trim().optional().default(""),
  slug: z.string().max(200).trim().optional().default(""),
  keywords: z.array(z.string()).optional().default([]),
});

const mediaAssetSchema = z.object({
  url: z.string().url("Invalid media URL"),
  public_id: z.string().min(1, "Public ID is required"),
});

const videoAssetSchema = z.object({
  url: z.string().url("Invalid video URL"),
  public_id: z.string().min(1, "Public ID is required"),
  thumbnail: z.string().optional().default(""),
  duration: z.number().optional().default(0),
});

/**
 * Create course schema — admin only.
 */
export const createCourseSchema = z.object({
  // Core info
  title: z
    .string({ error: "Course title is required" })
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .trim(),
  shortDescription: z
    .string()
    .max(300, "Short description must not exceed 300 characters")
    .trim()
    .optional()
    .default(""),
  description: z
    .string({ error: "Description is required" })
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must not exceed 5000 characters")
    .trim(),
  category: z.string().max(100).trim().optional().default(""),
  tags: z.array(z.string().max(50)).optional().default([]),
  level: z
    .enum(["beginner", "intermediate", "advanced", "all-levels", ""])
    .optional()
    .default(""),
  language: z.string().max(50).optional().default("English"),

  // Media
  thumbnail: mediaAssetSchema.optional(),
  gallery: z.array(mediaAssetSchema).optional().default([]),
  introVideo: videoAssetSchema.optional(),

  // Pricing & batch
  price: z
    .number({ error: "Price is required" })
    .min(0, "Price cannot be negative")
    .max(100000, "Price must not exceed ₹1,00,000"),
  discountPrice: z
    .number()
    .min(0, "Discount price cannot be negative")
    .optional(),
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
  meetingPlatform: z.nativeEnum(MeetingPlatform, {
    error: "Meeting platform must be zoom or google-meet",
  }),

  // Instructor
  instructorName: z
    .string({ error: "Instructor name is required" })
    .min(2, "Instructor name must be at least 2 characters")
    .max(100)
    .trim()
    .optional(),
  instructor: instructorSchema.optional(),

  // Curriculum
  curriculum: z.array(curriculumSectionSchema).optional().default([]),

  // SEO
  seo: seoSchema.optional(),

  // Publishing
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
  category: z.string().optional(),
  level: z.string().optional(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CourseQueryInput = z.infer<typeof courseQuerySchema>;
