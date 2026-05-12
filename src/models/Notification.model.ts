/**
 * Yogshala LMS — Notification Model
 * User notifications for class reminders, payment confirmations, etc.
 */

import mongoose, { Schema, type Model } from "mongoose";
import type { INotification } from "@/types";

const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
      maxlength: [200, "Title must not exceed 200 characters"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
      maxlength: [1000, "Message must not exceed 1000 characters"],
    },
    isRead: {
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
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;
