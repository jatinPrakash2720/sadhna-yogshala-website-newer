"use client";

/**
 * Yogshala LMS — Course Preview Panel
 * Right-side sticky panel showing the full student-facing course page preview.
 * Updates live from Zustand store.
 */

import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Tablet,
  Smartphone,
  Clock,
  BookOpen,
  Users,
  Calendar,
  CheckCircle2,
  Play,
  ChevronDown,
  ChevronRight,
  Video,
  Star,
  Globe,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, formatDate } from "@/lib/utils";
import { useCourseBuilderStore, type PreviewMode } from "@/store/courseBuilderStore";
import { useState } from "react";
import LivePreviewCard from "./LivePreviewCard";

const PREVIEW_WIDTHS: Record<PreviewMode, string> = {
  desktop: "w-full",
  tablet: "w-[768px] max-w-full mx-auto",
  mobile: "w-[375px] max-w-full mx-auto",
};

const BENEFITS = [
  "Live sessions with expert instructor",
  "Flexible batch timing",
  "Recorded session replays",
  "Certificate of completion",
  "Community access",
];

export default function CoursePreviewPanel() {
  const {
    previewMode,
    setPreviewMode,
    courseData,
    thumbnailPreview,
    videoPreview,
    galleryPreviews,
  } = useCourseBuilderStore();

  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

  const title = courseData.title || "Course Title";
  const shortDesc = courseData.shortDescription || "";
  const description = courseData.description || "";
  const price = Number(courseData.price) || 0;
  const discountPrice = courseData.discountPrice ? Number(courseData.discountPrice) : undefined;
  const instructor = courseData.instructorName || "Your Instructor";
  const instructorTitle = courseData.instructorTitle || "Yoga Expert";
  const instructorBio = courseData.instructorBio || "";
  const totalClasses = courseData.totalClasses || 0;
  const durationInMonths = courseData.durationInMonths || 0;
  const batchType = courseData.batchType || "";
  const level = courseData.level || "";
  const language = courseData.language || "English";
  const category = courseData.category || "";
  const curriculum = courseData.curriculum ?? [];
  const startDate = courseData.startDate || "";
  const tags = courseData.tags ?? [];

  const discountPercent = discountPrice && price > discountPrice
    ? Math.round(((price - discountPrice) / price) * 100)
    : null;

  const totalLessons = curriculum.reduce((acc, s) => acc + (s.lessons?.length || 0), 0);

  const toggleCurriculumSection = (idx: number) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Preview mode toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-semibold text-sage-600">Live Preview</span>
        </div>
        <div className="flex items-center bg-white border border-cream-200 rounded-lg p-0.5 shadow-sm">
          {(["desktop", "tablet", "mobile"] as PreviewMode[]).map((mode) => {
            const icons = { desktop: Monitor, tablet: Tablet, mobile: Smartphone };
            const Icon = icons[mode];
            return (
              <button
                key={mode}
                onClick={() => setPreviewMode(mode)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
                  previewMode === mode
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-sage-500 hover:text-gray-700"
                )}
                title={mode.charAt(0).toUpperCase() + mode.slice(1)}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline capitalize">{mode}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview frame */}
      <div className="flex-1 overflow-y-auto bg-cream-50 rounded-xl border border-cream-200 scrollbar-hide">
        <motion.div
          layout
          className={cn("transition-all duration-300", PREVIEW_WIDTHS[previewMode])}
        >
          <div className="bg-white min-h-full">
            {/* Hero section */}
            <div className="bg-gradient-to-br from-[#0d1f0d] to-brand-800 text-white px-5 py-8">
              <div className="space-y-3">
                {/* Category + level */}
                <div className="flex flex-wrap gap-2">
                  {category && (
                    <span className="bg-white/10 text-white/80 text-xs px-2.5 py-1 rounded-full">
                      {category}
                    </span>
                  )}
                  {level && (
                    <span className="bg-brand-500/30 text-brand-200 text-xs px-2.5 py-1 rounded-full capitalize">
                      {level}
                    </span>
                  )}
                  {batchType && (
                    <span className="bg-white/10 text-white/80 text-xs px-2.5 py-1 rounded-full capitalize">
                      {batchType} batch
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-xl font-bold leading-tight font-playfair">
                  {title}
                </h1>

                {/* Short desc */}
                {shortDesc && (
                  <p className="text-white/70 text-sm leading-relaxed">{shortDesc}</p>
                )}

                {/* Stats */}
                <div className="flex flex-wrap gap-4 text-xs text-white/60 pt-1">
                  {totalClasses > 0 && (
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      {totalClasses} classes
                    </span>
                  )}
                  {durationInMonths > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {durationInMonths} months
                    </span>
                  )}
                  {language && (
                    <span className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" />
                      {language}
                    </span>
                  )}
                  {startDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Starts {formatDate(startDate)}
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("h-3.5 w-3.5", i < 4 ? "text-gold-400 fill-gold-400" : "text-white/20 fill-white/20")} />
                    ))}
                  </div>
                  <span className="text-white/60">4.8 (Preview)</span>
                </div>

                {/* Instructor mini */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="h-7 w-7 rounded-full bg-brand-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {instructor[0]?.toUpperCase() || "I"}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{instructor}</p>
                    {instructorTitle && (
                      <p className="text-[10px] text-white/50">{instructorTitle}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail / Intro video */}
            {(thumbnailPreview || videoPreview) && (
              <div className="px-5 -mt-1 pt-4">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 shadow-lg">
                  {videoPreview ? (
                    <video
                      src={videoPreview.url}
                      controls={false}
                      className="w-full h-full object-cover"
                    />
                  ) : thumbnailPreview ? (
                    <img
                      src={thumbnailPreview.url}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center cursor-pointer"
                    >
                      <Play className="h-6 w-6 text-white fill-white ml-1" />
                    </motion.div>
                  </div>
                  {videoPreview && (
                    <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                      <Video className="h-3 w-3" />
                      Intro Video
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pricing CTA */}
            <div className="px-5 py-4 border-b border-cream-100">
              <div className="bg-cream-50 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(discountPrice ?? price)}
                    </span>
                    {discountPrice && price > discountPrice && (
                      <>
                        <span className="text-sm text-sage-400 line-through">{formatPrice(price)}</span>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          {discountPercent}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  {startDate && (
                    <p className="text-xs text-sage-500 mt-0.5">
                      Starts {formatDate(startDate)}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 text-sm font-semibold bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors shadow-brand"
                  >
                    Enroll Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="px-4 py-2 text-sm font-semibold border border-brand-200 text-brand-700 rounded-xl hover:bg-brand-50 transition-colors"
                  >
                    Try Free
                  </motion.button>
                </div>
              </div>
            </div>

            {/* What you'll learn */}
            <div className="px-5 py-5 border-b border-cream-100">
              <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-brand-500" />
                What you&apos;ll get
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {BENEFITS.map((b, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-sage-600">
                    <CheckCircle2 className="h-4 w-4 text-brand-500 flex-shrink-0 mt-0.5" />
                    {b}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor card */}
            {instructor && instructor !== "Instructor Name" && (
              <div className="px-5 py-5 border-b border-cream-100">
                <h2 className="text-sm font-bold text-gray-900 mb-3">Your Instructor</h2>
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-brand-700">
                      {instructor[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{instructor}</p>
                    {instructorTitle && (
                      <p className="text-xs text-brand-600 mb-1">{instructorTitle}</p>
                    )}
                    {instructorBio && (
                      <p className="text-xs text-sage-500 leading-relaxed line-clamp-3">{instructorBio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Curriculum */}
            {curriculum.length > 0 && (
              <div className="px-5 py-5 border-b border-cream-100">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-gray-900">
                    Course Curriculum
                  </h2>
                  {totalLessons > 0 && (
                    <span className="text-xs text-sage-500">{totalLessons} lessons</span>
                  )}
                </div>
                <div className="space-y-2">
                  {curriculum.map((section, idx) => (
                    <div key={idx} className="border border-cream-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleCurriculumSection(idx)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-cream-50 hover:bg-cream-100 transition-colors"
                      >
                        <div className="flex items-center gap-2 text-left">
                          <span className="text-xs font-semibold text-gray-800 truncate">
                            {section.sectionTitle || `Section ${idx + 1}`}
                          </span>
                          {section.lessons?.length > 0 && (
                            <span className="text-[10px] text-sage-400 flex-shrink-0">
                              {section.lessons.length} lessons
                            </span>
                          )}
                        </div>
                        {expandedSections.has(idx) ? (
                          <ChevronDown className="h-4 w-4 text-sage-400 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-sage-400 flex-shrink-0" />
                        )}
                      </button>
                      <AnimatePresence>
                        {expandedSections.has(idx) && section.lessons?.length > 0 && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            {section.lessons.map((lesson, lIdx) => (
                              <div
                                key={lIdx}
                                className="flex items-center justify-between px-4 py-2.5 border-t border-cream-100 text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  {lesson.isPreview ? (
                                    <Play className="h-3 w-3 text-brand-500" />
                                  ) : (
                                    <BookOpen className="h-3 w-3 text-sage-400" />
                                  )}
                                  <span className={cn("truncate", lesson.isPreview ? "text-brand-600" : "text-sage-600")}>
                                    {lesson.title || `Lesson ${lIdx + 1}`}
                                  </span>
                                  {lesson.isPreview && (
                                    <span className="text-[10px] text-brand-500 bg-brand-50 px-1.5 py-0.5 rounded-full">Free Preview</span>
                                  )}
                                </div>
                                {lesson.duration > 0 && (
                                  <span className="text-sage-400 flex-shrink-0 ml-2">
                                    {lesson.duration} min
                                  </span>
                                )}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {galleryPreviews.length > 0 && (
              <div className="px-5 py-5">
                <h2 className="text-sm font-bold text-gray-900 mb-3">Gallery</h2>
                <div className="grid grid-cols-3 gap-2">
                  {galleryPreviews.map((img, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden bg-cream-100">
                      <img
                        src={img.url}
                        alt={`Gallery ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer CTA */}
            <div className="px-5 py-6 bg-brand-900 text-white text-center">
              <p className="text-sm font-semibold mb-3">Ready to start your journey?</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="px-6 py-2.5 bg-white text-brand-700 font-bold text-sm rounded-xl hover:bg-cream-50 transition-colors"
              >
                Enroll Now — {formatPrice(discountPrice ?? price)}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
