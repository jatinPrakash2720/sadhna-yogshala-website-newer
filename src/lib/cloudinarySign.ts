/**
 * Server-side Cloudinary signed upload helpers.
 * API secret never leaves the server.
 */

import cloudinary from "@/config/cloudinary";

export type CloudinaryUploadPurpose = "thumbnail" | "gallery" | "introVideo";

const PURPOSE_CONFIG: Record<
  CloudinaryUploadPurpose,
  { folder: string; resourceType: "image" | "video" }
> = {
  thumbnail: {
    folder: "yogshala-lms/courses/thumbnails",
    resourceType: "image",
  },
  gallery: {
    folder: "yogshala-lms/courses/gallery",
    resourceType: "image",
  },
  introVideo: {
    folder: "yogshala-lms/courses/videos",
    resourceType: "video",
  },
};

export interface CloudinarySignPayload {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  resourceType: "image" | "video";
}

export function getCloudinarySign(purpose: CloudinaryUploadPurpose): CloudinarySignPayload {
  const config = PURPOSE_CONFIG[purpose];
  const timestamp = Math.round(Date.now() / 1000);

  const paramsToSign = {
    timestamp,
    folder: config.folder,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    timestamp,
    signature,
    folder: config.folder,
    resourceType: config.resourceType,
  };
}

export { buildVideoThumbnailUrl } from "@/lib/cloudinaryUrls";
