/**
 * Yogshala LMS — Standardized API Response Utility
 * Ensures consistent response format across all endpoints.
 */

import { NextResponse } from "next/server";
import { HTTP_STATUS } from "@/constants";
import type { ApiResponse, PaginatedResponse } from "@/types";

/**
 * Send a successful API response.
 */
export function sendSuccess<T>(
  data?: T,
  message: string = "Success",
  statusCode: number = HTTP_STATUS.OK
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status: statusCode }
  );
}

/**
 * Send a successful response for resource creation.
 */
export function sendCreated<T>(
  data?: T,
  message: string = "Created successfully"
): NextResponse<ApiResponse<T>> {
  return sendSuccess(data, message, HTTP_STATUS.CREATED);
}

/**
 * Send a paginated API response.
 */
export function sendPaginated<T>(
  data: T[],
  pagination: PaginatedResponse<T>["pagination"],
  message: string = "Success"
): NextResponse<PaginatedResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      pagination,
    },
    { status: HTTP_STATUS.OK }
  );
}

/**
 * Send an error API response.
 */
export function sendError(
  message: string = "Something went wrong",
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  errors?: Record<string, string[]> | string[]
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      message,
      errors,
    },
    { status: statusCode }
  );
}

/**
 * Send a 400 Bad Request response.
 */
export function sendBadRequest(
  message: string = "Bad request",
  errors?: Record<string, string[]> | string[]
): NextResponse<ApiResponse> {
  return sendError(message, HTTP_STATUS.BAD_REQUEST, errors);
}

/**
 * Send a 401 Unauthorized response.
 */
export function sendUnauthorized(
  message: string = "Authentication required"
): NextResponse<ApiResponse> {
  return sendError(message, HTTP_STATUS.UNAUTHORIZED);
}

/**
 * Send a 403 Forbidden response.
 */
export function sendForbidden(
  message: string = "Access denied"
): NextResponse<ApiResponse> {
  return sendError(message, HTTP_STATUS.FORBIDDEN);
}

/**
 * Send a 404 Not Found response.
 */
export function sendNotFound(
  message: string = "Resource not found"
): NextResponse<ApiResponse> {
  return sendError(message, HTTP_STATUS.NOT_FOUND);
}

/**
 * Send a 409 Conflict response.
 */
export function sendConflict(
  message: string = "Resource already exists"
): NextResponse<ApiResponse> {
  return sendError(message, HTTP_STATUS.CONFLICT);
}
