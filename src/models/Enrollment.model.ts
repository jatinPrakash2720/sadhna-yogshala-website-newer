/**
 * Yogshala LMS — Enrollment Model
 * Tracks student-course enrollment with progress and payment status.
 */

import mongoose, { Schema, type Model } from "mongoose";
import { PaymentStatus, CalendarSyncStatus } from "@/constants";
import type { IEnrollment } from "@/types";

const enrollmentSchema = new Schema<IEnrollment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course reference is required"],
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: [0, "Progress cannot be negative"],
      max: [100, "Progress cannot exceed 100%"],
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    calendarSyncStatus: {
      type: String,
      enum: Object.values(CalendarSyncStatus),
      default: CalendarSyncStatus.PENDING,
    },
    calendarSyncError: {
      type: String,
      trim: true,
    },
    calendarSyncedAt: {
      type: Date,
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
// Prevent duplicate enrollments for the same student-course pair
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ student: 1, paymentStatus: 1 });
enrollmentSchema.index({ calendarSyncStatus: 1, paymentStatus: 1 });

const Enrollment: Model<IEnrollment> =
  mongoose.models.Enrollment || mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);

export default Enrollment;
