/**
 * Direct browser → Cloudinary uploads using server-signed parameters.
 */

import type { MediaType } from "@/hooks/useMediaUpload";
import type { CloudinarySignPayload } from "@/lib/cloudinarySign";
import { buildVideoThumbnailUrl } from "@/lib/cloudinaryUrls";

export interface CloudinaryDirectUploadResult {
  url: string;
  public_id: string;
  thumbnail?: string;
  duration?: number;
}

interface ApiEnvelope<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

async function fetchUploadSignature(purpose: MediaType): Promise<CloudinarySignPayload> {
  const res = await fetch(`/api/cloudinary/sign?purpose=${purpose}`);
  const json = (await res.json()) as ApiEnvelope<CloudinarySignPayload>;

  if (!res.ok || !json.data) {
    throw new Error(json.message || "Could not get upload signature");
  }

  return json.data;
}

export function uploadFileToCloudinary(
  file: File,
  sign: CloudinarySignPayload,
  onProgress?: (percent: number) => void
): Promise<CloudinaryDirectUploadResult> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", sign.apiKey);
    formData.append("timestamp", String(sign.timestamp));
    formData.append("signature", sign.signature);
    formData.append("folder", sign.folder);

    const xhr = new XMLHttpRequest();
    const endpoint = `https://api.cloudinary.com/v1_1/${sign.cloudName}/${sign.resourceType}/upload`;
    xhr.open("POST", endpoint);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        try {
          const err = JSON.parse(xhr.responseText) as { error?: { message?: string } };
          reject(new Error(err.error?.message || `Cloudinary upload failed (${xhr.status})`));
        } catch {
          reject(new Error(`Cloudinary upload failed (${xhr.status})`));
        }
        return;
      }

      try {
        const result = JSON.parse(xhr.responseText) as {
          secure_url: string;
          public_id: string;
          duration?: number;
        };

        const payload: CloudinaryDirectUploadResult = {
          url: result.secure_url,
          public_id: result.public_id,
        };

        if (sign.resourceType === "video") {
          payload.thumbnail = buildVideoThumbnailUrl(sign.cloudName, result.public_id);
          payload.duration = result.duration ?? 0;
        }

        resolve(payload);
      } catch {
        reject(new Error("Invalid response from Cloudinary"));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error during Cloudinary upload")));
    xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

    xhr.send(formData);
  });
}

export async function attachMediaToCourse(
  courseId: string,
  payload: {
    thumbnail?: CloudinaryDirectUploadResult;
    introVideo?: CloudinaryDirectUploadResult;
    gallery?: CloudinaryDirectUploadResult[];
  }
): Promise<unknown> {
  const res = await fetch(`/api/courses/${courseId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to save media to course");
  }

  return json;
}

export async function directUploadMedia(
  files: File[],
  mediaType: MediaType,
  options: {
    courseId: string | null;
    onProgress?: (percent: number) => void;
  }
): Promise<unknown> {
  if (mediaType === "gallery") {
    const uploaded: CloudinaryDirectUploadResult[] = [];

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      const sign = await fetchUploadSignature(mediaType);

      const result = await uploadFileToCloudinary(file, sign, (pct) => {
        const overall = Math.round(((i + pct / 100) / files.length) * 100);
        options.onProgress?.(overall);
      });
      uploaded.push(result);
      options.onProgress?.(Math.round(((i + 1) / files.length) * 100));
    }

    if (options.courseId) {
      return attachMediaToCourse(options.courseId, { gallery: uploaded });
    }

    return {
      success: true,
      data: { gallery: uploaded },
    };
  }

  const sign = await fetchUploadSignature(mediaType);
  const file = files[0];
  const result = await uploadFileToCloudinary(file, sign, options.onProgress);

  if (options.courseId) {
    if (mediaType === "thumbnail") {
      return attachMediaToCourse(options.courseId, { thumbnail: result });
    }
    return attachMediaToCourse(options.courseId, { introVideo: result });
  }

  if (mediaType === "thumbnail") {
    return { success: true, data: { thumbnail: result } };
  }

  return { success: true, data: { introVideo: result } };
}
