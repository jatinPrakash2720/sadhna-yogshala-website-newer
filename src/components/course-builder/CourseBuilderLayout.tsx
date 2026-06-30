"use client";

/**
 * Yogshala LMS — Course Builder Wizard Layout
 * Five-step flow ending in draft save options.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Image as ImageIcon,
  DollarSign,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCourseBuilder, type CourseBuilderFormValues } from "@/hooks/useCourseBuilder";
import { useCourseBuilderStore } from "@/store/courseBuilderStore";
import type { CourseFormData } from "@/types";

import BasicInfoSection from "./form-sections/BasicInfoSection";
import ScheduleSection from "./form-sections/ScheduleSection";
import ThumbnailUploader from "./form-sections/ThumbnailUploader";
import VideoUploader from "./form-sections/VideoUploader";
import GalleryUploader from "./form-sections/GalleryUploader";
import PricingOnlySection from "./form-sections/PricingOnlySection";
import InstructorSection from "./form-sections/InstructorSection";
import DraftSaveStep from "./form-sections/DraftSaveStep";
import { getMediaStepStatus } from "@/lib/courseMedia";

const STEPS = [
  { id: 1, label: "Basic Info", icon: BookOpen },
  { id: 2, label: "Full Schedule", icon: CalendarDays },
  { id: 3, label: "Media", icon: ImageIcon },
  { id: 4, label: "Pricing & Instructor", icon: DollarSign },
  { id: 5, label: "Save Draft", icon: Save },
] as const;

interface CourseBuilderLayoutProps {
  mode: "create" | "edit";
  courseId?: string;
  initialData?: Partial<CourseFormData>;
}

export default function CourseBuilderLayout({
  mode,
  courseId,
  initialData,
}: CourseBuilderLayoutProps) {
  const store = useCourseBuilderStore();
  const [currentStep, setCurrentStep] = useState(1);
  const thumbnailPreview = useCourseBuilderStore((s) => s.thumbnailPreview);
  const videoPreview = useCourseBuilderStore((s) => s.videoPreview);
  const galleryPreviews = useCourseBuilderStore((s) => s.galleryPreviews);
  const isMediaUploading = useCourseBuilderStore((s) => s.isMediaUploading);
  const { form, saveDraft, isSubmitting } = useCourseBuilder({
    mode,
    courseId,
    initialData,
  });

  useEffect(() => {
    return () => store.resetStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mediaStepStatus = getMediaStepStatus(
    thumbnailPreview,
    videoPreview,
    galleryPreviews,
    isMediaUploading
  );
  const canProceedFromMedia = mediaStepStatus.ready;

  const goNext = async () => {
    const fieldsByStep: Record<number, (keyof CourseBuilderFormValues)[]> = {
      1: ["title", "description"],
      2: ["startDate", "endDate", "scheduledSessions"],
      3: [],
      4: ["price", "instructorUserId", "instructorName"],
      5: [],
    };

    if (currentStep === 3 && !canProceedFromMedia) {
      toast.error(mediaStepStatus.message);
      return;
    }

    const valid = await form.trigger(fieldsByStep[currentStep]);
    if (!valid) return;
    setCurrentStep((step) => Math.min(step + 1, STEPS.length));
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <div className="sticky top-0 z-20 border-b border-cream-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/courses"
              className="flex items-center gap-1.5 text-sm font-medium text-sage-500 transition hover:text-brand-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Courses
            </Link>
            <div className="h-4 w-px bg-cream-200" />
            <div>
              <h1 className="text-sm font-bold text-gray-900">
                {mode === "create" ? "Create Course" : "Edit Course"}
              </h1>
              <p className="text-[11px] text-amber-700">Draft only — publish later from Courses</p>
            </div>
          </div>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
            Step {currentStep} of {STEPS.length}
          </span>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-5 gap-2 px-6 pb-4">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isDone = currentStep > step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition",
                  isActive && "border-brand-300 bg-brand-50 text-brand-700",
                  isDone && "border-green-200 bg-green-50 text-green-700",
                  !isActive && !isDone && "border-cream-200 bg-white text-sage-500"
                )}
              >
                {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl flex-1 overflow-y-auto p-6">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-cream-200 bg-white p-6 shadow-card"
          >
            {currentStep === 1 && (
              <>
                <h2 className="mb-4 text-lg font-bold text-gray-900">Basic Information</h2>
                <BasicInfoSection form={form} />
              </>
            )}
            {currentStep === 2 && (
              <>
                <h2 className="mb-4 text-lg font-bold text-gray-900">Full Schedule</h2>
                <ScheduleSection form={form} />
              </>
            )}
            {currentStep === 3 && (
              <>
                <h2 className="mb-1 text-lg font-bold text-gray-900">Thumbnail, Video & Gallery</h2>
                <p className="mb-4 text-sm text-sage-500">
                  Thumbnail is required. Video and gallery are optional, but anything you add must be uploaded.
                </p>
                <div className="space-y-8">
                  <ThumbnailUploader />
                  <VideoUploader />
                  <GalleryUploader />
                </div>
              </>
            )}
            {currentStep === 4 && (
              <>
                <h2 className="mb-4 text-lg font-bold text-gray-900">Pricing & Instructor</h2>
                <div className="space-y-8">
                  <PricingOnlySection form={form} />
                  <InstructorSection form={form} />
                </div>
              </>
            )}
            {currentStep === 5 && (
              <>
                <h2 className="mb-4 text-lg font-bold text-gray-900">Save Draft</h2>
                <DraftSaveStep
                  form={form}
                  onSaveDraft={saveDraft}
                  isSubmitting={isSubmitting}
                  calendarLinksGenerated={initialData?.calendarLinksGenerated}
                />
              </>
            )}

            {currentStep < 5 && (
              <div className="mt-8 flex items-center justify-between border-t border-cream-100 pt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep((step) => Math.max(step - 1, 1))}
                  disabled={currentStep === 1}
                  className="inline-flex items-center gap-2 rounded-lg border border-cream-200 px-4 py-2 text-sm font-medium text-sage-600 disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={currentStep === 3 && !canProceedFromMedia}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition",
                    currentStep === 3 && !canProceedFromMedia
                      ? "cursor-not-allowed bg-sage-300"
                      : "bg-brand-600 hover:bg-brand-700"
                  )}
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
      </div>
    </div>
  );
}
