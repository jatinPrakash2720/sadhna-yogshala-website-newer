/**
 * Yogshala LMS — Payment Validation Schemas
 * Zod 4 schemas for Razorpay payment operations.
 */

import { z } from "zod";
import { objectIdSchema } from "./common.validation";

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const idempotencyKeySchema = z
  .string({ error: "Idempotency key is required" })
  .regex(UUID_V4_REGEX, "Idempotency key must be a valid UUID v4");

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
