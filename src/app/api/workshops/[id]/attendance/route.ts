import { NextRequest } from "next/server";
import { z } from "zod";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendBadRequest, sendSuccess } from "@/utils/apiResponse";
import { withAdmin } from "@/middleware/withAdmin";
import { WorkshopRepository } from "@/repositories/workshop.repository";

const attendanceSchema = z.object({
  studentId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  attended: z.boolean(),
});

export const POST = asyncHandler(
  withAdmin(async (req: NextRequest, { params }) => {
    const { id } = await params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return sendBadRequest("Invalid workshop ID format");

    const parsed = attendanceSchema.safeParse(await req.json());
    if (!parsed.success) return sendBadRequest("Invalid attendance payload", parsed.error.flatten().fieldErrors);

    const attendance = await WorkshopRepository.markAttendance(parsed.data.studentId, id, parsed.data.attended);
    return sendSuccess({ attendance }, "Workshop attendance updated");
  })
);
