/**
 * Yogshala LMS — Course Media Upload API
 * POST /api/courses/:id/media — Upload/replace media for a course (admin only).
 *
 * Accepts either:
 *   - application/json — attach already-uploaded Cloudinary assets (direct upload flow)
 *   - multipart/form-data — legacy server-side upload (thumbnail, gallery, introVideo)
 *
 * Security: Admin-only via withAdmin middleware.
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
  deleteMedia,
  validateImageFile,
  validateVideoFile,
} from "@/utils/media";

interface MediaAssetInput {
  url: string;
  public_id: string;
  thumbnail?: string;
  duration?: number;
}

interface AttachMediaBody {
  thumbnail?: MediaAssetInput;
  introVideo?: MediaAssetInput;
  gallery?: MediaAssetInput[];
}

function assertCloudinaryAsset(asset: MediaAssetInput, label: string): void {
  if (!asset.url || !asset.public_id) {
    throw new Error(`${label}: url and public_id are required`);
  }
  if (!asset.public_id.startsWith("yogshala-lms/")) {
    throw new Error(`${label}: invalid public_id`);
  }
  if (!asset.url.includes("res.cloudinary.com")) {
    throw new Error(`${label}: invalid url`);
  }
}

async function attachUploadedMedia(
  course: NonNullable<Awaited<ReturnType<typeof CourseRepository.findById>>>,
  body: AttachMediaBody
) {
  const updates: Record<string, unknown> = {};
  const errors: string[] = [];

  if (body.thumbnail) {
    try {
      assertCloudinaryAsset(body.thumbnail, "Thumbnail");
      if (
        course.thumbnail?.public_id &&
        course.thumbnail.public_id !== body.thumbnail.public_id
      ) {
        await deleteMedia(course.thumbnail.public_id, "image").catch(() => {
          console.warn(`[MEDIA] Could not delete old thumbnail: ${course.thumbnail?.public_id}`);
        });
      }
      updates.thumbnail = {
        url: body.thumbnail.url,
        public_id: body.thumbnail.public_id,
      };
    } catch (err) {
      errors.push(`Thumbnail: ${(err as Error).message}`);
    }
  }

  if (body.introVideo) {
    try {
      assertCloudinaryAsset(body.introVideo, "Intro video");
      if (
        course.introVideo?.public_id &&
        course.introVideo.public_id !== body.introVideo.public_id
      ) {
        await deleteMedia(course.introVideo.public_id, "video").catch(() => {
          console.warn(`[MEDIA] Could not delete old video: ${course.introVideo?.public_id}`);
        });
      }
      updates.introVideo = {
        url: body.introVideo.url,
        public_id: body.introVideo.public_id,
        thumbnail: body.introVideo.thumbnail,
        duration: body.introVideo.duration,
      };
    } catch (err) {
      errors.push(`Video: ${(err as Error).message}`);
    }
  }

  if (body.gallery?.length) {
    try {
      const newItems = body.gallery.map((item, i) => {
        assertCloudinaryAsset(item, `Gallery item ${i + 1}`);
        return { url: item.url, public_id: item.public_id };
      });
      const existingGallery = course.gallery ?? [];
      updates.gallery = [...existingGallery, ...newItems];
    } catch (err) {
      errors.push(`Gallery: ${(err as Error).message}`);
    }
  }

  return { updates, errors };
}

export const POST = asyncHandler(
  withAdmin(
    async (
      req: NextRequest,
      context: { params: Promise<Record<string, string>> }
    ) => {
      const { id } = await context.params;

      const course = await CourseRepository.findById(id);
      if (!course) {
        return sendNotFound("Course not found");
      }

      const contentType = req.headers.get("content-type") ?? "";

      // ─── JSON attach (direct Cloudinary upload) ───────
      if (contentType.includes("application/json")) {
        let body: AttachMediaBody;
        try {
          body = (await req.json()) as AttachMediaBody;
        } catch {
          return sendBadRequest("Invalid JSON body");
        }

        const { updates, errors } = await attachUploadedMedia(course, body);

        if (Object.keys(updates).length === 0) {
          if (errors.length > 0) {
            return sendBadRequest(errors.join("; "));
          }
          return sendBadRequest(
            "No media provided. Send thumbnail, introVideo, or gallery."
          );
        }

        const saveResult = await CourseService.update(
          id,
          updates as Parameters<typeof CourseService.update>[1]
        );
        const updatedCourseDoc = saveResult?.course ?? null;

        return sendSuccess(
          {
            course: updatedCourseDoc,
            thumbnail: updates.thumbnail ?? updatedCourseDoc?.thumbnail,
            introVideo: updates.introVideo ?? updatedCourseDoc?.introVideo,
            gallery: updates.gallery ?? updatedCourseDoc?.gallery,
            uploaded: Object.keys(updates),
            ...(errors.length > 0 && { warnings: errors }),
          },
          "Media attached successfully"
        );
      }

      // ─── Multipart (legacy server upload) ─────────────
      let formData: FormData;
      try {
        formData = await req.formData();
      } catch {
        return sendBadRequest("Request must be multipart/form-data or application/json");
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
      const saveResult = await CourseService.update(
        id,
        updates as Parameters<typeof CourseService.update>[1]
      );
      const updatedCourseDoc = saveResult?.course ?? null;

      return sendSuccess(
        {
          course: updatedCourseDoc,
          thumbnail: updates.thumbnail ?? updatedCourseDoc?.thumbnail,
          introVideo: updates.introVideo ?? updatedCourseDoc?.introVideo,
          gallery: updates.gallery ?? updatedCourseDoc?.gallery,
          uploaded: Object.keys(updates),
          ...(errors.length > 0 && { warnings: errors }),
        },
        "Media uploaded successfully"
      );
    }
  )
);

/**
 * DELETE /api/courses/:id/media — Remove media from course and Cloudinary (admin only).
 * Body: { type: "thumbnail" | "introVideo" | "gallery", publicId?: string }
 * publicId required for gallery; optional for thumbnail/introVideo (uses course value).
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

      if (!type) {
        return sendBadRequest("'type' is required (thumbnail, introVideo, or gallery)");
      }

      if (type === "thumbnail") {
        const thumbId = publicId ?? course.thumbnail?.public_id;
        if (!thumbId) {
          return sendNotFound("No thumbnail on this course");
        }
        if (publicId && course.thumbnail?.public_id !== publicId) {
          return sendNotFound("Thumbnail not found on this course");
        }
        if (!thumbId.startsWith("yogshala-lms/")) {
          return sendBadRequest("Invalid publicId");
        }

        await deleteMedia(thumbId, "image");

        const updatedCourse = await CourseRepository.updateById(id, {
          $unset: { thumbnail: 1 },
        });

        return sendSuccess({ course: updatedCourse }, "Thumbnail removed");
      }

      if (type === "introVideo") {
        const videoId = publicId ?? course.introVideo?.public_id;
        if (!videoId) {
          return sendNotFound("No intro video on this course");
        }
        if (publicId && course.introVideo?.public_id !== publicId) {
          return sendNotFound("Intro video not found on this course");
        }
        if (!videoId.startsWith("yogshala-lms/")) {
          return sendBadRequest("Invalid publicId");
        }

        await deleteMedia(videoId, "video");

        const updatedCourse = await CourseRepository.updateById(id, {
          $unset: { introVideo: 1 },
        });

        return sendSuccess({ course: updatedCourse }, "Intro video removed");
      }

      if (type === "gallery") {
        if (!publicId) {
          return sendBadRequest("'publicId' is required for gallery items");
        }
        if (!publicId.startsWith("yogshala-lms/")) {
          return sendBadRequest("Invalid publicId");
        }

        const gallery = course.gallery ?? [];
        const itemExists = gallery.some((g) => g.public_id === publicId);
        if (!itemExists) {
          return sendNotFound("Gallery item not found on this course");
        }

        await deleteMedia(publicId, "image");

        const updatedGallery = gallery.filter((g) => g.public_id !== publicId);
        const updatedCourse = await CourseRepository.updateById(id, {
          gallery: updatedGallery,
        });

        return sendSuccess({ course: updatedCourse }, "Gallery item removed");
      }

      return sendBadRequest(
        "type must be thumbnail, introVideo, or gallery"
      );
    }
  )
);
