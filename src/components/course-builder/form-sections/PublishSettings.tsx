"use client";

/**
 * Publish Settings — draft/published toggle, publish action
 */

import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { Eye, EyeOff, Send, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCourseBuilderStore } from "@/store/courseBuilderStore";
import type { CourseBuilderFormValues } from "@/hooks/useCourseBuilder";

interface PublishSettingsProps {
  form: UseFormReturn<CourseBuilderFormValues>;
  onSubmit: () => void;
  isSubmitting: boolean;
  mode: "create" | "edit";
}

export default function PublishSettings({
  form,
  onSubmit,
  isSubmitting,
  mode,
}: PublishSettingsProps) {
  const { watch, setValue } = form;
  const isPublished = watch("isPublished");
  const { lastSaved, isDirty, isSaving, courseId } = useCourseBuilderStore();

  return (
    <div className="space-y-5">
      {/* Status toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Draft */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setValue("isPublished", false, { shouldDirty: true })}
          className={cn(
            "flex items-start gap-3 p-4 rounded-2xl border-2 transition-all duration-200 text-left",
            !isPublished
              ? "bg-amber-50 border-amber-300 shadow-sm"
              : "bg-white border-cream-200 hover:border-cream-300"
          )}
        >
          <EyeOff className={cn("h-5 w-5 flex-shrink-0 mt-0.5", !isPublished ? "text-amber-500" : "text-sage-400")} />
          <div>
            <p className={cn("text-sm font-semibold", !isPublished ? "text-amber-700" : "text-sage-600")}>
              Draft
            </p>
            <p className="text-xs text-sage-400 mt-0.5">Only visible to admins</p>
          </div>
          {!isPublished && (
            <CheckCircle2 className="h-4 w-4 text-amber-500 ml-auto flex-shrink-0 mt-0.5" />
          )}
        </motion.button>

        {/* Published */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setValue("isPublished", true, { shouldDirty: true })}
          className={cn(
            "flex items-start gap-3 p-4 rounded-2xl border-2 transition-all duration-200 text-left",
            isPublished
              ? "bg-green-50 border-green-300 shadow-sm"
              : "bg-white border-cream-200 hover:border-cream-300"
          )}
        >
          <Eye className={cn("h-5 w-5 flex-shrink-0 mt-0.5", isPublished ? "text-green-500" : "text-sage-400")} />
          <div>
            <p className={cn("text-sm font-semibold", isPublished ? "text-green-700" : "text-sage-600")}>
              Published
            </p>
            <p className="text-xs text-sage-400 mt-0.5">Visible to all students</p>
          </div>
          {isPublished && (
            <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto flex-shrink-0 mt-0.5" />
          )}
        </motion.button>
      </div>

      {/* Autosave status */}
      {mode === "edit" && courseId && (
        <div className={cn(
          "flex items-center gap-2 text-xs px-3 py-2 rounded-lg",
          isSaving
            ? "bg-blue-50 text-blue-600"
            : lastSaved
            ? "bg-green-50 text-green-600"
            : "bg-cream-50 text-sage-500"
        )}>
          {isSaving ? (
            <>
              <Clock className="h-3.5 w-3.5 animate-spin" />
              Autosaving...
            </>
          ) : lastSaved ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Last saved {lastSaved.toLocaleTimeString()}
            </>
          ) : isDirty ? (
            <>
              <AlertCircle className="h-3.5 w-3.5" />
              Unsaved changes
            </>
          ) : (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              All changes saved
            </>
          )}
        </div>
      )}

      {/* Checklist */}
      <div className="p-4 bg-cream-50 border border-cream-200 rounded-2xl space-y-2.5">
        <p className="text-xs font-semibold text-gray-700 mb-3">Pre-publish checklist</p>
        {[
          { label: "Course title added", done: (watch("title")?.length ?? 0) >= 3 },
          { label: "Description filled", done: (watch("description")?.length ?? 0) >= 10 },
          { label: "Instructor name set", done: (watch("instructorName")?.length ?? 0) >= 2 },
          { label: "Price configured", done: Number(watch("price")) > 0 },
          { label: "Start date selected", done: !!watch("startDate") },
          { label: "Thumbnail uploaded", done: false },
        ].map(({ label, done }) => (
          <div key={label} className="flex items-center gap-2 text-xs">
            <div className={cn(
              "h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0",
              done ? "bg-green-100" : "bg-cream-200"
            )}>
              {done ? (
                <CheckCircle2 className="h-3 w-3 text-green-600" />
              ) : (
                <div className="h-1.5 w-1.5 rounded-full bg-sage-300" />
              )}
            </div>
            <span className={done ? "text-gray-700" : "text-sage-400"}>{label}</span>
          </div>
        ))}
      </div>

      {/* Save button */}
      <motion.button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 shadow-brand",
          isSubmitting
            ? "bg-brand-400 text-white cursor-not-allowed"
            : "bg-brand-600 text-white hover:bg-brand-700"
        )}
      >
        {isSubmitting ? (
          <>
            <Clock className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            {mode === "create" ? "Create Course" : isPublished ? "Save & Publish" : "Save Draft"}
          </>
        )}
      </motion.button>

      {mode === "create" && (
        <p className="text-[11px] text-sage-400 text-center">
          After creating, you can upload the thumbnail and intro video.
        </p>
      )}
    </div>
  );
}
