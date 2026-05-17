/**
 * Yogshala LMS — useCourseBuilder Hook
 * Wraps React Hook Form + Zod for the course builder.
 * Syncs form state to Zustand store on every change for live preview.
 * Handles create, update, autosave (debounced 3s).
 */

"use client";

import { useEffect, useRef, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCourseBuilderStore } from "@/store/courseBuilderStore";
import type { CourseFormData } from "@/types";

// Frontend form schema (looser than backend — media handled separately)
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  shortDescription: z.string().max(300).optional().default(""),
  description: z.string().min(10, "Description must be at least 10 characters").max(5000),
  category: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  level: z.string().optional().default(""),
  language: z.string().optional().default("English"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  discountPrice: z.coerce.number().min(0).optional(),
  durationInMonths: z.coerce.number().int().min(1).max(24),
  totalClasses: z.coerce.number().int().min(1).max(500),
  batchType: z.string().min(1, "Batch type is required"),
  meetingPlatform: z.string().min(1, "Meeting platform is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  instructorName: z.string().min(2, "Instructor name is required").max(100),
  instructorTitle: z.string().max(150).optional().default(""),
  instructorBio: z.string().max(1000).optional().default(""),
  curriculum: z.array(z.any()).optional().default([]),
  metaTitle: z.string().max(70).optional().default(""),
  metaDescription: z.string().max(160).optional().default(""),
  seoSlug: z.string().max(200).optional().default(""),
  keywords: z.array(z.string()).optional().default([]),
  isPublished: z.boolean().default(false),
});

export type CourseBuilderFormValues = z.infer<typeof formSchema>;

interface UseCourseBuilderOptions {
  mode: "create" | "edit";
  courseId?: string;
  initialData?: Partial<CourseFormData>;
}

