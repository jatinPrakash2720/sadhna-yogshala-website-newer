/**
 * Yogshala LMS — General Media Upload API
 * POST /api/upload — Direct Cloudinary upload (admin only).
 * 
 * This allows uploading media BEFORE the course document is created.
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendSuccess, sendBadRequest } from "@/utils/apiResponse";
import { withAdmin } from "@/middleware/withAdmin";
import {
  uploadImage,
  uploadMultipleImages,
  uploadVideo,
  validateImageFile,
  validateVideoFile,
} from "@/utils/media";

export const POST = asyncHandler(
  withAdmin(async (req: NextRequest) => {
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return sendBadRequest("Request must be multipart/form-data");
    }

    const thumbnailFile = formData.get("thumbnail") as File | null;
    const videoFile = formData.get("introVideo") as File | null;
    const galleryFiles = formData.getAll("gallery") as File[];

    // ─── Handle Thumbnail ────────────────────────────────────
    if (thumbnailFile) {
      validateImageFile({
        type: thumbnailFile.type,
        size: thumbnailFile.size,
        name: thumbnailFile.name,
      });
      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
      const result = await uploadImage(buffer, "courses/thumbnails");
      return sendSuccess({ thumbnail: result }, "Thumbnail uploaded successfully");
    }

    // ─── Handle Video ────────────────────────────────────────
    if (videoFile) {
      validateVideoFile({
        type: videoFile.type,
        size: videoFile.size,
        name: videoFile.name,
      });
      const buffer = Buffer.from(await videoFile.arrayBuffer());
      const result = await uploadVideo(buffer, "courses/videos");
      return sendSuccess({ introVideo: result }, "Video uploaded successfully");
    }

    // ─── Handle Gallery ──────────────────────────────────────
    if (galleryFiles.length > 0) {
      for (const file of galleryFiles) {
        validateImageFile({ type: file.type, size: file.size, name: file.name });
      }
      const buffers = await Promise.all(
        galleryFiles.map(async (f) => ({
          buffer: Buffer.from(await f.arrayBuffer()),
        }))
      );
      const results = await uploadMultipleImages(buffers, "courses/gallery");
      return sendSuccess({ gallery: results }, "Gallery images uploaded successfully");
    }

    return sendBadRequest("No valid files provided (thumbnail, introVideo, or gallery)");
  })
);
