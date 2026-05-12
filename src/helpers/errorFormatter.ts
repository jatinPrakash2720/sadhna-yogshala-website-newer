/**
 * Yogshala LMS — Error Formatter
 * Converts Zod 4 errors and Mongoose errors to human-readable format.
 */

import { z } from "zod";

/**
 * Format Zod 4 validation errors into a clean key-value structure.
 * Uses Zod 4's unified error API.
 */
export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.length > 0 ? issue.path.join(".") : "_root";
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(issue.message);
  }

  return formatted;
}

/**
 * Format Mongoose validation errors into a clean key-value structure.
 */
export function formatMongooseErrors(
  error: Error & { errors?: Record<string, { message: string }> }
): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};

  if (error.errors) {
    for (const [field, err] of Object.entries(error.errors)) {
      formatted[field] = [err.message];
    }
  }

  return formatted;
}

/**
 * Extract a user-friendly error message from any error type.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues.map((i) => i.message).join(", ");
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}
