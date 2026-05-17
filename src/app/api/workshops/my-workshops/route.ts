import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendSuccess } from "@/utils/apiResponse";
import { withAuth } from "@/middleware/withAuth";
import { WorkshopService } from "@/services/workshop.service";

export const GET = asyncHandler(
  withAuth(async (_req: NextRequest, { user }) => {
    const enrollments = await WorkshopService.getMyWorkshops(user.id);
    return sendSuccess({ enrollments }, "Enrolled workshops retrieved successfully");
  })
);
