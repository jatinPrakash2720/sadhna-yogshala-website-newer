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
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
