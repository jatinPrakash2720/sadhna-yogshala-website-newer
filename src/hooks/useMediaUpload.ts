/**
 * Yogshala LMS — useMediaUpload Hook
 * Direct signed upload to Cloudinary + optional course attach.
 */

"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useCourseBuilderStore } from "@/store/courseBuilderStore";
import {
  prepareImageForUpload,
  THUMBNAIL_PREP,
  GALLERY_PREP,
} from "@/lib/clientImagePrep";
import { directUploadMedia } from "@/lib/cloudinaryClientUpload";

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

async function prepareFilesForUpload(
  files: File[],
  mediaType: MediaType
): Promise<File[]> {
  if (mediaType === "introVideo") {
    return files;
  }

  const prep = mediaType === "thumbnail" ? THUMBNAIL_PREP : GALLERY_PREP;
  return Promise.all(files.map((file) => prepareImageForUpload(file, prep)));
}

export function useMediaUpload({ courseId, mediaType, onSuccess }: UseMediaUploadOptions) {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const setIsMediaUploading = useCourseBuilderStore((s) => s.setIsMediaUploading);

  const upload = useCallback(
    async (files: File | File[]) => {
      setState({ isUploading: true, progress: 0, error: null });
      setIsMediaUploading(true);

      try {
        const fileArray = Array.isArray(files) ? files : [files];
        const prepared = await prepareFilesForUpload(fileArray, mediaType);

        const result = await directUploadMedia(prepared, mediaType, {
          courseId,
          onProgress: (percent) => {
            setState((prev) => ({ ...prev, progress: percent }));
          },
        });

        setState({ isUploading: false, progress: 100, error: null });
        setIsMediaUploading(false);
        onSuccess?.(result);
        toast.success("Upload complete");
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setState({ isUploading: false, progress: 0, error: msg });
        setIsMediaUploading(false);
        toast.error(msg);
        return null;
      }
    },
    [courseId, mediaType, onSuccess, setIsMediaUploading]
  );

  const deleteGalleryItem = useCallback(
    async (publicId: string): Promise<boolean> => {
      const activeCourseId = useCourseBuilderStore.getState().courseId;

      try {
        if (activeCourseId) {
          const res = await fetch(`/api/courses/${activeCourseId}/media`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "gallery", publicId }),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json.message || "Delete failed");
        } else {
          const res = await fetch("/api/cloudinary/asset", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicId, resourceType: "image" }),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json.message || "Delete failed");
        }

        toast.success("Image removed");
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Delete failed";
        toast.error(msg);
        return false;
      }
    },
    []
  );

  const deleteCourseMedia = useCallback(
    async (
      type: "thumbnail" | "introVideo",
      publicId?: string
    ): Promise<boolean> => {
      const resourceType = type === "introVideo" ? "video" : "image";

      try {
        if (courseId) {
          const res = await fetch(`/api/courses/${courseId}/media`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, ...(publicId && { publicId }) }),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json.message || "Delete failed");
        } else if (publicId) {
          const res = await fetch("/api/cloudinary/asset", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicId, resourceType }),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json.message || "Delete failed");
        }

        toast.success("Removed");
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Delete failed";
        toast.error(msg);
        return false;
      }
    },
    [courseId]
  );

  const reset = useCallback(() => {
    setState({ isUploading: false, progress: 0, error: null });
  }, []);

  return { ...state, upload, deleteGalleryItem, deleteCourseMedia, reset };
}

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
export const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm", "video/x-msvideo"];
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const MAX_VIDEO_SIZE = 500 * 1024 * 1024;

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
