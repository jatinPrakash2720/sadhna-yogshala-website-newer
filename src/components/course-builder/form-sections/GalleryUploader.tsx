"use client";

/**
 * Gallery Uploader — multi-file drag/drop, grid preview, delete items
 */

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, GalleryHorizontal, AlertCircle, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCourseBuilderStore } from "@/store/courseBuilderStore";
import { useMediaUpload, validateImageFile, formatFileSize } from "@/hooks/useMediaUpload";
import { parseMediaUploadField } from "@/lib/courseMedia";

export default function GalleryUploader() {
  const { courseId, galleryPreviews, addGalleryPreview, removeGalleryPreview, setGalleryPreviews } =
    useCourseBuilderStore();
  const [isDragOver, setIsDragOver] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [deletingIdx, setDeletingIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isUploading, progress, error, upload, deleteGalleryItem } = useMediaUpload({
    courseId,
    mediaType: "gallery",
    onSuccess: (result) => {
      const uploaded = parseMediaUploadField(result, "gallery");
      if (!Array.isArray(uploaded) || uploaded.length === 0) return;

      const newCloud = uploaded.map((item) => ({
        url: item.url,
        public_id: item.public_id,
        isLocal: false as const,
      }));

      const { galleryPreviews: current, courseId: activeCourseId } =
        useCourseBuilderStore.getState();
      const existingCloud = current.filter((item) => !item.isLocal);

      // With course attach, API returns the full gallery; without courseId, only new items
      const merged =
        activeCourseId && newCloud.length >= existingCloud.length
          ? newCloud
          : [
              ...existingCloud,
              ...newCloud.filter(
                (item) =>
                  !existingCloud.some((existing) => existing.public_id === item.public_id)
              ),
            ];

      setGalleryPreviews(merged);
      setPendingFiles([]);
    },
  });

  const handleFiles = useCallback((files: File[]) => {
    const valid: File[] = [];
    for (const file of files) {
      const err = validateImageFile(file);
      if (!err) {
        valid.push(file);
        const url = URL.createObjectURL(file);
        addGalleryPreview({ url, isLocal: true });
      }
    }
    if (valid.length > 0) setPendingFiles((prev) => [...prev, ...valid]);
  }, [addGalleryPreview]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
      handleFiles(files);
    },
    [handleFiles]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    handleFiles(files);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUploadAll = async () => {
    if (pendingFiles.length === 0) return;
    await upload(pendingFiles);
  };

  const handleDelete = async (idx: number) => {
    const item = galleryPreviews[idx];
    if (!item || deletingIdx !== null) return;

    if (!item.isLocal) {
      if (!item.public_id) {
        toast.error("Cannot delete this image (missing asset id)");
        return;
      }

      setDeletingIdx(idx);
      const ok = await deleteGalleryItem(item.public_id);
      setDeletingIdx(null);
      if (!ok) return;
    } else {
      const localIndex = galleryPreviews
        .slice(0, idx)
        .filter((preview) => preview.isLocal).length;
      setPendingFiles((prev) => prev.filter((_, i) => i !== localIndex));
    }

    removeGalleryPreview(idx);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Gallery Images</h3>
        <span className="text-xs text-sage-500">Optional</span>
      </div>
      {/* Drop zone */}
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 py-8",
          isDragOver
            ? "border-brand-500 bg-brand-50 scale-[1.01]"
            : "border-cream-300 bg-cream-50 hover:border-brand-400 hover:bg-brand-50/50"
        )}
      >
        <div className={cn(
          "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
          isDragOver ? "bg-brand-100" : "bg-cream-200"
        )}>
          <GalleryHorizontal className={cn("h-6 w-6", isDragOver ? "text-brand-600" : "text-sage-400")} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700">
            {isDragOver ? "Drop images here" : "Add gallery images"}
          </p>
          <p className="text-xs text-sage-400 mt-0.5">
            Drag & drop or <span className="text-brand-600 font-medium">browse</span>
          </p>
          <p className="text-[10px] text-sage-300 mt-1">JPG, PNG, WebP — max 10 MB each</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleChange}
          className="hidden"
        />
      </motion.div>

      {/* Gallery grid */}
      {galleryPreviews.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <AnimatePresence>
            {galleryPreviews.map((img, idx) => (
              <motion.div
                key={`${img.url}-${idx}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-xl overflow-hidden bg-cream-100 group"
              >
                <img
                  src={img.url}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Status badge */}
                {img.isLocal && (
                  <div className="absolute bottom-1 left-1 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Pending
                  </div>
                )}
                {!img.isLocal && (
                  <div className="absolute bottom-1 left-1 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    ✓
                  </div>
                )}
                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    void handleDelete(idx);
                  }}
                  disabled={deletingIdx === idx || isUploading}
                  className="absolute top-1.5 right-1.5 h-7 w-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-sm disabled:opacity-50"
                >
                  {deletingIdx === idx ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload pending files button */}
      {pendingFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-cream-50 border border-cream-200 rounded-xl px-4 py-3"
        >
          <p className="text-xs text-gray-700">
            <span className="font-semibold">{pendingFiles.length}</span> image{pendingFiles.length > 1 ? "s" : ""} pending upload
          </p>
          <button
            type="button"
            onClick={handleUploadAll}
            disabled={isUploading}
            className={cn(
              "flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg transition-all ml-3",
              isUploading
                ? "bg-cream-200 text-sage-400 cursor-not-allowed"
                : "bg-brand-600 text-white hover:bg-brand-700"
            )}
          >
            <Upload className="h-3.5 w-3.5" />
            {isUploading ? "Uploading..." : "Upload All"}
          </button>
        </motion.div>
      )}

      {/* Progress */}
      {isUploading && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-sage-500">
            <span>Uploading gallery...</span>
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
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
