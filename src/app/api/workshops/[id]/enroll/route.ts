import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendBadRequest, sendSuccess } from "@/utils/apiResponse";
import { withAuth } from "@/middleware/withAuth";
import { WorkshopService } from "@/services/workshop.service";

export const POST = asyncHandler(
  withAuth(async (_req: NextRequest, { params, user }) => {
    const { id } = await params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return sendBadRequest("Invalid workshop ID format");

    try {
      const enrollment = await WorkshopService.enroll(user.id, id);
      return sendSuccess({ enrollment }, "Workshop enrollment confirmed");
    } catch (err) {
      return sendBadRequest(err instanceof Error ? err.message : "Enrollment failed");
    }
  })
);
