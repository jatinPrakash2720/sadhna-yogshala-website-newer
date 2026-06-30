/**
 * Yogshala LMS — Course Builder Zustand Store
 * Media previews and form sync state for the course builder.
 */

import { create } from "zustand";
import { ALL_CLASS_DAYS } from "@/constants";
import type { CourseFormData, CourseFormSection } from "@/types";

export type BuilderSection =
  | "basic"
  | "thumbnail"
  | "video"
  | "gallery"
  | "pricing"
  | "instructor"
  | "curriculum"
  | "seo"
  | "publish";

export interface ThumbnailPreview {
  url: string;
  public_id: string;
  isLocal: boolean; // true = blob URL (not yet uploaded), false = Cloudinary URL
}

export interface VideoPreview {
  url: string;
  public_id: string;
  thumbnail?: string;
  duration?: number;
  isLocal: boolean;
}

export interface GalleryPreview {
  url: string;
  public_id?: string;
  isLocal: boolean;
}

interface CourseBuilderState {
  // ─── Live form data (mirrors RHF) ─────────────────
  courseData: Partial<CourseFormData>;

  // ─── Media previews (separate from form data) ─────
  thumbnailPreview: ThumbnailPreview | null;
  videoPreview: VideoPreview | null;
  galleryPreviews: GalleryPreview[];

  // ─── UI state ─────────────────────────────────────
  activeSection: BuilderSection;
  collapsedSections: Set<BuilderSection>;

  // ─── Save state ───────────────────────────────────
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  courseId: string | null;
  isMediaUploading: boolean;

  // ─── Actions ──────────────────────────────────────
  updateCourseData: (data: Partial<CourseFormData>) => void;
  updateField: <K extends keyof CourseFormData>(key: K, value: CourseFormData[K]) => void;
  setCourseId: (id: string) => void;

  setThumbnailPreview: (preview: ThumbnailPreview | null) => void;
  setVideoPreview: (preview: VideoPreview | null) => void;
  setGalleryPreviews: (previews: GalleryPreview[]) => void;
  addGalleryPreview: (preview: GalleryPreview) => void;
  removeGalleryPreview: (index: number) => void;

  setIsMediaUploading: (uploading: boolean) => void;

  setActiveSection: (section: BuilderSection) => void;
  toggleSection: (section: BuilderSection) => void;

  setIsSaving: (saving: boolean) => void;
  setLastSaved: (date: Date) => void;
  setIsDirty: (dirty: boolean) => void;

  // ─── Curriculum helpers ───────────────────────────
  addSection: () => void;
  removeSection: (sectionId: string) => void;
  updateSection: (sectionId: string, title: string) => void;
  addLesson: (sectionId: string) => void;
  removeLesson: (sectionId: string, lessonId: string) => void;
  updateLesson: (
    sectionId: string,
    lessonId: string,
    data: Partial<{ title: string; duration: number; isPreview: boolean }>
  ) => void;

  resetStore: () => void;
}

