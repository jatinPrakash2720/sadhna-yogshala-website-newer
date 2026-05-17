import mongoose, { Schema, type Model } from "mongoose";
import type { IWorkshopAttendance } from "@/types";

const workshopAttendanceSchema = new Schema<IWorkshopAttendance>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    workshop: { type: Schema.Types.ObjectId, ref: "Workshop", required: true },
    attended: { type: Boolean, default: false },
    checkedInAt: { type: Date, default: undefined },
    notes: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

workshopAttendanceSchema.index({ student: 1, workshop: 1 }, { unique: true });
workshopAttendanceSchema.index({ workshop: 1, attended: 1 });

const WorkshopAttendance: Model<IWorkshopAttendance> =
  mongoose.models.WorkshopAttendance ||
  mongoose.model<IWorkshopAttendance>("WorkshopAttendance", workshopAttendanceSchema);

export default WorkshopAttendance;
