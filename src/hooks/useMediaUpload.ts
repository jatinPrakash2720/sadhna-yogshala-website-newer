/**
 * Yogshala LMS — useMediaUpload Hook
 * Abstracts media upload to /api/courses/:id/media
 * Supports thumbnail, introVideo, gallery uploads with progress tracking.
 */

"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useCourseBuilderStore } from "@/store/courseBuilderStore";

export type MediaType = "thumbnail" | "introVideo" | "gallery";

interface UseMediaUploadOptions {
  courseId: string | null;
  mediaType: MediaType;
  onSuccess?: (data: unknown) => void;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export function useMediaUpload({ courseId, mediaType, onSuccess }: UseMediaUploadOptions) {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const store = useCourseBuilderStore();

  const upload = useCallback(
    async (files: File | File[]) => {
      setState({ isUploading: true, progress: 0, error: null });

      try {
        const formData = new FormData();
        const fileArray = Array.isArray(files) ? files : [files];

        if (mediaType === "gallery") {
          fileArray.forEach((file) => formData.append("gallery", file));
        } else {
          formData.append(mediaType, fileArray[0]);
        }

        // Use general upload API if no courseId yet
        const uploadUrl = courseId 
          ? `/api/courses/${courseId}/media` 
          : `/api/upload`;

        // Use XHR for upload progress tracking
        const result = await new Promise<unknown>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", uploadUrl);

          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const pct = Math.round((e.loaded / e.total) * 100);
              setState((prev) => ({ ...prev, progress: pct }));
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                resolve(JSON.parse(xhr.responseText));
              } catch {
                resolve(null);
              }
            } else {
              try {
                const err = JSON.parse(xhr.responseText);
                reject(new Error(err.message || "Upload failed"));
              } catch {
                reject(new Error(`Upload failed with status ${xhr.status}`));
              }
            }
          });

          xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
          xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

          xhr.send(formData);
        });

        setState({ isUploading: false, progress: 100, error: null });
        onSuccess?.(result);
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setState({ isUploading: false, progress: 0, error: msg });
        toast.error(msg);
        return null;
      }
    },
    [courseId, mediaType, onSuccess]
  );

  const deleteGalleryItem = useCallback(
    async (publicId: string) => {
      if (!courseId) return;
      try {
        const res = await fetch(`/api/courses/${courseId}/media`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "gallery", publicId }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Delete failed");
        toast.success("Image removed");
        return json;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Delete failed";
        toast.error(msg);
        return null;
      }
    },
    [courseId]
  );

  const reset = useCallback(() => {
    setState({ isUploading: false, progress: 0, error: null });
  }, []);

  return { ...state, upload, deleteGalleryItem, reset };
}

// ─── File validation utilities ───────────────────────────

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
export const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm", "video/x-msvideo"];
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500 MB

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return `Invalid file type. Accepted: JPG, PNG, WebP, GIF`;
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return `File too large. Maximum size: 10 MB`;
  }
  return null;
}

export function validateVideoFile(file: File): string | null {
  if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
    return `Invalid file type. Accepted: MP4, MOV, WebM, AVI`;
  }
  if (file.size > MAX_VIDEO_SIZE) {
    return `File too large. Maximum size: 500 MB`;
  }
  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
