/**
 * Yogshala LMS — Course Model
 * Yoga course schema with auto-generated slugs, batch types,
 * and meeting platform configuration.
 */

import mongoose, { Schema, type Model } from "mongoose";
import { BatchType, MeetingPlatform } from "@/constants";
import type { ICourse } from "@/types";

const courseSchema = new Schema<ICourse>(
  {
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
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [5000, "Description must not exceed 5000 characters"],
    },
    thumbnail: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
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
    instructorName: {
      type: String,
      required: [true, "Instructor name is required"],
      trim: true,
      minlength: [2, "Instructor name must be at least 2 characters"],
    },
    meetingPlatform: {
      type: String,
      required: [true, "Meeting platform is required"],
      enum: Object.values(MeetingPlatform),
    },
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
courseSchema.index({ slug: 1 }, { unique: true });
courseSchema.index({ isPublished: 1, batchType: 1 });
courseSchema.index({ title: "text", description: "text" }); // Text search index

// ─── Pre-save: Generate slug from title ──────────────────
courseSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      + "-" + Date.now().toString(36);
  }
});

const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", courseSchema);

export default Course;
