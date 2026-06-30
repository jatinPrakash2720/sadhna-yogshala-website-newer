/**
 * Client-side image compression before Cloudinary upload.
 */

const SKIP_TYPES = new Set(["image/gif", "image/webp"]);

export interface ImagePrepOptions {
  maxWidth: number;
  maxHeight?: number;
  quality?: number;
  outputType?: "image/jpeg" | "image/webp";
}

export async function prepareImageForUpload(
  file: File,
  options: ImagePrepOptions
): Promise<File> {
  if (!file.type.startsWith("image/") || SKIP_TYPES.has(file.type)) {
    return file;
  }

  if (typeof window === "undefined" || !("createImageBitmap" in window)) {
    return file;
  }

  const maxHeight = options.maxHeight ?? options.maxWidth;
  const quality = options.quality ?? 0.85;
  const outputType = options.outputType ?? "image/jpeg";

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(
      1,
      options.maxWidth / bitmap.width,
      maxHeight / bitmap.height
    );

    if (scale >= 1 && file.type === outputType && file.size < 900_000) {
      bitmap.close();
      return file;
    }

    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((value) => resolve(value), outputType, quality);
    });

    if (!blob) return file;

    const extension = outputType === "image/webp" ? "webp" : "jpg";
    const baseName = file.name.replace(/\.[^.]+$/, "") || "image";

    return new File([blob], `${baseName}.${extension}`, {
      type: outputType,
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}

export const THUMBNAIL_PREP: ImagePrepOptions = {
  maxWidth: 1600,
  maxHeight: 1200,
  quality: 0.88,
};

export const GALLERY_PREP: ImagePrepOptions = {
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.85,
};
