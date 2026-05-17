"use client";

/**
 * Instructor Section — name, title, bio, instructor image upload
 */

import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { User, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CourseBuilderFormValues } from "@/hooks/useCourseBuilder";

interface InstructorSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<CourseBuilderFormValues, any, any>;
}

export default function InstructorSection({ form }: InstructorSectionProps) {
  const { register, watch, formState: { errors } } = form;
  const name = watch("instructorName") || "";
  const title = watch("instructorTitle") || "";
  const bio = watch("instructorBio") || "";

  return (
    <div className="space-y-5">
      {/* Live mini preview */}
      {name && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4 p-4 bg-brand-50 border border-brand-100 rounded-2xl"
        >
          <div className="h-14 w-14 rounded-full bg-brand-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {name[0]?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{name}</p>
            {title && <p className="text-sm text-brand-600">{title}</p>}
            {bio && (
              <p className="text-xs text-sage-500 mt-1 line-clamp-2">{bio}</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Instructor Name */}
      <div>
        <label className="input-label flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-sage-400" />
          Instructor Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register("instructorName")}
          placeholder="e.g. Priya Sharma"
          className={cn("input-field", errors.instructorName && "border-red-400")}
        />
        {errors.instructorName && (
          <p className="mt-1 text-xs text-red-500">{errors.instructorName.message}</p>
        )}
      </div>

      {/* Instructor Title */}
      <div>
        <label className="input-label">
          Title / Designation
          <span className="ml-1 text-xs font-normal text-sage-400">(shown below name)</span>
        </label>
        <input
          {...register("instructorTitle")}
          placeholder="e.g. Senior Yoga Instructor, RYT 500"
          className="input-field"
        />
      </div>

      {/* Instructor Bio */}
      <div>
        <label className="input-label">Bio</label>
        <div className="relative">
          <textarea
            {...register("instructorBio")}
            rows={4}
            placeholder="Brief bio about the instructor — their experience, certifications, teaching style..."
            className="input-field resize-none pr-16"
          />
          <span className="absolute right-3 bottom-3 text-xs text-sage-400">
            {bio.length}/1000
          </span>
        </div>
      </div>

      {/* Instructor image upload hint */}
      <div className="flex items-start gap-3 p-3 bg-cream-50 border border-cream-200 rounded-xl">
        <Camera className="h-4 w-4 text-sage-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-gray-700">Instructor photo</p>
          <p className="text-xs text-sage-400 mt-0.5">
            Save the course first, then you can upload an instructor photo via the media endpoint.
          </p>
        </div>
      </div>
    </div>
  );
}
