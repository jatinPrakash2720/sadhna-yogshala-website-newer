/**
 * Yogshala LMS — Admin Dashboard API
 * GET /api/admin/dashboard — Get dashboard statistics (admin only).
 */

import { asyncHandler } from "@/utils/asyncHandler";
import { sendSuccess } from "@/utils/apiResponse";
import { withAdmin } from "@/middleware/withAdmin";
import { AdminService } from "@/services/admin.service";

export const GET = asyncHandler(
  withAdmin(async () => {
    const stats = await AdminService.getDashboardStats();

    return sendSuccess(
      { stats },
      "Dashboard statistics retrieved successfully"
    );
  })
);
