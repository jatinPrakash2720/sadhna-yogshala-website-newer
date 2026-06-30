/**
 * Yogshala LMS — Media upload response parsing & step validation
 */

import type {
  GalleryPreview,
  ThumbnailPreview,
  VideoPreview,
} from "@/store/courseBuilderStore";

interface MediaAsset {
  url: string;
  public_id: string;
  thumbnail?: string;
  duration?: number;
}

interface UploadApiEnvelope {
  success?: boolean;
  data?: {
    thumbnail?: MediaAsset;
    introVideo?: MediaAsset;
    gallery?: MediaAsset[];
    course?: MediaAsset & Record<string, unknown>;
  };
}

export function parseMediaUploadField(
  result: unknown,
  field: "thumbnail" | "introVideo" | "gallery"
): MediaAsset | MediaAsset[] | null {
  const envelope = result as UploadApiEnvelope;
  const payload = envelope?.data;
  if (!payload) return null;

  if (field === "gallery") {
    if (Array.isArray(payload.gallery)) return payload.gallery;
    const course = payload.course as { gallery?: MediaAsset[] } | undefined;
    if (Array.isArray(course?.gallery)) return course.gallery;
    return null;
  }

  const direct = payload[field];
  if (direct?.url) return direct;

  const course = payload.course as Record<string, unknown> | undefined;
  if (!course) return null;

  const nested = (course as { course?: Record<string, unknown> }).course ?? course;
  const value = nested[field] as MediaAsset | undefined;
  return value?.url ? value : null;
}

export interface MediaStepStatus {
  ready: boolean;
  message: string;
}

export function getMediaStepStatus(
  thumbnail: ThumbnailPreview | null,
  video: VideoPreview | null,
  gallery: GalleryPreview[],
  isUploading = false
): MediaStepStatus {
  if (isUploading) {
    return { ready: false, message: "Wait for the upload to finish" };
  }

  if (!thumbnail) {
    return { ready: false, message: "Add a course thumbnail before continuing" };
  }

  if (thumbnail.isLocal) {
    return { ready: false, message: "Upload the thumbnail before continuing" };
  }

  if (video?.isLocal) {
    return {
      ready: false,
      message: "Upload the intro video or remove it before continuing",
    };
  }

  if (gallery.some((item) => item.isLocal)) {
    return {
      ready: false,
      message: "Upload all gallery images or remove pending ones",
    };
  }

  return { ready: true, message: "" };
}
