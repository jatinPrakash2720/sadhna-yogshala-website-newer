/**
 * Yogshala LMS — Media Utilities
 * Production-ready Cloudinary upload, delete, and replace utilities.
 * All operations are server-side only and admin-gated at the API layer.
 */

import cloudinary from "@/config/cloudinary";
import type { UploadApiResponse } from "cloudinary";

// ─── Constants ───────────────────────────────────────────
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200 MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
];
const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
];

// ─── Validation Helpers ──────────────────────────────────

export function validateImageFile(file: {
  type: string;
  size: number;
  name: string;
}): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, AVIF`
    );
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(
      `Image too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum: 5MB`
    );
  }
}

export function validateVideoFile(file: {
  type: string;
  size: number;
  name: string;
}): void {
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    throw new Error(
      `Invalid file type: ${file.type}. Allowed: MP4, MOV, WebM, AVI`
    );
  }
  if (file.size > MAX_VIDEO_SIZE) {
    throw new Error(
      `Video too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum: 200MB`
    );
  }
}

// ─── Core Upload: Buffer → Cloudinary ───────────────────

function uploadStream(
  buffer: Buffer,
  options: Record<string, unknown>
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(new Error(error.message));
        if (!result) return reject(new Error("Upload returned no result"));
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

// ─── Upload Single Image ─────────────────────────────────

export async function uploadImage(
  buffer: Buffer,
  folder: string,
  filename?: string
): Promise<{ url: string; public_id: string }> {
  const result = await uploadStream(buffer, {
    folder: `yogshala-lms/${folder}`,
    public_id: filename,
    resource_type: "image",
    // Auto-optimize quality and format (WebP/AVIF on supported browsers)
    transformation: [
      { quality: "auto:best" },
      { fetch_format: "auto" },
    ],
    // Eager transformations: pre-generate common responsive sizes
    eager: [
      { width: 400, crop: "scale", quality: "auto", fetch_format: "auto" },
      { width: 800, crop: "scale", quality: "auto", fetch_format: "auto" },
    ],
    eager_async: true,
    overwrite: true,
    invalidate: true,
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
}

// ─── Upload Multiple Images (Parallel) ──────────────────

export async function uploadMultipleImages(
  files: { buffer: Buffer; filename?: string }[],
  folder: string
): Promise<{ url: string; public_id: string }[]> {
  const uploads = files.map(({ buffer, filename }) =>
    uploadImage(buffer, folder, filename)
  );
  return Promise.all(uploads);
}

// ─── Upload Video with Auto Thumbnail ───────────────────

export async function uploadVideo(
  buffer: Buffer,
  folder: string,
  filename?: string
): Promise<{ url: string; public_id: string; thumbnail: string; duration: number }> {
  const result = await uploadStream(buffer, {
    folder: `yogshala-lms/${folder}`,
    public_id: filename,
    resource_type: "video",
    // Extract thumbnail at 10% into the video
    eager: [
      {
        width: 800,
        height: 450,
        crop: "fill",
        format: "jpg",
        quality: "auto",
        start_offset: "10p", // 10% into video
      },
    ],
    eager_async: false, // Wait for thumbnail generation
    overwrite: true,
    invalidate: true,
  });

  // Build the auto-generated thumbnail URL
  const thumbnailUrl = cloudinary.url(result.public_id, {
    resource_type: "video",
    format: "jpg",
    transformation: [
      { width: 800, height: 450, crop: "fill" },
      { quality: "auto" },
      { start_offset: "10p" },
    ],
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
    thumbnail: thumbnailUrl,
    duration: result.duration ?? 0,
  };
}

// ─── Delete Single Media Asset ───────────────────────────

export async function deleteMedia(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<void> {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true, // Clear CDN cache
  });
}

// ─── Delete Multiple Assets ──────────────────────────────

export async function deleteMultipleMedia(
  publicIds: string[],
  resourceType: "image" | "video" | "raw" = "image"
): Promise<void> {
  const deletions = publicIds
    .filter(Boolean)
    .map((id) => deleteMedia(id, resourceType));
  await Promise.allSettled(deletions); // Don't fail if one deletion fails
}

// ─── Replace Existing Media ──────────────────────────────

export async function replaceMedia(
  oldPublicId: string | undefined,
  newBuffer: Buffer,
  folder: string,
  type: "image" | "video" = "image",
  filename?: string
): Promise<{ url: string; public_id: string; thumbnail?: string; duration?: number }> {
  // Delete old asset first (non-blocking on failure)
  if (oldPublicId) {
    await deleteMedia(oldPublicId, type).catch(() => {
      console.warn(`[MEDIA] Could not delete old asset: ${oldPublicId}`);
    });
  }

  if (type === "video") {
    return uploadVideo(newBuffer, folder, filename);
  }
  return uploadImage(newBuffer, folder, filename);
}
