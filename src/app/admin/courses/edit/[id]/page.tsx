"use client";

/**
 * /admin/courses/edit/[id] — Course edit page
 * Fetches existing course via React Query then renders the builder.
 */

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import CourseBuilderLayout from "@/components/course-builder/CourseBuilderLayout";
import type { CourseFormData } from "@/types";
import { ALL_CLASS_DAYS } from "@/constants";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchCourse(id: string) {
  const res = await fetch(`/api/courses/${id}`);
  if (!res.ok) throw new Error("Course not found");
  const json = await res.json();
  return json.data?.course;
}

function mapCourseToFormData(course: any): Partial<CourseFormData> {
  return {
    title: course.title ?? "",
    shortDescription: course.shortDescription ?? "",
    description: course.description ?? "",
    category: course.category ?? "",
    level: course.level ?? "",
    language: course.language ?? "English",
    price: course.price ?? 0,
    discountPrice: course.discountPrice,
    durationInMonths: course.durationInMonths ?? 1,
    totalClasses: course.totalClasses ?? 1,
    batchType: course.batchType ?? "morning",
    startDate: course.startDate ? course.startDate.slice(0, 10) : "",
    endDate: course.endDate ? course.endDate.slice(0, 10) : "",
    scheduledSessions: (course.scheduledSessions ?? []).map((session: {
      scheduledDate: string;
      startTime: string;
      endTime: string;
      slotKey?: string;
    }) => ({
      scheduledDate: session.scheduledDate,
      startTime: session.startTime,
      endTime: session.endTime,
      slotKey: session.slotKey,
    })),
    classDays: course.classDays ?? [...ALL_CLASS_DAYS],
    instructorUserId: course.instructorUser?.toString?.() ?? course.instructorUser ?? "",
    instructorName: course.instructor?.name ?? course.instructorName ?? "",
    instructorTitle: course.instructor?.title ?? "",
    instructorBio: course.instructor?.bio ?? "",
    curriculum: (course.curriculum ?? []).map((s: any) => ({
      id: s._id?.toString() ?? Math.random().toString(36).slice(2),
      sectionTitle: s.sectionTitle,
      lessons: (s.lessons ?? []).map((l: any) => ({
        id: l._id?.toString() ?? Math.random().toString(36).slice(2),
        title: l.title,
        duration: l.duration ?? 0,
        isPreview: l.isPreview ?? false,
      })),
    })),
    metaTitle: course.seo?.metaTitle ?? "",
    metaDescription: course.seo?.metaDescription ?? "",
    seoSlug: course.seo?.slug ?? "",
    keywords: course.seo?.keywords ?? [],
    isPublished: course.isPublished ?? false,
    calendarLinksGenerated: course.calendarLinksGenerated ?? false,
    
    // Media assets
    thumbnail: course.thumbnail,
    introVideo: course.introVideo,
    gallery: course.gallery ?? [],
  };
}

function EditCourseContent({ id }: { id: string }) {
  const { data: course, isLoading, isError, error } = useQuery({
    queryKey: ["course", id],
    queryFn: () => fetchCourse(id),
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <div className="h-12 w-12 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin mx-auto" />
          <p className="text-sm text-sage-500">Loading course...</p>
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4 max-w-sm">
          <div className="h-14 w-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Course Not Found</p>
            <p className="text-sm text-sage-500 mt-1">
              {error instanceof Error ? error.message : "Could not load course data"}
            </p>
          </div>
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const initialData = mapCourseToFormData(course);

  return (
    <CourseBuilderLayout
      mode="edit"
      courseId={id}
      initialData={initialData}
    />
  );
}

export default function EditCoursePage({ params }: PageProps) {
  const { id } = use(params);
  return <EditCourseContent id={id} />;
}
