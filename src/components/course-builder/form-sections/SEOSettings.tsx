"use client";

/**
 * SEO Settings Section — metaTitle, metaDescription, slug, keywords
 */

import { useState, KeyboardEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { Search, X, Plus, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CourseBuilderFormValues } from "@/hooks/useCourseBuilder";

interface SEOSettingsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<CourseBuilderFormValues, any, any>;
}

export default function SEOSettings({ form }: SEOSettingsProps) {
  const { register, watch, setValue } = form;
  const keywords = watch("keywords") ?? [];
  const [kwInput, setKwInput] = useState("");

  const title = watch("title") || "";
  const metaTitle = watch("metaTitle") || "";
  const metaDesc = watch("metaDescription") || "";
  const slug = watch("seoSlug") || "";

  // Auto-fill metaTitle from course title if empty
  const handleAutoFill = () => {
    if (!metaTitle && title) {
      setValue("metaTitle", title.slice(0, 70), { shouldDirty: true });
    }
    if (!slug && title) {
      setValue("seoSlug", title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), { shouldDirty: true });
    }
  };

  const addKeyword = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed || keywords.includes(trimmed) || keywords.length >= 20) return;
    setValue("keywords", [...keywords, trimmed], { shouldDirty: true });
    setKwInput("");
  };

  const removeKeyword = (kw: string) => {
    setValue("keywords", keywords.filter((k) => k !== kw), { shouldDirty: true });
  };

  const handleKwKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword(kwInput);
    }
    if (e.key === "Backspace" && !kwInput && keywords.length > 0) {
      removeKeyword(keywords[keywords.length - 1]);
    }
  };

  // Score indicators
  const metaTitleLen = metaTitle.length;
  const metaDescLen = metaDesc.length;
  const metaTitleColor = metaTitleLen === 0 ? "text-sage-300" : metaTitleLen <= 60 ? "text-green-500" : "text-amber-500";
  const metaDescColor = metaDescLen === 0 ? "text-sage-300" : metaDescLen <= 155 ? "text-green-500" : "text-amber-500";

  return (
    <div className="space-y-5">
      {/* Quick-fill hint */}
      {!metaTitle && title && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-3 bg-brand-50 border border-brand-100 rounded-xl"
        >
          <Search className="h-4 w-4 text-brand-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-medium text-brand-700">Auto-fill from course title</p>
            <p className="text-[11px] text-brand-500">Meta title and slug can be auto-generated</p>
          </div>
          <button
            type="button"
            onClick={handleAutoFill}
            className="text-xs font-semibold text-brand-600 border border-brand-200 px-2.5 py-1 rounded-lg hover:bg-brand-100 transition-colors flex-shrink-0"
          >
            Auto-fill
          </button>
        </motion.div>
      )}

      {/* Meta Title */}
      <div>
        <label className="input-label flex items-center justify-between">
          <span>Meta Title</span>
          <span className={cn("text-[11px] font-medium", metaTitleColor)}>
            {metaTitleLen}/70
          </span>
        </label>
        <input
          {...register("metaTitle")}
          placeholder="e.g. Morning Vinyasa Flow — Sadhna Yogshala"
          className="input-field"
          maxLength={70}
        />
        <p className="mt-1 text-[11px] text-sage-400">Ideal: 50–60 characters</p>
      </div>

      {/* Meta Description */}
      <div>
        <label className="input-label flex items-center justify-between">
          <span>Meta Description</span>
          <span className={cn("text-[11px] font-medium", metaDescColor)}>
            {metaDescLen}/160
          </span>
        </label>
        <textarea
          {...register("metaDescription")}
          rows={3}
          placeholder="A compelling 1-2 sentence description that appears in search results..."
          className="input-field resize-none"
          maxLength={160}
        />
        <p className="mt-1 text-[11px] text-sage-400">Ideal: 120–155 characters</p>
      </div>

      {/* URL Slug */}
      <div>
        <label className="input-label">URL Slug</label>
        <div className="flex items-center gap-0">
          <span className="px-3 py-2.5 text-xs text-sage-400 bg-cream-50 border border-r-0 border-cream-300 rounded-l-xl">
            /courses/
          </span>
          <input
            {...register("seoSlug")}
            placeholder="morning-vinyasa-flow"
            className="flex-1 rounded-l-none input-field"
          />
        </div>
        <p className="mt-1 text-[11px] text-sage-400">
          Lowercase letters, numbers, and hyphens only. Auto-generated from title if left empty.
        </p>
      </div>

      {/* Keywords */}
      <div>
        <label className="input-label">
          Keywords
          <span className="ml-1 text-xs font-normal text-sage-400">(up to 20)</span>
        </label>
        <div className={cn(
          "flex flex-wrap gap-2 p-3 rounded-xl border bg-white transition-all duration-200 min-h-[50px]",
          "border-cream-300 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10"
        )}>
          {keywords.map((kw) => (
            <motion.span
              key={kw}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-1 bg-sage-50 text-sage-700 text-xs font-medium px-2.5 py-1 rounded-full"
            >
              {kw}
              <button
                type="button"
                onClick={() => removeKeyword(kw)}
                className="text-sage-400 hover:text-sage-700"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.span>
          ))}
          <input
            type="text"
            value={kwInput}
            onChange={(e) => setKwInput(e.target.value)}
            onKeyDown={handleKwKeyDown}
            placeholder={keywords.length === 0 ? "yoga, morning flow, beginner..." : "Add keyword..."}
            className="flex-1 min-w-[120px] text-sm outline-none placeholder:text-sage-300 text-gray-900 bg-transparent"
          />
          {kwInput && (
            <button type="button" onClick={() => addKeyword(kwInput)} className="text-sage-500">
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* SEO Preview */}
      <div className="p-4 bg-white border border-cream-200 rounded-xl">
        <p className="text-[10px] font-bold uppercase tracking-wider text-sage-400 mb-3">Search Result Preview</p>
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-blue-600 truncate">
            {metaTitle || title || "Course Title"}
          </p>
          <p className="text-[11px] text-green-700 truncate">
            https://sadhnayogshala.com/courses/{slug || "course-slug"}
          </p>
          <p className="text-xs text-sage-500 line-clamp-2">
            {metaDesc || "Meta description will appear here. Write a compelling description to improve click-through rate from search results."}
          </p>
        </div>
      </div>
    </div>
  );
}
