/**
 * Yogshala LMS — Attendance Model
 * Tracks student attendance for each class session.
 */

import mongoose, { Schema, type Model } from "mongoose";
import type { IAttendance } from "@/types";

const attendanceSchema = new Schema<IAttendance>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
    },
    classSession: {
      type: Schema.Types.ObjectId,
      ref: "ClassSession",
      required: [true, "Class session reference is required"],
    },
    attended: {
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
// Prevent duplicate attendance records for same student-session pair
attendanceSchema.index({ student: 1, classSession: 1 }, { unique: true });

const Attendance: Model<IAttendance> =
  mongoose.models.Attendance || mongoose.model<IAttendance>("Attendance", attendanceSchema);

export default Attendance;
