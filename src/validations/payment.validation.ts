/**
 * Yogshala LMS — Payment Validation Schemas
 * Zod 4 schemas for Razorpay payment operations.
 */

import { z } from "zod";
import { objectIdSchema } from "./common.validation";

/**
 * Create Razorpay order schema.
 */
export const createOrderSchema = z.object({
  courseId: objectIdSchema,
});

/**
 * Verify Razorpay payment schema.
 */
export const verifyPaymentSchema = z.object({
  razorpayOrderId: z
    .string({ error: "Razorpay order ID is required" })
    .min(1, "Razorpay order ID is required"),
  razorpayPaymentId: z
    .string({ error: "Razorpay payment ID is required" })
    .min(1, "Razorpay payment ID is required"),
  razorpaySignature: z
    .string({ error: "Razorpay signature is required" })
    .min(1, "Razorpay signature is required"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
