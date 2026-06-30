/**
 * Yogshala LMS — Class Session Validation Schemas
 * Zod 4 schemas for class session CRUD operations.
 */

import { z } from "zod";
import { objectIdSchema } from "./common.validation";

/**
 * Create class session schema — admin only.
 */
export const createClassSchema = z.object({
  courseId: objectIdSchema,
  title: z
    .string({ error: "Class title is required" })
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .trim(),
  scheduledDate: z
    .string({ error: "Scheduled date is required" })
    .datetime({ offset: true })
    .or(z.string().date()),
  startTime: z
    .string({ error: "Start time is required" })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Must be in HH:MM format"),
  endTime: z
    .string({ error: "End time is required" })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Must be in HH:MM format"),
});

/**
 * Update class session schema — partial version.
 */
export const updateClassSchema = createClassSchema.partial().omit({ courseId: true });

export type CreateClassInput = z.infer<typeof createClassSchema>;
export type UpdateClassInput = z.infer<typeof updateClassSchema>;
