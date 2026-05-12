/**
 * Yogshala LMS — Health Check API
 * GET /api/health — Check API and database status.
 */

import { NextResponse } from "next/server";
import { getConnectionStatus } from "@/config/database";

export async function GET() {
  const dbStatus = getConnectionStatus();

  return NextResponse.json(
    {
      success: true,
      message: "Yogshala LMS API is running",
      data: {
        status: "healthy",
        timestamp: new Date().toISOString(),
        database: dbStatus,
        environment: process.env.NODE_ENV || "development",
        version: "1.0.0",
      },
    },
    { status: 200 }
  );
}