const DEFAULT_COURSE_DATA: Partial<CourseFormData> = {
  title: "",
  shortDescription: "",
  description: "",
  category: "",
  level: "",
  language: "English",
  price: 0,
  discountPrice: undefined,
  durationInMonths: 1,
  totalClasses: 1,
  batchType: "morning",
  startDate: "",
  endDate: "",
  scheduledSessions: [],
  classDays: [...ALL_CLASS_DAYS],
  instructorUserId: "",
  instructorName: "",
  instructorTitle: "",
  instructorBio: "",
  curriculum: [],
  metaTitle: "",
  metaDescription: "",
  seoSlug: "",
  keywords: [],
  isPublished: false,
  thumbnail: undefined,
  introVideo: undefined,
  gallery: [],
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export const useCourseBuilderStore = create<CourseBuilderState>((set, get) => ({
  // ─── Initial state ────────────────────────────────
  courseData: { ...DEFAULT_COURSE_DATA },
  thumbnailPreview: null,
  videoPreview: null,
  galleryPreviews: [],
  activeSection: "basic",
  collapsedSections: new Set(),
  isDirty: false,
  isSaving: false,
  lastSaved: null,
  courseId: null,
  isMediaUploading: false,

  // ─── Actions ──────────────────────────────────────
  updateCourseData: (data) =>
    set((state) => ({
      courseData: { ...state.courseData, ...data },
      isDirty: true,
    })),

  updateField: (key, value) =>
    set((state) => ({
      courseData: { ...state.courseData, [key]: value },
      isDirty: true,
    })),

  setCourseId: (id) => set({ courseId: id }),

  setThumbnailPreview: (preview) => set({ thumbnailPreview: preview }),
  setVideoPreview: (preview) => set({ videoPreview: preview }),
  setGalleryPreviews: (previews) => set({ galleryPreviews: previews }),
  addGalleryPreview: (preview) =>
    set((state) => ({ galleryPreviews: [...state.galleryPreviews, preview] })),
  removeGalleryPreview: (index) =>
    set((state) => ({
      galleryPreviews: state.galleryPreviews.filter((_, i) => i !== index),
    })),

  setIsMediaUploading: (uploading) => set({ isMediaUploading: uploading }),

  setActiveSection: (section) => set({ activeSection: section }),
  toggleSection: (section) =>
    set((state) => {
      const next = new Set(state.collapsedSections);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return { collapsedSections: next };
    }),

  setIsSaving: (saving) => set({ isSaving: saving }),
  setLastSaved: (date) => set({ lastSaved: date, isDirty: false }),
  setIsDirty: (dirty) => set({ isDirty: dirty }),

  // ─── Curriculum helpers ───────────────────────────
  addSection: () =>
    set((state) => {
      const newSection: CourseFormSection = {
        id: generateId(),
        sectionTitle: `Section ${((state.courseData.curriculum ?? []).length) + 1}`,
        lessons: [],
      };
      const curriculum = [...(state.courseData.curriculum ?? []), newSection];
      return { courseData: { ...state.courseData, curriculum }, isDirty: true };
    }),

  removeSection: (sectionId) =>
    set((state) => {
      const curriculum = (state.courseData.curriculum ?? []).filter(
        (s) => s.id !== sectionId
      );
      return { courseData: { ...state.courseData, curriculum }, isDirty: true };
    }),

  updateSection: (sectionId, title) =>
    set((state) => {
      const curriculum = (state.courseData.curriculum ?? []).map((s) =>
        s.id === sectionId ? { ...s, sectionTitle: title } : s
      );
      return { courseData: { ...state.courseData, curriculum }, isDirty: true };
    }),

  addLesson: (sectionId) =>
    set((state) => {
      const curriculum = (state.courseData.curriculum ?? []).map((s) => {
        if (s.id !== sectionId) return s;
        const newLesson = {
          id: generateId(),
          title: `Lesson ${s.lessons.length + 1}`,
          duration: 30,
          isPreview: false,
        };
        return { ...s, lessons: [...s.lessons, newLesson] };
      });
      return { courseData: { ...state.courseData, curriculum }, isDirty: true };
    }),

  removeLesson: (sectionId, lessonId) =>
    set((state) => {
      const curriculum = (state.courseData.curriculum ?? []).map((s) => {
        if (s.id !== sectionId) return s;
        return { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) };
      });
      return { courseData: { ...state.courseData, curriculum }, isDirty: true };
    }),

  updateLesson: (sectionId, lessonId, data) =>
    set((state) => {
      const curriculum = (state.courseData.curriculum ?? []).map((s) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          lessons: s.lessons.map((l) =>
            l.id === lessonId ? { ...l, ...data } : l
          ),
        };
      });
      return { courseData: { ...state.courseData, curriculum }, isDirty: true };
    }),

  resetStore: () =>
    set({
      courseData: { ...DEFAULT_COURSE_DATA },
      thumbnailPreview: null,
      videoPreview: null,
      galleryPreviews: [],
      activeSection: "basic",
      collapsedSections: new Set(),
      isDirty: false,
      isSaving: false,
      lastSaved: null,
      courseId: null,
      isMediaUploading: false,
    }),
}));
