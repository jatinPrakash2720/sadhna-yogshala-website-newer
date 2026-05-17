import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendBadRequest, sendNotFound, sendSuccess } from "@/utils/apiResponse";
import { withAdmin } from "@/middleware/withAdmin";
import { validateBody } from "@/middleware/withValidation";
import { updateWorkshopSchema } from "@/validations/workshop.validation";
import { WorkshopService } from "@/services/workshop.service";

export const GET = asyncHandler(async (_req: NextRequest, context?: { params: Promise<Record<string, string>> }) => {
  const { id } = await context!.params;
  const workshop = id.match(/^[0-9a-fA-F]{24}$/)
    ? await WorkshopService.getById(id)
    : await WorkshopService.getBySlug(id);

  if (!workshop) return sendNotFound("Workshop not found");
  return sendSuccess({ workshop }, "Workshop retrieved successfully");
});

export const PUT = asyncHandler(
  withAdmin(async (req: NextRequest, { params }) => {
    const { id } = await params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return sendBadRequest("Invalid workshop ID format");

    const validation = await validateBody(req, updateWorkshopSchema);
    if (validation.error) return validation.error;

    const workshop = await WorkshopService.update(id, validation.data);
    if (!workshop) return sendNotFound("Workshop not found");
    return sendSuccess({ workshop }, "Workshop updated successfully");
  })
);

export const DELETE = asyncHandler(
  withAdmin(async (_req: NextRequest, { params }) => {
    const { id } = await params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return sendBadRequest("Invalid workshop ID format");

    const workshop = await WorkshopService.delete(id);
    if (!workshop) return sendNotFound("Workshop not found");
    return sendSuccess(null, "Workshop deleted successfully");
  })
);
