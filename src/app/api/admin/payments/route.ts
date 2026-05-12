/**
 * Yogshala LMS — Admin Payments API
 * GET /api/admin/payments — List all payments (admin only).
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendPaginated } from "@/utils/apiResponse";
import { withAdmin } from "@/middleware/withAdmin";
import { AdminService } from "@/services/admin.service";
import { validateQuery } from "@/middleware/withValidation";
import { paginationSchema } from "@/validations/common.validation";

export const GET = asyncHandler(
  withAdmin(async (req: NextRequest) => {
    const validation = validateQuery(req, paginationSchema);
    if (validation.error) return validation.error;

    const { page, limit } = validation.data;

    const { payments, pagination } = await AdminService.listPayments(
      page,
      limit
    );

    return sendPaginated(
      payments,
      pagination,
      "Payments retrieved successfully"
    );
  })
);
