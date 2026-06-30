/**
 * Yogshala LMS — Cron Secret Middleware
 * Validates Authorization: Bearer <CRON_SECRET> for Vercel Cron routes.
 */

import { NextRequest, NextResponse } from "next/server";
import { sendUnauthorized } from "@/utils/apiResponse";

export function withCronSecret(
  handler: (
    req: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ) => Promise<NextResponse>
) {
  return async (
    req: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ): Promise<NextResponse> => {
    const authHeader = req.headers.get("authorization");
    const expected = `Bearer ${process.env.CRON_SECRET}`;

    if (!process.env.CRON_SECRET || authHeader !== expected) {
      return sendUnauthorized("Invalid or missing cron authorization");
    }

    return handler(req, context);
  };
}
