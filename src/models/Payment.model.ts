/**
 * Yogshala LMS — Payment Model
 * Stores Razorpay payment records with verification data.
 */

import mongoose, { Schema, type Model } from "mongoose";
import { PaymentStatus, DEFAULT_CURRENCY } from "@/constants";
import type { IPayment } from "@/types";

const paymentSchema = new Schema<IPayment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course reference is required"],
    },
    razorpayOrderId: {
      type: String,
      required: [true, "Razorpay order ID is required"],
      unique: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    currency: {
      type: String,
      default: DEFAULT_CURRENCY,
      uppercase: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.__v;
        // Don't expose Razorpay signature in API responses
        delete ret.razorpaySignature;
        return ret;
      },
    },
  }
);

// ─── Indexes ─────────────────────────────────────────────
paymentSchema.index({ razorpayOrderId: 1 }, { unique: true });
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ paymentStatus: 1 });

const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;
