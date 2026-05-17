"use client";

/**
 * Basic Info Section — title, shortDescription, description,
 * category, tags, level, language
 */

import { useState, KeyboardEvent } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { motion } from "framer-motion";
import { X, Plus, BookOpen, Hash } from "lucide-react";
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
  const { register, setValue, watch, formState: { errors } } = form;
  const tags = watch("tags") ?? [];
  const [tagInput, setTagInput] = useState("");

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || tags.includes(trimmed) || tags.length >= 10) return;
    setValue("tags", [...tags, trimmed], { shouldDirty: true });
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setValue("tags", tags.filter((t) => t !== tag), { shouldDirty: true });
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const titleLen = watch("title")?.length || 0;
  const descLen = watch("description")?.length || 0;
  const shortDescLen = watch("shortDescription")?.length || 0;

  return (
    <div className="space-y-5">
      {/* Course Title */}
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

      {/* Short Description */}
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

      {/* Long Description */}
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

      {/* Category + Level row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* Language */}
      <div>
        <label className="input-label">Language</label>
        <select {...register("language")} className="input-field">
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="input-label flex items-center gap-1.5">
          <Hash className="h-3.5 w-3.5 text-sage-400" />
          Tags
          <span className="text-xs font-normal text-sage-400">(up to 10, press Enter or comma)</span>
        </label>
        <div className={cn(
          "flex flex-wrap gap-2 p-3 rounded-xl border bg-white transition-all duration-200 min-h-[50px]",
          "border-cream-300 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10"
        )}>
          {tags.map((tag) => (
            <motion.span
              key={tag}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-xs font-medium px-2.5 py-1 rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-brand-400 hover:text-brand-700 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={tags.length === 0 ? "yoga, morning, vinyasa..." : "Add tag..."}
            className="flex-1 min-w-[120px] text-sm outline-none placeholder:text-sage-300 text-gray-900 bg-transparent"
          />
          {tagInput && (
            <button
              type="button"
              onClick={() => addTag(tagInput)}
              className="text-brand-600 hover:text-brand-700"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
