"use client";

/**
 * Thumbnail Uploader — drag/drop, preview, upload progress, replace/remove
 */

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ImageIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCourseBuilderStore } from "@/store/courseBuilderStore";
import { useMediaUpload, validateImageFile, formatFileSize } from "@/hooks/useMediaUpload";
import { parseMediaUploadField } from "@/lib/courseMedia";

export default function ThumbnailUploader() {
  const { courseId, thumbnailPreview, setThumbnailPreview } = useCourseBuilderStore();
  const [isDragOver, setIsDragOver] = useState(false);
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isUploading, progress, error, upload, deleteCourseMedia, reset } = useMediaUpload({
    courseId,
    mediaType: "thumbnail",
    onSuccess: (result) => {
      const thumb = parseMediaUploadField(result, "thumbnail");
      if (thumb && !Array.isArray(thumb) && thumb.url) {
        setThumbnailPreview({
          url: thumb.url,
          public_id: thumb.public_id,
          isLocal: false,
        });
        setLocalFile(null);
      }
    },
  });

  const handleFile = useCallback((file: File) => {
    const err = validateImageFile(file);
    if (err) {
      alert(err);
      return;
    }
    setLocalFile(file);
    const localUrl = URL.createObjectURL(file);
    setThumbnailPreview({ url: localUrl, public_id: "", isLocal: true });
  }, [setThumbnailPreview]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleUpload = async () => {
    if (!localFile) return;
    await upload(localFile);
  };

  const handleRemove = async () => {
    if (isRemoving || isUploading) return;

    const preview = thumbnailPreview;
    if (preview && !preview.isLocal && preview.public_id) {
      setIsRemoving(true);
      const ok = await deleteCourseMedia("thumbnail", preview.public_id);
      setIsRemoving(false);
      if (!ok) return;
    }

    setThumbnailPreview(null);
    setLocalFile(null);
    reset();
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          Course Thumbnail <span className="text-red-500">*</span>
        </h3>
        <span className="text-xs text-sage-500">Required — must be uploaded</span>
      </div>
      {/* Drop zone */}
      <AnimatePresence mode="wait">
        {!thumbnailPreview ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 aspect-video",
              isDragOver
                ? "border-brand-500 bg-brand-50 scale-[1.01]"
                : "border-cream-300 bg-cream-50 hover:border-brand-400 hover:bg-brand-50/50"
            )}
          >
            <motion.div
              animate={{ y: isDragOver ? -4 : 0 }}
              className="flex flex-col items-center gap-2 text-center px-6"
            >
              <div className={cn(
                "h-14 w-14 rounded-2xl flex items-center justify-center transition-colors",
                isDragOver ? "bg-brand-100" : "bg-cream-200"
              )}>
                <ImageIcon className={cn("h-7 w-7 transition-colors", isDragOver ? "text-brand-600" : "text-sage-400")} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  {isDragOver ? "Drop image here" : "Drag & drop thumbnail"}
                </p>
                <p className="text-xs text-sage-400 mt-1">
                  or <span className="text-brand-600 font-medium">browse files</span>
                </p>
                <p className="text-[10px] text-sage-300 mt-2">JPG, PNG, WebP, GIF — max 10 MB</p>
              </div>
            </motion.div>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleChange}
              className="hidden"
            />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-2xl overflow-hidden aspect-video bg-gray-100 group"
          >
            <img
              src={thumbnailPreview.url}
              alt="Thumbnail preview"
              className="w-full h-full object-cover"
            />
            {/* Actions — always visible */}
            <div className="absolute top-2 right-2 flex gap-2 z-10">
              <button
                type="button"
                onClick={handleRemove}
                disabled={isRemoving || isUploading}
                className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-600 shadow-sm disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" />
                {isRemoving ? "Removing..." : "Remove"}
              </button>
            </div>
            {/* Local badge */}
            {thumbnailPreview.isLocal && (
              <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                Not uploaded yet
              </div>
            )}
            {/* Uploaded badge */}
            {!thumbnailPreview.isLocal && (
              <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                ✓ Uploaded
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleChange}
              className="hidden"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* File info + upload button */}
      {localFile && thumbnailPreview?.isLocal && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-cream-50 border border-cream-200 rounded-xl px-4 py-3"
        >
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-700 truncate">{localFile.name}</p>
            <p className="text-[10px] text-sage-400">{formatFileSize(localFile.size)}</p>
          </div>
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className={cn(
              "flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg transition-all ml-3 flex-shrink-0",
              isUploading
                ? "bg-cream-200 text-sage-400 cursor-not-allowed"
                : "bg-brand-600 text-white hover:bg-brand-700"
            )}
          >
            <Upload className="h-3.5 w-3.5" />
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </motion.div>
      )}

      {/* Upload progress */}
      {isUploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-1"
        >
          <div className="flex justify-between text-xs text-sage-500">
            <span>Uploading to Cloudinary...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-brand-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </motion.div>
      )}

      <p className="text-[11px] text-sage-400">
        The thumbnail is required. Upload it to Cloudinary before moving to the next step.
      </p>
    </div>
  );
}
