"use client";

/**
 * Yogshala LMS — Course Builder Layout
 * Split-screen layout: form left, live preview right.
 * Like Shopify Customizer / Webflow editor.
 */

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { useCourseBuilder } from "@/hooks/useCourseBuilder";
import { useCourseBuilderStore } from "@/store/courseBuilderStore";
import type { CourseFormData } from "@/types";

import SectionNav from "./SectionNav";
import CoursePreviewPanel from "./CoursePreviewPanel";

import BasicInfoSection from "./form-sections/BasicInfoSection";
import ThumbnailUploader from "./form-sections/ThumbnailUploader";
import VideoUploader from "./form-sections/VideoUploader";
import GalleryUploader from "./form-sections/GalleryUploader";
import PricingSection from "./form-sections/PricingSection";
import InstructorSection from "./form-sections/InstructorSection";
import CurriculumBuilder from "./form-sections/CurriculumBuilder";
import SEOSettings from "./form-sections/SEOSettings";
import PublishSettings from "./form-sections/PublishSettings";

interface CourseBuilderLayoutProps {
  mode: "create" | "edit";
  courseId?: string;
  initialData?: Partial<CourseFormData>;
}

// ─── Section Wrapper ─────────────────────────────────────
function SectionCard({
  id,
  title,
  subtitle,
  children,
  onVisible,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onVisible?: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!onVisible) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onVisible(id); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [id, onVisible]);

  return (
    <div
      id={`section-${id}`}
      ref={ref}
      className="bg-white rounded-2xl border border-cream-200 shadow-card overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-cream-100 bg-cream-50/50">
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-sage-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Main Layout ─────────────────────────────────────────
export default function CourseBuilderLayout({
  mode,
  courseId,
  initialData,
}: CourseBuilderLayoutProps) {
  const router = useRouter();
  const store = useCourseBuilderStore();
  const { form, onSubmit, isSubmitting } = useCourseBuilder({ mode, courseId, initialData });

  // Reset store on unmount
  useEffect(() => {
    return () => store.resetStore();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Warn on unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (store.isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [store.isDirty]);

  const handleSectionVisible = (id: string) => {
    store.setActiveSection(id as any);
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-cream-50">
      {/* ─── Top Bar ───────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-cream-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3 max-w-[1800px] mx-auto">
          {/* Left: Back + title */}
          <div className="flex items-center gap-4">
            <Link
              href="/admin/courses"
              className="flex items-center gap-1.5 text-sage-500 hover:text-brand-600 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Courses</span>
            </Link>
            <div className="h-4 w-px bg-cream-200" />
            <div>
              <h1 className="text-sm font-bold text-gray-900">
                {mode === "create" ? "Create New Course" : "Edit Course"}
              </h1>
              {store.courseData.title && (
                <p className="text-[11px] text-sage-400 truncate max-w-[200px]">
                  {store.courseData.title}
                </p>
              )}
            </div>
          </div>

          {/* Right: Save status + Save button */}
          <div className="flex items-center gap-3">
            {/* Autosave status */}
            {mode === "edit" && store.courseId && (
              <div className={cn(
                "hidden sm:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg",
                store.isSaving ? "text-blue-600 bg-blue-50"
                : store.lastSaved ? "text-green-600 bg-green-50"
                : store.isDirty ? "text-amber-600 bg-amber-50"
                : "text-sage-500 bg-cream-50"
              )}>
                {store.isSaving ? (
                  <><Clock className="h-3.5 w-3.5 animate-spin" /> Saving...</>
                ) : store.lastSaved ? (
                  <><CheckCircle2 className="h-3.5 w-3.5" /> Saved</>
                ) : store.isDirty ? (
                  <><AlertCircle className="h-3.5 w-3.5" /> Unsaved</>
                ) : null}
              </div>
            )}

            {/* Published badge */}
            {form.watch("isPublished") ? (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Published
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                Draft
              </span>
            )}

            {/* Save button */}
            <motion.button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
              className={cn(
                "flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-brand",
                isSubmitting
                  ? "bg-brand-400 text-white cursor-not-allowed"
                  : "bg-brand-600 text-white hover:bg-brand-700"
              )}
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving..." : mode === "create" ? "Create" : "Save"}
            </motion.button>
          </div>
        </div>
      </div>

      {/* ─── Main Content ──────────────────────────── */}
      <div className="flex-1 flex overflow-hidden max-w-[1800px] mx-auto w-full">
        {/* Left: Form */}
        <div className="flex-1 flex gap-6 p-6 overflow-y-auto min-w-0">
          {/* Section nav (xl+) */}
          <SectionNav />

          {/* Form sections */}
          <div className="flex-1 space-y-6 min-w-0 max-w-2xl">
            <form onSubmit={onSubmit} className="space-y-6">
              <SectionCard
                id="basic"
                title="Basic Information"
                subtitle="Core details that define your course"
                onVisible={handleSectionVisible}
              >
                <BasicInfoSection form={form} />
              </SectionCard>

              <SectionCard
                id="thumbnail"
                title="Course Thumbnail"
                subtitle="The cover image students see first"
                onVisible={handleSectionVisible}
              >
                <ThumbnailUploader />
              </SectionCard>

              <SectionCard
                id="video"
                title="Intro Video"
                subtitle="A preview video to attract enrollments"
                onVisible={handleSectionVisible}
              >
                <VideoUploader />
              </SectionCard>

              <SectionCard
                id="gallery"
                title="Gallery"
                subtitle="Additional images showcasing the course"
                onVisible={handleSectionVisible}
              >
                <GalleryUploader />
              </SectionCard>

              <SectionCard
                id="pricing"
                title="Pricing & Batch"
                subtitle="Set pricing, duration, and schedule"
                onVisible={handleSectionVisible}
              >
                <PricingSection form={form} />
              </SectionCard>

              <SectionCard
                id="instructor"
                title="Instructor"
                subtitle="Who will be teaching this course?"
                onVisible={handleSectionVisible}
              >
                <InstructorSection form={form} />
              </SectionCard>

              <SectionCard
                id="curriculum"
                title="Curriculum"
                subtitle="Build your course outline with sections and lessons"
                onVisible={handleSectionVisible}
              >
                <CurriculumBuilder />
              </SectionCard>

              <SectionCard
                id="seo"
                title="SEO Settings"
                subtitle="Optimize for search engine visibility"
                onVisible={handleSectionVisible}
              >
                <SEOSettings form={form} />
              </SectionCard>

              <SectionCard
                id="publish"
                title="Publish Settings"
                subtitle="Control visibility and publishing"
                onVisible={handleSectionVisible}
              >
                <PublishSettings
                  form={form}
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                  mode={mode}
                />
              </SectionCard>
            </form>
          </div>
        </div>

        {/* Right: Preview panel (sticky) */}
        <div className="hidden lg:flex flex-col w-[420px] xl:w-[480px] flex-shrink-0 p-6 border-l border-cream-200 bg-white overflow-y-auto">
          <CoursePreviewPanel />
        </div>
      </div>
    </div>
  );
}
