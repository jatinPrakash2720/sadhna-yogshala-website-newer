/**
 * Yogshala LMS — Course Model (Extended)
 * Yoga course schema with curriculum, instructor subdocument,
 * SEO settings, and media configuration.
 */

import mongoose, { Schema, type Model } from "mongoose";
import { BatchType, MeetingPlatform, ClassSessionSource, ALL_CLASS_DAYS } from "@/constants";
import type { ICourse } from "@/types";

// ─── Media Sub-schemas ────────────────────────────────────
const mediaAssetSchema = new Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false }
);

const videoAssetSchema = new Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    duration: { type: Number, default: 0 },
  },
  { _id: false }
);

// ─── Instructor Sub-schema ────────────────────────────────
const instructorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true, default: "" },
    bio: { type: String, trim: true, default: "" },
    image: { type: mediaAssetSchema, default: undefined },
  },
  { _id: false }
);

// ─── Curriculum Sub-schemas ───────────────────────────────
const curriculumLessonSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    duration: { type: Number, default: 0 }, // minutes
    isPreview: { type: Boolean, default: false },
  },
  { _id: true }
);

const curriculumSectionSchema = new Schema(
  {
    sectionTitle: { type: String, required: true, trim: true },
    lessons: { type: [curriculumLessonSchema], default: [] },
  },
  { _id: true }
);

// ─── SEO Sub-schema ───────────────────────────────────────
const seoSchema = new Schema(
  {
    metaTitle: { type: String, trim: true, default: "" },
    metaDescription: { type: String, trim: true, default: "" },
    slug: { type: String, trim: true, lowercase: true, default: "" },
    keywords: { type: [String], default: [] },
  },
  { _id: false }
);

const courseSchema = new Schema<ICourse>(
  {
    // ─── Core Info ──────────────────────────────────────
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title must not exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, "Short description must not exceed 300 characters"],
      default: "",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [5000, "Description must not exceed 5000 characters"],
    },
    category: {
      type: String,
      trim: true,
      default: "",
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "all-levels", ""],
      default: "",
    },
    language: {
      type: String,
      default: "English",
    },

    // ─── Media ──────────────────────────────────────────
    thumbnail: {
      type: mediaAssetSchema,
      default: undefined,
    },
    gallery: {
      type: [mediaAssetSchema],
      default: [],
    },
    introVideo: {
      type: videoAssetSchema,
      default: undefined,
    },

    // ─── Instructor ─────────────────────────────────────
    instructor: {
      type: instructorSchema,
      default: undefined,
    },
    // Legacy — kept for backwards compatibility
    instructorName: {
      type: String,
      trim: true,
      minlength: [2, "Instructor name must be at least 2 characters"],
    },

    // ─── Pricing & Batch ────────────────────────────────
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
      default: undefined,
    },
    durationInMonths: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 month"],
      max: [24, "Duration must not exceed 24 months"],
    },
    batchType: {
      type: String,
      required: [true, "Batch type is required"],
      enum: Object.values(BatchType),
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    totalClasses: {
      type: Number,
      required: [true, "Total classes is required"],
      min: [1, "Must have at least 1 class"],
    },
    meetingPlatform: {
      type: String,
      required: [true, "Meeting platform is required"],
      enum: Object.values(MeetingPlatform),
      default: MeetingPlatform.GOOGLE_MEET,
    },
    classDays: {
      type: [Number],
      default: [...ALL_CLASS_DAYS],
      validate: {
        validator(days: number[]) {
          return (
            days.length > 0 &&
            days.every((day) => Number.isInteger(day) && day >= 0 && day <= 6)
          );
        },
        message: "classDays must be weekday numbers between 0 and 6",
      },
    },
    classStartTime: {
      type: String,
      default: "06:30",
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Class start time must be in HH:MM format"],
    },
    classEndTime: {
      type: String,
      default: "07:30",
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Class end time must be in HH:MM format"],
    },
    calendarLinksGenerated: {
      type: Boolean,
      default: false,
    },
    calendarLinksGeneratedAt: {
      type: Date,
    },
    instructorUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    scheduledSessions: {
      type: [
        new Schema(
          {
            scheduledDate: {
              type: String,
              required: true,
              match: [/^\d{4}-\d{2}-\d{2}$/, "scheduledDate must be YYYY-MM-DD"],
            },
            startTime: {
              type: String,
              required: true,
              match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "startTime must be HH:MM"],
            },
            endTime: {
              type: String,
              required: true,
              match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "endTime must be HH:MM"],
            },
            slotKey: { type: String },
          },
          { _id: false }
        ),
      ],
      default: [],
    },

    // ─── Curriculum ─────────────────────────────────────
    curriculum: {
      type: [curriculumSectionSchema],
      default: [],
    },

    // ─── SEO ────────────────────────────────────────────
    seo: {
      type: seoSchema,
      default: () => ({}),
    },

    // ─── Publishing ─────────────────────────────────────
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ─── Indexes ─────────────────────────────────────────────
courseSchema.index({ isPublished: 1, batchType: 1 });
courseSchema.index({ title: "text", description: "text" }); // Text search index
courseSchema.index({ category: 1 });

// ─── Pre-save: Generate/Sync slug ────────────────────────
// ─── Pre-save: Generate/Sync slug ────────────────────────
courseSchema.pre("save", async function () {
  // 1. Prioritize user-provided SEO slug
  if (this.seo?.slug) {
    this.slug = this.seo.slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  } 
  // 2. Generate from title if slug is missing or title was modified but slug wasn't
  else if (this.isModified("title") || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    if (this.isNew) {
      this.slug += "-" + Math.random().toString(36).substring(2, 6);
    }
  }

  // 3. Keep seo.slug in sync
  if (this.seo) {
    this.seo.slug = this.slug;
  }

  // 4. Sync legacy instructorName
  if (this.instructor?.name && !this.instructorName) {
    this.instructorName = this.instructor.name;
  }
});

// Force re-registration of the model to clear stale middleware cache in dev
if (mongoose.models.Course) {
  delete (mongoose.models as any).Course;
}

const Course: Model<ICourse> = mongoose.model<ICourse>("Course", courseSchema);

export default Course;
