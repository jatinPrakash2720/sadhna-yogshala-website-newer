/**
 * Yogshala LMS — Course Media Upload API
 * POST /api/courses/:id/media — Upload/replace media for a course (admin only).
 *
 * Accepts multipart/form-data with any of:
 *   - thumbnail  (single image file)
 *   - gallery    (one or more image files)
 *   - introVideo (single video file)
 *
 * Security: Admin-only via withAdmin middleware.
 * All uploads go server-side → Cloudinary. Client never touches Cloudinary.
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import {
  sendSuccess,
  sendBadRequest,
  sendNotFound,
} from "@/utils/apiResponse";
import { withAdmin } from "@/middleware/withAdmin";
import { CourseService } from "@/services/course.service";
import { CourseRepository } from "@/repositories/course.repository";
import {
  uploadImage,
  uploadMultipleImages,
  uploadVideo,
  replaceMedia,
  validateImageFile,
  validateVideoFile,
} from "@/utils/media";

export const POST = asyncHandler(
  withAdmin(
    async (
      req: NextRequest,
      context: { params: Promise<Record<string, string>> }
    ) => {
      const { id } = await context.params;

      // Fetch the existing course
      const course = await CourseRepository.findById(id);
      if (!course) {
        return sendNotFound("Course not found");
      }

      // Parse multipart form data
      let formData: FormData;
      try {
        formData = await req.formData();
      } catch {
        return sendBadRequest("Request must be multipart/form-data");
      }

      const updates: Record<string, unknown> = {};
      const errors: string[] = [];

      // ─── Thumbnail ────────────────────────────────────
      const thumbnailFile = formData.get("thumbnail") as File | null;
      if (thumbnailFile) {
        try {
          validateImageFile({
            type: thumbnailFile.type,
            size: thumbnailFile.size,
            name: thumbnailFile.name,
          });

          const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
          const result = await replaceMedia(
            course.thumbnail?.public_id,
            buffer,
            "courses/thumbnails",
            "image",
            `thumb_${id}`
          );
          updates.thumbnail = result;
        } catch (err) {
          errors.push(`Thumbnail: ${(err as Error).message}`);
        }
      }

      // ─── Gallery Images ───────────────────────────────
      const galleryFiles = formData.getAll("gallery") as File[];
      if (galleryFiles.length > 0) {
        try {
          // Validate all gallery files before uploading
          for (const file of galleryFiles) {
            validateImageFile({ type: file.type, size: file.size, name: file.name });
          }

          const buffers = await Promise.all(
            galleryFiles.map(async (f) => ({
              buffer: Buffer.from(await f.arrayBuffer()),
              filename: undefined,
            }))
          );

          const newImages = await uploadMultipleImages(
            buffers,
            "courses/gallery"
          );

          // Append to existing gallery
          const existingGallery = course.gallery ?? [];
          updates.gallery = [...existingGallery, ...newImages];
        } catch (err) {
          errors.push(`Gallery: ${(err as Error).message}`);
        }
      }

      // ─── Intro Video ──────────────────────────────────
      const videoFile = formData.get("introVideo") as File | null;
      if (videoFile) {
        try {
          validateVideoFile({
            type: videoFile.type,
            size: videoFile.size,
            name: videoFile.name,
          });

          const buffer = Buffer.from(await videoFile.arrayBuffer());
          const result = await replaceMedia(
            course.introVideo?.public_id,
            buffer,
            "courses/videos",
            "video",
            `video_${id}`
          );
          updates.introVideo = result;
        } catch (err) {
          errors.push(`Video: ${(err as Error).message}`);
        }
      }

      // Return early if nothing was uploaded
      if (Object.keys(updates).length === 0) {
        if (errors.length > 0) {
          return sendBadRequest(errors.join("; "));
        }
        return sendBadRequest(
          "No media files provided. Send 'thumbnail', 'gallery', or 'introVideo' fields."
        );
      }

      // Persist updates to the course
      const updatedCourse = await CourseService.update(id, updates as Parameters<typeof CourseService.update>[1]);

      return sendSuccess(
        {
          course: updatedCourse,
          uploaded: Object.keys(updates),
          ...(errors.length > 0 && { warnings: errors }),
        },
        "Media uploaded successfully"
      );
    }
  )
);

/**
 * DELETE /api/courses/:id/media — Remove a specific media item from gallery (admin only).
 * Body: { type: "gallery", publicId: "yogshala-lms/courses/gallery/..." }
 */
export const DELETE = asyncHandler(
  withAdmin(
    async (
      req: NextRequest,
      context: { params: Promise<Record<string, string>> }
    ) => {
      const { id } = await context.params;

      const course = await CourseRepository.findById(id);
      if (!course) return sendNotFound("Course not found");

      const body = (await req.json()) as { type?: string; publicId?: string };
      const { type, publicId } = body;

      if (!type || !publicId) {
        return sendBadRequest("'type' and 'publicId' are required");
      }

      if (type !== "gallery") {
        return sendBadRequest(
          "Only 'gallery' items can be individually deleted. Use PUT /api/courses/:id/media to replace thumbnail or video."
        );
      }

      const gallery = course.gallery ?? [];
      const itemExists = gallery.some((g) => g.public_id === publicId);
      if (!itemExists) {
        return sendNotFound("Gallery item not found on this course");
      }

      // Delete from Cloudinary
      const { deleteMedia } = await import("@/utils/media");
      await deleteMedia(publicId, "image");

      // Remove from DB
      const updatedGallery = gallery.filter((g) => g.public_id !== publicId);
      const updatedCourse = await CourseService.update(id, {
        gallery: updatedGallery,
      } as Parameters<typeof CourseService.update>[1]);

      return sendSuccess({ course: updatedCourse }, "Gallery item removed");
    }
  )
);
