/**
 * GET /api/cloudinary/sign?purpose=thumbnail|gallery|introVideo
 * Returns a short-lived signed upload payload for direct browser → Cloudinary uploads.
 * Admin only. API secret never sent to the client.
 */

import { NextRequest } from "next/server";
import { z } from "zod";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendBadRequest, sendSuccess } from "@/utils/apiResponse";
import { withAdmin } from "@/middleware/withAdmin";
import { getCloudinarySign, type CloudinaryUploadPurpose } from "@/lib/cloudinarySign";

const purposeSchema = z.enum(["thumbnail", "gallery", "introVideo"]);

export const GET = asyncHandler(
  withAdmin(async (req: NextRequest) => {
    const purposeParam = req.nextUrl.searchParams.get("purpose");
    const parsed = purposeSchema.safeParse(purposeParam);

    if (!parsed.success) {
      return sendBadRequest(
        "Query param 'purpose' must be thumbnail, gallery, or introVideo"
      );
    }

    const sign = getCloudinarySign(parsed.data as CloudinaryUploadPurpose);
    return sendSuccess(sign, "Upload signature created");
  })
);
