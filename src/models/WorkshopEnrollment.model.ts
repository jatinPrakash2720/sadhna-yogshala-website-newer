import mongoose, { Schema, type Model } from "mongoose";
import { PaymentStatus, WorkshopEnrollmentStatus } from "@/constants";
import type { IWorkshopEnrollment } from "@/types";

const workshopEnrollmentSchema = new Schema<IWorkshopEnrollment>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    workshop: { type: Schema.Types.ObjectId, ref: "Workshop", required: true },
    status: {
      type: String,
      enum: Object.values(WorkshopEnrollmentStatus),
      default: WorkshopEnrollmentStatus.ENROLLED,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

workshopEnrollmentSchema.index({ student: 1, workshop: 1 }, { unique: true });
workshopEnrollmentSchema.index({ student: 1, status: 1 });

const WorkshopEnrollment: Model<IWorkshopEnrollment> =
  mongoose.models.WorkshopEnrollment ||
  mongoose.model<IWorkshopEnrollment>("WorkshopEnrollment", workshopEnrollmentSchema);

export default WorkshopEnrollment;
