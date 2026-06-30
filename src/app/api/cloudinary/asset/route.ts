/**
 * DELETE /api/cloudinary/asset
 * Remove an uploaded asset from Cloudinary (admin only).
 * Body: { publicId: string, resourceType?: "image" | "video" }
 */

import { NextRequest } from "next/server";
import { z } from "zod";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendBadRequest, sendSuccess } from "@/utils/apiResponse";
import { withAdmin } from "@/middleware/withAdmin";
import { deleteMedia } from "@/utils/media";

const bodySchema = z.object({
  publicId: z.string().min(1),
  resourceType: z.enum(["image", "video"]).default("image"),
});

export const DELETE = asyncHandler(
  withAdmin(async (req: NextRequest) => {
    let body: z.infer<typeof bodySchema>;
    try {
      body = bodySchema.parse(await req.json());
    } catch {
      return sendBadRequest("Invalid body. Requires publicId and optional resourceType.");
    }

    if (!body.publicId.startsWith("yogshala-lms/")) {
      return sendBadRequest("Invalid publicId");
    }

    await deleteMedia(body.publicId, body.resourceType);

    return sendSuccess({ publicId: body.publicId }, "Asset deleted from Cloudinary");
  })
);
