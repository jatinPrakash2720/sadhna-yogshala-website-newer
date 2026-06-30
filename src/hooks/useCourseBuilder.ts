/**
 * Yogshala LMS — useCourseBuilder Hook
 * Five-step wizard with explicit draft save actions.
 */

"use client";

import { useEffect, useRef, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCourseBuilderStore } from "@/store/courseBuilderStore";
import type { CourseFormData, IScheduledSession } from "@/types";
import {
  computeDurationInMonths,
  inferBatchType,
  sortScheduledSessions,
} from "@/lib/courseSchedule";

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

const scheduledSessionFormSchema = z.object({
  scheduledDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  slotKey: z.string().optional(),
});

const formSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters").max(200),
    shortDescription: z.string().max(300).optional().default(""),
    description: z.string().min(10, "Description must be at least 10 characters").max(5000),
    category: z.string().optional().default(""),
    level: z.string().optional().default(""),
    language: z.string().optional().default("English"),
    price: z.coerce.number().min(0, "Price cannot be negative"),
    discountPrice: z.coerce.number().min(0).optional(),
    durationInMonths: z.coerce.number().int().min(1).max(24),
    totalClasses: z.coerce.number().int().min(0).max(500),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    scheduledSessions: z
      .array(scheduledSessionFormSchema)
      .min(1, "Select at least one class on the calendar"),
    instructorUserId: z.string().min(1, "Select an instructor"),
    instructorName: z.string().min(2, "Instructor name is required").max(100),
    instructorTitle: z.string().max(150).optional().default(""),
    instructorBio: z.string().max(1000).optional().default(""),
    metaTitle: z.string().max(70).optional().default(""),
    metaDescription: z.string().max(160).optional().default(""),
    seoSlug: z.string().max(200).optional().default(""),
    keywords: z.array(z.string()).optional().default([]),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (end < start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date must be on or after start date",
          path: ["endDate"],
        });
      }
    }

    data.scheduledSessions.forEach((session, index) => {
      if (!session.startTime || !session.endTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Set start and end time for each class",
          path: ["scheduledSessions", index, "startTime"],
        });
        return;
      }
      if (!timePattern.test(session.startTime) || !timePattern.test(session.endTime)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid time format",
          path: ["scheduledSessions", index, "startTime"],
        });
        return;
      }
      if (session.startTime >= session.endTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time must be after start time",
          path: ["scheduledSessions", index, "endTime"],
        });
      }
    });
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
  const updateCourseData = useCourseBuilderStore((s) => s.updateCourseData);
  const setCourseId = useCourseBuilderStore((s) => s.setCourseId);
  const setIsSaving = useCourseBuilderStore((s) => s.setIsSaving);
  const setLastSaved = useCourseBuilderStore((s) => s.setLastSaved);
  const isSaving = useCourseBuilderStore((s) => s.isSaving);
  const storeCourseId = useCourseBuilderStore((s) => s.courseId);
  const thumbnailPreview = useCourseBuilderStore((s) => s.thumbnailPreview);
  const videoPreview = useCourseBuilderStore((s) => s.videoPreview);
  const galleryPreviews = useCourseBuilderStore((s) => s.galleryPreviews);

  const lastSyncedValues = useRef<string>("");

  const form = useForm<CourseBuilderFormValues>({
    resolver: zodResolver(formSchema) as never,
    defaultValues: {
      title: initialData?.title ?? "",
      shortDescription: initialData?.shortDescription ?? "",
      description: initialData?.description ?? "",
      category: initialData?.category ?? "",
      level: initialData?.level ?? "",
      language: initialData?.language ?? "English",
      price: initialData?.price ?? 0,
      discountPrice: initialData?.discountPrice,
      durationInMonths: initialData?.durationInMonths ?? 1,
      totalClasses: initialData?.totalClasses ?? 0,
      startDate: initialData?.startDate ?? "",
      endDate: initialData?.endDate ?? "",
      scheduledSessions: initialData?.scheduledSessions ?? [],
      instructorUserId: initialData?.instructorUserId ?? "",
      instructorName: initialData?.instructorName ?? "",
      instructorTitle: initialData?.instructorTitle ?? "",
      instructorBio: initialData?.instructorBio ?? "",
      metaTitle: initialData?.metaTitle ?? "",
      metaDescription: initialData?.metaDescription ?? "",
      seoSlug: initialData?.seoSlug ?? "",
      keywords: initialData?.keywords ?? [],
    },
    mode: "onChange",
  });

  const watchedValues = useWatch({ control: form.control });

  const doSave = useCallback(
    async (values: CourseBuilderFormValues, generateCalendarLinks: boolean) => {
      setIsSaving(true);
      try {
        const payload = buildPayload(values, {
          thumbnailPreview,
          videoPreview,
          galleryPreviews,
          generateCalendarLinks,
        });

        let savedId = courseId;
        let json: {
          data?: {
            course?: { _id: string };
            calendarJob?: { estimatedDuration?: string; queued?: boolean };
          };
          message?: string;
        };

        if (mode === "create") {
          const res = await fetch("/api/courses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          json = await res.json();
          if (!res.ok) {
            throw new Error(json.message || "Failed to create course");
          }
          savedId = json.data?.course?._id;
          if (savedId) {
            setCourseId(savedId);
            router.replace(`/admin/courses/edit/${savedId}`);
          }
        } else {
          const res = await fetch(`/api/courses/${courseId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          json = await res.json();
          if (!res.ok) {
            throw new Error(json.message || "Failed to update course");
          }
        }

        if (generateCalendarLinks) {
          const job = json.data?.calendarJob;
          if (job?.queued === false) {
            toast.success("Draft saved. Google Meet links generated.");
          } else {
            const estimate = job?.estimatedDuration ?? "a few minutes";
            toast.success(`Draft saved. Google Meet links are generating (${estimate}).`);
          }
        } else {
          toast.success("Draft saved without Meet links.");
        }

        setLastSaved(new Date());
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Save failed";
        toast.error(msg);
        throw err;
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
      thumbnailPreview,
      videoPreview,
      galleryPreviews,
    ]
  );

  const saveDraft = async (generateCalendarLinks: boolean) => {
    const valid = await form.trigger();
    if (!valid) {
      toast.error("Please fix the highlighted fields before saving.");
      return;
    }
    await doSave(form.getValues(), generateCalendarLinks);
  };

  useEffect(() => {
    if (!watchedValues) return;
    const stringified = JSON.stringify(watchedValues);
    if (stringified === lastSyncedValues.current) return;
    lastSyncedValues.current = stringified;
    updateCourseData(watchedValues as Partial<CourseFormData>);
  }, [watchedValues, updateCourseData]);

  useEffect(() => {
    if (courseId && courseId !== storeCourseId) setCourseId(courseId);
  }, [courseId, storeCourseId, setCourseId]);

  const setThumbnailPreview = useCourseBuilderStore((s) => s.setThumbnailPreview);
  const setVideoPreview = useCourseBuilderStore((s) => s.setVideoPreview);
  const setGalleryPreviews = useCourseBuilderStore((s) => s.setGalleryPreviews);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      updateCourseData(initialData);
      if (initialData.thumbnail) {
        setThumbnailPreview({ ...initialData.thumbnail, isLocal: false });
      }
      if (initialData.introVideo) {
        setVideoPreview({ ...initialData.introVideo, isLocal: false });
      }
      if (initialData.gallery) {
        setGalleryPreviews(initialData.gallery.map((g) => ({ ...g, isLocal: false })));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return { form, saveDraft, isSubmitting: isSaving };
}

function deriveLegacyScheduleFields(
  sessions: IScheduledSession[],
  startDate: string,
  endDate: string
) {
  const sorted = sortScheduledSessions(sessions);
  const classDays = [
    ...new Set(
      sorted.map((session) => new Date(session.scheduledDate).getDay())
    ),
  ].sort((a, b) => a - b);
  const first = sorted[0];

  return {
    durationInMonths: computeDurationInMonths(startDate, endDate),
    totalClasses: sorted.length,
    batchType: inferBatchType(sorted),
    classDays: classDays.length > 0 ? classDays : [0, 1, 2, 3, 4, 5, 6],
    classStartTime: first?.startTime ?? "07:00",
    classEndTime: first?.endTime ?? "08:00",
    scheduledSessions: sorted,
  };
}

function buildPayload(
  values: CourseBuilderFormValues,
  storeData: {
    thumbnailPreview?: { url: string; public_id: string; isLocal: boolean } | null;
    videoPreview?: {
      url: string;
      public_id: string;
      thumbnail?: string;
      duration?: number;
      isLocal: boolean;
    } | null;
    galleryPreviews?: Array<{ url: string; public_id?: string; isLocal: boolean }>;
    generateCalendarLinks: boolean;
  }
) {
  const scheduleFields = deriveLegacyScheduleFields(
    values.scheduledSessions,
    values.startDate,
    values.endDate
  );

  return {
    title: values.title,
    shortDescription: values.shortDescription,
    description: values.description,
    category: values.category,
    level: values.level,
    language: values.language,
    price: Number(values.price),
    discountPrice: values.discountPrice ? Number(values.discountPrice) : undefined,
    durationInMonths: scheduleFields.durationInMonths,
    totalClasses: scheduleFields.totalClasses,
    batchType: scheduleFields.batchType,
    meetingPlatform: "google-meet",
    startDate: values.startDate,
    endDate: values.endDate,
    classDays: scheduleFields.classDays,
    classStartTime: scheduleFields.classStartTime,
    classEndTime: scheduleFields.classEndTime,
    scheduledSessions: scheduleFields.scheduledSessions,
    instructorUserId: values.instructorUserId,
    instructorName: values.instructorName,
    instructor: {
      name: values.instructorName,
      title: values.instructorTitle,
      bio: values.instructorBio,
    },
    thumbnail:
      storeData.thumbnailPreview && !storeData.thumbnailPreview.isLocal
        ? {
            url: storeData.thumbnailPreview.url,
            public_id: storeData.thumbnailPreview.public_id,
          }
        : undefined,
    introVideo:
      storeData.videoPreview && !storeData.videoPreview.isLocal
        ? {
            url: storeData.videoPreview.url,
            public_id: storeData.videoPreview.public_id,
            thumbnail: storeData.videoPreview.thumbnail || "",
            duration: storeData.videoPreview.duration || 0,
          }
        : undefined,
    gallery: (storeData.galleryPreviews ?? [])
      .filter((p) => !p.isLocal)
      .map((p) => ({ url: p.url, public_id: p.public_id || "" })),
    seo: {
      metaTitle: values.metaTitle,
      metaDescription: values.metaDescription,
      slug: values.seoSlug,
      keywords: values.keywords,
    },
    isPublished: false,
    generateCalendarLinks: storeData.generateCalendarLinks,
  };
}
