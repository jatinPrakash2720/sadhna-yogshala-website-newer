/**
 * Yogshala LMS — Async Handler Utility
 * Wraps Next.js route handlers with try/catch for clean error handling.
 */

import { NextRequest, NextResponse } from "next/server";
import { sendError } from "@/utils/apiResponse";
import { HTTP_STATUS } from "@/constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RouteHandler = (...args: any[]) => Promise<NextResponse>;

/**
 * Wraps an async route handler with error catching.
 * Automatically returns a standardized error response on failure.
 */
export function asyncHandler(handler: RouteHandler): (req: NextRequest, context?: { params: Promise<Record<string, string>> }) => Promise<NextResponse> {
  return async (req: NextRequest, context?: { params: Promise<Record<string, string>> }) => {
    try {
      return await handler(req, context);
    } catch (error: unknown) {
      console.error(`[API Error] ${req.method} ${req.nextUrl.pathname}:`, error);

      if (error instanceof Error) {
        // ... (existing Mongoose handlers)
        if (error.name === "ValidationError") {
          return sendError("Validation failed", HTTP_STATUS.BAD_REQUEST, [error.message]);
        }
        if (error.name === "MongoServerError" && (error as any).code === 11000) {
          return sendError("Duplicate entry found", HTTP_STATUS.CONFLICT, [error.message]);
        }
        if (error.name === "CastError") {
          return sendError("Invalid ID format", HTTP_STATUS.BAD_REQUEST);
        }

        return sendError(
          error.message || "Internal server error",
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      // Handle plain object errors (common in some SDKs like Razorpay)
      const errorObj = error as any;
      const message = errorObj.description || errorObj.message || errorObj.error?.description || "An unexpected error occurred";
      
      return sendError(
        message,
        errorObj.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  };
}

export default asyncHandler;
