/**
 * Yogshala LMS — Auth Validation Schemas
 * Zod 4 schemas for all authentication-related endpoints.
 */

import { z } from "zod";
import { Gender } from "@/constants";
import { emailSchema, phoneSchema, strongPasswordSchema } from "./common.validation";

/**
 * Registration schema — manual signup.
 */
export const registerSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  email: emailSchema,
  phone: phoneSchema,
  password: strongPasswordSchema,
  gender: z.nativeEnum(Gender).optional(),
  dob: z
    .string()
    .datetime({ offset: true })
    .or(z.string().date())
    .optional(),
});

/**
 * Login schema — manual login.
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string({ error: "Password is required" }).min(1, "Password is required"),
});

/**
 * Complete profile schema — for Google users missing phone/password.
 */
export const completeProfileSchema = z.object({
  phone: phoneSchema,
  password: strongPasswordSchema,
  dob: z
    .string()
    .datetime({ offset: true })
    .or(z.string().date())
    .optional(),
  gender: z.nativeEnum(Gender).optional(),
  emergencyContact: z.string().max(200).optional(),
  healthConditions: z.string().max(500).optional(),
});

/**
 * Change password schema — for authenticated users.
 */
export const changePasswordSchema = z.object({
  oldPassword: z.string({ error: "Current password is required" }).min(1),
  newPassword: strongPasswordSchema,
});

/**
 * Update profile schema — for authenticated users.
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .optional()
    .or(z.literal("")),
  email: emailSchema.optional().or(z.literal("")),
  phone: phoneSchema.optional().or(z.literal("")),
  bio: z.string().max(500).optional().or(z.literal("")),
  dob: z
    .string()
    .datetime({ offset: true })
    .or(z.string().date())
    .optional()
    .or(z.literal("")),
  gender: z.nativeEnum(Gender).optional().or(z.literal("")),
  emergencyContact: z.string().max(200).optional().or(z.literal("")),
  healthConditions: z.string().max(500).optional().or(z.literal("")),
});

/**
 * Forgot password schema — request a reset token.
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/**
 * Reset password schema — set new password using token.
 */
export const resetPasswordSchema = z.object({
  token: z.string({ error: "Reset token is required" }).min(1),
  newPassword: strongPasswordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
