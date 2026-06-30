/**
 * Yogshala LMS — ClassSession Model
 * Scheduled yoga class sessions linked to courses.
 */

import mongoose, { Schema, type Model } from "mongoose";
import { ClassStatus, ClassSessionSource } from "@/constants";
import type { IClassSession } from "@/types";

const classSessionSchema = new Schema<IClassSession>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course reference is required"],
    },
    title: {
      type: String,
      required: [true, "Class title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title must not exceed 200 characters"],
    },
    meetingLink: {
      type: String,
      trim: true,
    },
    googleEventId: {
      type: String,
      trim: true,
      sparse: true,
    },
    scheduledDate: {
      type: Date,
      required: [true, "Scheduled date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Start time must be in HH:MM format"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "End time must be in HH:MM format"],
    },
    status: {
      type: String,
      enum: Object.values(ClassStatus),
      default: ClassStatus.UPCOMING,
    },
    source: {
      type: String,
      enum: Object.values(ClassSessionSource),
      default: ClassSessionSource.MANUAL,
    },
    sessionNumber: {
      type: Number,
      min: 1,
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
classSessionSchema.index({ course: 1, scheduledDate: 1 });
classSessionSchema.index({ status: 1 });
classSessionSchema.index({ course: 1, status: 1, scheduledDate: 1 });
classSessionSchema.index({ course: 1, source: 1 });

const ClassSession: Model<IClassSession> =
  mongoose.models.ClassSession ||
  mongoose.model<IClassSession>("ClassSession", classSessionSchema);

export default ClassSession;
