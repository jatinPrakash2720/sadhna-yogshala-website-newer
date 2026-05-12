/**
 * Yogshala LMS — Validation Middleware
 * Generic Zod 4 validation wrapper for request bodies and query params.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendBadRequest } from "@/utils/apiResponse";
import { formatZodErrors } from "@/helpers/errorFormatter";

/**
 * Validate request body against a Zod schema.
 * Returns parsed data if valid, or sends a 400 error response.
 */
export async function validateBody<T extends z.ZodType>(
  req: NextRequest,
  schema: T
): Promise<{ data: z.infer<T>; error?: never } | { data?: never; error: NextResponse }> {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const errors = formatZodErrors(result.error);
      return {
        error: sendBadRequest("Validation failed", errors),
      };
    }

    return { data: result.data };
  } catch {
    return {
      error: sendBadRequest("Invalid JSON body"),
    };
  }
}

/**
 * Validate URL search params against a Zod schema.
 * Returns parsed data if valid, or sends a 400 error response.
 */
export function validateQuery<T extends z.ZodType>(
  req: NextRequest,
  schema: T
): { data: z.infer<T>; error?: never } | { data?: never; error: NextResponse } {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const result = schema.safeParse(params);

  if (!result.success) {
    const errors = formatZodErrors(result.error);
    return {
      error: sendBadRequest("Invalid query parameters", errors),
    };
  }

  return { data: result.data };
}

export default { validateBody, validateQuery };
