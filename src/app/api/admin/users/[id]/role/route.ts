/**
 * Yogshala LMS — Admin Role Management API
 * PATCH /api/admin/users/:id/role — Promote or demote a user's role (admin only).
 *
 * Safety rules enforced:
 * 1. Only admins can call this endpoint
 * 2. Valid roles: "student" | "admin"
 * 3. An admin cannot demote themselves if they are the only admin
 * 4. An admin cannot change their own role (use separate endpoint for that)
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import {
  sendSuccess,
  sendBadRequest,
  sendNotFound,
  sendForbidden,
} from "@/utils/apiResponse";
import { withAdmin } from "@/middleware/withAdmin";
import { AdminService } from "@/services/admin.service";
import { UserRole } from "@/constants";
import { z } from "zod";
import type { SessionUser } from "@/types";

const VALID_ROLES = Object.values(UserRole) as string[];

const roleSchema = z.object({
  role: z
    .string()
    .refine((val) => VALID_ROLES.includes(val), {
      message: `Role must be one of: ${VALID_ROLES.join(", ")}`,
    })
    .transform((val) => val as UserRole),
});

export const PATCH = asyncHandler(
  withAdmin(
    async (
      req: NextRequest,
      context: {
        params: Promise<Record<string, string>>;
        user: SessionUser;
      }
    ) => {
      const { id: targetUserId } = await context.params;
      const requestingAdminId = context.user.id;

      // Parse and validate request body
      let body: unknown;
      try {
        body = await req.json();
      } catch {
        return sendBadRequest("Request body must be valid JSON");
      }

      const parsed = roleSchema.safeParse(body);
      if (!parsed.success) {
        return sendBadRequest(
          parsed.error.issues.map((e) => e.message).join("; ")
        );
      }

      const { role: newRole } = parsed.data;

      try {
        const updatedUser = await AdminService.updateUserRole(
          targetUserId,
          newRole,
          requestingAdminId
        );

        if (!updatedUser) {
          return sendNotFound("User not found");
        }

        return sendSuccess(
          { user: updatedUser },
          `User role updated to "${newRole}" successfully`
        );
      } catch (error) {
        if (error instanceof Error) {
          if (
            error.message.includes("Cannot demote") ||
            error.message.includes("Cannot change your own role")
          ) {
            return sendForbidden(error.message);
          }
          return sendBadRequest(error.message);
        }
        throw error;
      }
    }
  )
);
