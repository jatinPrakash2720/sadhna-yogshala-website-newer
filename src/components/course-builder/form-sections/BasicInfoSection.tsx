"use client";

/**
 * Basic Info Section — title, shortDescription, description,
 * category, level, language
 */

import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { CourseBuilderFormValues } from "@/hooks/useCourseBuilder";

const CATEGORIES = [
  "Hatha Yoga", "Vinyasa Flow", "Ashtanga", "Yin Yoga", "Kundalini",
  "Restorative", "Meditation", "Pranayama", "Breathwork", "Yoga Nidra",
  "Power Yoga", "Aerial Yoga", "Other",
];

const LEVELS = [
  { value: "", label: "Select Level" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "all-levels", label: "All Levels" },
];

const LANGUAGES = ["English", "Hindi", "Sanskrit", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati"];

interface BasicInfoSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<CourseBuilderFormValues, any, any>;
}

export default function BasicInfoSection({ form }: BasicInfoSectionProps) {
  const { register, watch, formState: { errors } } = form;

  const titleLen = watch("title")?.length || 0;
  const descLen = watch("description")?.length || 0;
  const shortDescLen = watch("shortDescription")?.length || 0;

  return (
    <div className="space-y-5">
      <div>
        <label className="input-label">
          Course Title <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            {...register("title")}
            placeholder="e.g. Morning Vinyasa Flow for Beginners"
            className={cn("input-field pr-16", errors.title && "border-red-400 focus:border-red-400 focus:ring-red-400/10")}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-sage-400">
            {titleLen}/200
          </span>
        </div>
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="input-label">
          Short Description
          <span className="ml-1 text-xs font-normal text-sage-400">(shown on course card)</span>
        </label>
        <div className="relative">
          <textarea
            {...register("shortDescription")}
            rows={2}
            placeholder="A one-line pitch for the course..."
            className={cn("input-field resize-none pr-16", errors.shortDescription && "border-red-400")}
          />
          <span className="absolute right-3 bottom-3 text-xs text-sage-400">
            {shortDescLen}/300
          </span>
        </div>
        {errors.shortDescription && (
          <p className="mt-1 text-xs text-red-500">{errors.shortDescription.message}</p>
        )}
      </div>

      <div>
        <label className="input-label">
          Full Description <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <textarea
            {...register("description")}
            rows={6}
            placeholder="Describe the course in detail — what students will learn, who it's for, etc."
            className={cn("input-field resize-y min-h-[120px] pr-16", errors.description && "border-red-400")}
          />
          <span className="absolute right-3 bottom-3 text-xs text-sage-400">
            {descLen}/5000
          </span>
        </div>
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="input-label">Category</label>
          <select {...register("category")} className="input-field">
            <option value="">Select Category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="input-label">Level</label>
          <select {...register("level")} className="input-field">
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="input-label">Language</label>
        <select {...register("language")} className="input-field">
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