export function useCourseBuilder({
  mode,
  courseId,
  initialData,
}: UseCourseBuilderOptions) {
  const router = useRouter();
  
  // ─── Store Subscriptions ──────────────────────────
  const updateCourseData = useCourseBuilderStore((s) => s.updateCourseData);
  const setCourseId = useCourseBuilderStore((s) => s.setCourseId);
  const setIsSaving = useCourseBuilderStore((s) => s.setIsSaving);
  const setLastSaved = useCourseBuilderStore((s) => s.setLastSaved);
  const isSaving = useCourseBuilderStore((s) => s.isSaving);
  const isDirty = useCourseBuilderStore((s) => s.isDirty);
  const storeCourseId = useCourseBuilderStore((s) => s.courseId);
  const curriculum = useCourseBuilderStore((s) => s.courseData.curriculum);
  const thumbnailPreview = useCourseBuilderStore((s) => s.thumbnailPreview);
  const videoPreview = useCourseBuilderStore((s) => s.videoPreview);
  const galleryPreviews = useCourseBuilderStore((s) => s.galleryPreviews);

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const lastSyncedValues = useRef<string>("");

  const form = useForm<CourseBuilderFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: initialData?.title ?? "",
      shortDescription: initialData?.shortDescription ?? "",
      description: initialData?.description ?? "",
      category: initialData?.category ?? "",
      tags: initialData?.tags ?? [],
      level: initialData?.level ?? "",
      language: initialData?.language ?? "English",
      price: initialData?.price ?? 0,
      discountPrice: initialData?.discountPrice,
      durationInMonths: initialData?.durationInMonths ?? 1,
      totalClasses: initialData?.totalClasses ?? 1,
      batchType: initialData?.batchType ?? "morning",
      meetingPlatform: initialData?.meetingPlatform ?? "zoom",
      startDate: initialData?.startDate ?? "",
      endDate: initialData?.endDate ?? "",
      instructorName: initialData?.instructorName ?? "",
      instructorTitle: initialData?.instructorTitle ?? "",
      instructorBio: initialData?.instructorBio ?? "",
      curriculum: initialData?.curriculum ?? [],
      metaTitle: initialData?.metaTitle ?? "",
      metaDescription: initialData?.metaDescription ?? "",
      seoSlug: initialData?.seoSlug ?? "",
      keywords: initialData?.keywords ?? [],
      isPublished: initialData?.isPublished ?? false,
    },
    mode: "onChange",
  });

  const watchedValues = useWatch({ control: form.control });

  // ─── Save logic ───────────────────────────────────
  const doSave = useCallback(
    async (values: CourseBuilderFormValues, isAutosave = false) => {
      setIsSaving(true);
      try {
        const payload = buildPayload(values, {
          curriculum,
          thumbnailPreview,
          videoPreview,
          galleryPreviews,
        });
        
        console.log("[CourseBuilder] Saving payload:", payload);
        
        let savedId = courseId;

        if (mode === "create") {
          const res = await fetch("/api/courses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const json = await res.json();
          if (!res.ok) {
            throw new Error(json.message || "Failed to create course");
          }
          savedId = json.data?.course?._id;
          if (savedId) {
            setCourseId(savedId);
            router.replace(`/admin/courses/edit/${savedId}`);
          }
          if (!isAutosave) toast.success("Course created successfully!");
        } else {
          const res = await fetch(`/api/courses/${courseId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const json = await res.json();
          if (!res.ok) {
            throw new Error(json.message || "Failed to update course");
          }
          if (!isAutosave) toast.success("Course saved successfully!");
        }

        setLastSaved(new Date());
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Save failed";
        if (!isAutosave) toast.error(msg);
        else console.error("[autosave]", msg);
      } finally {
        setIsSaving(false);
      }
    },
    [
      mode, 
      courseId, 
      router, 
      setIsSaving, 
      setCourseId, 
      setLastSaved, 
      curriculum, 
      thumbnailPreview, 
      videoPreview, 
      galleryPreviews
    ]
  );

  const onSubmit = form.handleSubmit(async (values: CourseBuilderFormValues) => {
    await doSave(values, false);
  });

  // ─── Sync to Zustand on every change ─────────────
  useEffect(() => {
    if (!watchedValues) return;
    
    // Exclude curriculum from sync because it's managed by the store directly
    // This prevents form's default empty curriculum from overwriting store data
    const { curriculum: _, ...formValues } = watchedValues as any;
    
    const stringified = JSON.stringify(formValues);
    if (stringified === lastSyncedValues.current) return;
    
    lastSyncedValues.current = stringified;
    updateCourseData(formValues);
  }, [watchedValues, updateCourseData]);

  // ─── Set courseId in store ────────────────────────
  useEffect(() => {
    if (courseId && courseId !== storeCourseId) setCourseId(courseId);
  }, [courseId, storeCourseId, setCourseId]);

  // ─── Initialize media previews from initialData ────
  const setThumbnailPreview = useCourseBuilderStore((s) => s.setThumbnailPreview);
  const setVideoPreview = useCourseBuilderStore((s) => s.setVideoPreview);
  const setGalleryPreviews = useCourseBuilderStore((s) => s.setGalleryPreviews);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      // 1. Initialize core course data in store
      updateCourseData(initialData);

      // 2. Initialize media previews in store
      if (initialData.thumbnail) {
        setThumbnailPreview({ ...initialData.thumbnail, isLocal: false });
      }
      if (initialData.introVideo) {
        setVideoPreview({ ...initialData.introVideo, isLocal: false });
      }
      if (initialData.gallery) {
        setGalleryPreviews(initialData.gallery.map(g => ({ ...g, isLocal: false })));
      }
    }
    // Only run once on mount when in edit mode
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // ─── Autosave (edit mode only, 3s debounce) ───────
  useEffect(() => {
    if (mode !== "edit" || !courseId || isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!isDirty) return;

    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(async () => {
      await doSave(form.getValues(), true);
    }, 3000);

    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [watchedValues, isDirty, mode, courseId, doSave, form]);

  return { form, onSubmit, isSubmitting: isSaving };
}

// ─── Build API payload from form values ──────────────────
function buildPayload(
  values: CourseBuilderFormValues,
  storeData: {
    curriculum?: any[];
    thumbnailPreview?: any;
    videoPreview?: any;
    galleryPreviews?: any[];
  }
) {
  return {
    title: values.title,
    shortDescription: values.shortDescription,
    description: values.description,
    category: values.category,
    tags: values.tags,
    level: values.level,
    language: values.language,
    price: Number(values.price),
    discountPrice: values.discountPrice ? Number(values.discountPrice) : undefined,
    durationInMonths: Number(values.durationInMonths),
    totalClasses: Number(values.totalClasses),
    batchType: values.batchType,
    meetingPlatform: values.meetingPlatform,
    startDate: values.startDate,
    endDate: values.endDate,
    instructorName: values.instructorName,
    instructor: {
      name: values.instructorName,
      title: values.instructorTitle,
      bio: values.instructorBio,
    },
    // Media assets from store (only if uploaded/Cloudinary)
    thumbnail: storeData.thumbnailPreview && !storeData.thumbnailPreview.isLocal
      ? { url: storeData.thumbnailPreview.url, public_id: storeData.thumbnailPreview.public_id }
      : undefined,
    introVideo: storeData.videoPreview && !storeData.videoPreview.isLocal
      ? { 
          url: storeData.videoPreview.url, 
          public_id: storeData.videoPreview.public_id, 
          thumbnail: storeData.videoPreview.thumbnail || "", 
          duration: storeData.videoPreview.duration || 0 
        }
      : undefined,
    gallery: (storeData.galleryPreviews ?? [])
      .filter(p => !p.isLocal)
      .map(p => ({ url: p.url, public_id: p.public_id || "" })),

    curriculum: (storeData.curriculum ?? []).map((section: any) => ({
      sectionTitle: section.sectionTitle,
      lessons: (section.lessons ?? []).map((lesson: any) => ({
        title: lesson.title,
        duration: Number(lesson.duration),
        isPreview: Boolean(lesson.isPreview),
      })),
    })),
    seo: {
      metaTitle: values.metaTitle,
      metaDescription: values.metaDescription,
      slug: values.seoSlug,
      keywords: values.keywords,
    },
    isPublished: values.isPublished,
  };
}
