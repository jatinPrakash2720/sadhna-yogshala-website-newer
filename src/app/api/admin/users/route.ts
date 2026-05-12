/**
 * Yogshala LMS — Admin Users API
 * GET /api/admin/users — List all users (admin only).
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendPaginated } from "@/utils/apiResponse";
import { withAdmin } from "@/middleware/withAdmin";
import { AdminService } from "@/services/admin.service";
import { z } from "zod";
import { validateQuery } from "@/middleware/withValidation";
import { paginationSchema } from "@/validations/common.validation";

const adminUserQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
});

export const GET = asyncHandler(
  withAdmin(async (req: NextRequest) => {
    const validation = validateQuery(req, adminUserQuerySchema);
    if (validation.error) return validation.error;

    const { page, limit, search } = validation.data;

    const { users, pagination } = await AdminService.listUsers(
      page,
      limit,
      search
    );

    return sendPaginated(users, pagination, "Users retrieved successfully");
  })
);
