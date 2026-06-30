/**
 * Yogshala LMS — Payment Model
 * Stores Razorpay payment records with verification data.
 */

import mongoose, { Schema, type Model } from "mongoose";
import { PaymentStatus, DEFAULT_CURRENCY } from "@/constants";
import type { IPayment } from "@/types";

const checkoutPayloadSchema = new Schema(
  {
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
  },
  { _id: false }
);

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
    internalOrderId: {
      type: String,
      required: [true, "Internal order ID is required"],
      unique: true,
    },
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true,
    },
    razorpayOrderId: {
      type: String,
      unique: true,
      sparse: true,
    },
    razorpayPaymentId: {
      type: String,
      unique: true,
      sparse: true,
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
    paymentExpiry: {
      type: Date,
      required: [true, "Payment expiry is required"],
    },
    checkoutPayload: {
      type: checkoutPayloadSchema,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.__v;
        delete ret.razorpaySignature;
        return ret;
      },
    },
  }
);

// ─── Indexes ─────────────────────────────────────────────
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ paymentStatus: 1 });
// Layer 3: one active pending checkout per user+course
paymentSchema.index(
  { user: 1, course: 1 },
  {
    unique: true,
    partialFilterExpression: { paymentStatus: PaymentStatus.PENDING },
  }
);

const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;
