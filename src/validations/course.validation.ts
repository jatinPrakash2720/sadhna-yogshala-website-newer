/**
 * Yogshala LMS — Course Validation Schemas (Extended)
 * Zod 4 schemas for course CRUD and query filtering.
 * Includes curriculum, instructor, SEO, and extended fields.
 */

import { z } from "zod";
import { BatchType, MeetingPlatform, ALL_CLASS_DAYS } from "@/constants";
import { paginationSchema, objectIdSchema } from "./common.validation";

const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Must be in HH:MM format");

const scheduledSessionSchema = z.object({
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  startTime: timeSchema,
  endTime: timeSchema,
  slotKey: z.string().optional(),
});

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
const courseBodySchema = z.object({
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
    error: "Meeting platform must be google-meet",
  }).default(MeetingPlatform.GOOGLE_MEET),
  classDays: z
    .array(z.number().int().min(0).max(6))
    .min(1, "Select at least one class day")
    .default([...ALL_CLASS_DAYS]),
  classStartTime: timeSchema.default("07:00"),
  classEndTime: timeSchema.default("08:00"),
  scheduledSessions: z.array(scheduledSessionSchema).optional().default([]),

  // Instructor
  instructorUserId: objectIdSchema.optional(),
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

  // Publishing — builder always saves as draft
  isPublished: z.boolean().default(false).optional(),

  // When true, queue Google Calendar + Meet link generation for all scheduled classes
  generateCalendarLinks: z.boolean().optional().default(false),
});

function refineCourseSchedule(
  data: {
    startDate?: string;
    endDate?: string;
    classStartTime?: string;
    classEndTime?: string;
    scheduledSessions?: Array<{
      scheduledDate: string;
      startTime: string;
      endTime: string;
    }>;
    generateCalendarLinks?: boolean;
  },
  ctx: z.RefinementCtx
) {
  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (end < start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be on or after start date",
        path: ["endDate"],
      });
    }
  }
  if (data.classStartTime && data.classEndTime && data.classStartTime >= data.classEndTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Class end time must be after start time",
      path: ["classEndTime"],
    });
  }

  const sessions = data.scheduledSessions ?? [];
  if (sessions.length > 0) {
    sessions.forEach((session, index) => {
      if (session.startTime >= session.endTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time must be after start time",
          path: ["scheduledSessions", index, "endTime"],
        });
      }
    });
  }

  if (data.generateCalendarLinks && sessions.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Add at least one scheduled class before generating Meet links",
      path: ["scheduledSessions"],
    });
  }
}

export const createCourseSchema = courseBodySchema.superRefine(refineCourseSchedule);

/**
 * Update course schema — partial version of create.
 */
export const updateCourseSchema = courseBodySchema.partial().superRefine(refineCourseSchedule);

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
