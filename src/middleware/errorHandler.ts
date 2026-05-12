/**
 * Yogshala LMS — Centralized Error Handler
 * Catches and formats different error types into standardized API responses.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { sendError, sendBadRequest } from "@/utils/apiResponse";
import { formatZodErrors, formatMongooseErrors } from "@/helpers/errorFormatter";
import { HTTP_STATUS } from "@/constants";

/**
 * Handle any error and return a standardized API response.
 */
export function handleError(error: unknown): NextResponse {
  // Zod validation error
  if (error instanceof z.ZodError) {
    const errors = formatZodErrors(error);
    return sendBadRequest("Validation failed", errors);
  }

  // Mongoose validation error
  if (error instanceof Error && error.name === "ValidationError") {
    const errors = formatMongooseErrors(
      error as Error & { errors?: Record<string, { message: string }> }
    );
    return sendBadRequest("Validation failed", errors);
  }

  // Mongoose duplicate key error
  if (
    error instanceof Error &&
    error.name === "MongoServerError" &&
    (error as Error & { code?: number }).code === 11000
  ) {
    return sendError("Duplicate entry found", HTTP_STATUS.CONFLICT);
  }

  // Mongoose CastError (invalid ObjectId)
  if (error instanceof Error && error.name === "CastError") {
    return sendBadRequest("Invalid ID format");
  }

  // Generic Error
  if (error instanceof Error) {
    console.error("[Error Handler]:", error.message);
    return sendError(
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }

  // Unknown error type
  console.error("[Error Handler]: Unknown error:", error);
  return sendError(
    "An unexpected error occurred",
    HTTP_STATUS.INTERNAL_SERVER_ERROR
  );
}

export default handleError;
