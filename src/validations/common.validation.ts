/**
 * Yogshala LMS — Common Validation Schemas
 * Reusable Zod 4 validators for shared field types.
 */

import { z } from "zod";
import { PAGINATION } from "@/constants";

/**
 * MongoDB ObjectId validator (24-character hex string).
 */
export const objectIdSchema = z
  .string({ error: "Invalid ID format" })
  .regex(/^[0-9a-fA-F]{24}$/, { message: "Must be a valid MongoDB ObjectId" });

/**
 * Email validator — uses Zod 4 top-level z.email() if available,
 * falls back to z.string().email() for compatibility.
 */
export const emailSchema = z
  .string({ error: "Email is required" })
  .email("Must be a valid email address")
  .transform((val) => val.toLowerCase().trim());

/**
 * Phone number validator — E.164-like format.
 */
export const phoneSchema = z
  .string({ error: "Phone number is required" })
  .regex(/^\+?[1-9]\d{6,14}$/, {
    message: "Must be a valid phone number (e.g., +919876543210)",
  });

/**
 * Pagination query params validator.
 */
export const paginationSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(PAGINATION.DEFAULT_PAGE)
    .optional(),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(PAGINATION.MAX_LIMIT)
    .default(PAGINATION.DEFAULT_LIMIT)
    .optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc").optional(),
});

/**
 * Strong password validator.
 * Requires: 8+ chars, uppercase, lowercase, number, special character.
 */
export const strongPasswordSchema = z
  .string({ error: "Password is required" })
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/\d/, "Password must include a number")
  .regex(/[@$!%*?&]/, "Password must include a special character (@$!%*?&)");
