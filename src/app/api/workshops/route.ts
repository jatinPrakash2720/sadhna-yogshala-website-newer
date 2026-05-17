import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendCreated, sendPaginated } from "@/utils/apiResponse";
import { withAdmin } from "@/middleware/withAdmin";
import { validateBody, validateQuery } from "@/middleware/withValidation";
import { createWorkshopSchema, workshopQuerySchema } from "@/validations/workshop.validation";
import { WorkshopService } from "@/services/workshop.service";

export const GET = asyncHandler(async (req: NextRequest) => {
  const validation = validateQuery(req, workshopQuerySchema);
  if (validation.error) return validation.error;

  const queryData = {
    ...validation.data,
    isPublished: validation.data.all ? undefined : validation.data.isPublished ?? true,
  };

  const { workshops, pagination } = await WorkshopService.list(queryData);
  return sendPaginated(workshops, pagination, "Workshops retrieved successfully");
});

export const POST = asyncHandler(
  withAdmin(async (req: NextRequest) => {
    const validation = await validateBody(req, createWorkshopSchema);
    if (validation.error) return validation.error;

    const workshop = await WorkshopService.create(validation.data);
    return sendCreated({ workshop }, "Workshop created successfully");
  })
);
