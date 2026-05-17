/**
 * Yogshala LMS — User Model
 * Core user schema with bcrypt password hashing, role-based access,
 * and support for both manual and Google auth providers.
 */

import mongoose, { Schema, type Model } from "mongoose";
import bcrypt from "bcryptjs";
import { UserRole, AuthProvider, UserStatus, Gender, AUTH } from "@/constants";
import type { IUser } from "@/types";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must not exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[1-9]\d{6,14}$/, "Please provide a valid phone number"],
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Never returned in queries by default
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.STUDENT,
    },
    authProvider: {
      type: String,
      enum: Object.values(AuthProvider),
      default: AuthProvider.MANUAL,
    },
    image: {
      type: String,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio must not exceed 500 characters"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profileCompleted: {
      type: Boolean,
      default: true,
    },
    purchasedCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
    },
    emergencyContact: {
      type: String,
      trim: true,
      maxlength: [200, "Emergency contact must not exceed 200 characters"],
    },
    healthConditions: {
      type: String,
      trim: true,
      maxlength: [500, "Health conditions must not exceed 500 characters"],
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    lastLogin: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      // Remove sensitive fields when converting to JSON
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ─── Indexes ─────────────────────────────────────────────
userSchema.index({ role: 1, status: 1 });

// ─── Schema Method: Compare password ─────────────────────
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
