/**
 * Yogshala LMS — Create Razorpay Order API
 * POST /api/payments/create-order — Initiate a payment order.
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendCreated, sendBadRequest, sendSuccess, sendError } from "@/utils/apiResponse";
import { withAuth } from "@/middleware/withAuth";
import { validateBody } from "@/middleware/withValidation";
import { createOrderSchema, idempotencyKeySchema } from "@/validations/payment.validation";
import { PaymentService } from "@/services/payment.service";
import { HTTP_STATUS, PAYMENT } from "@/constants";

export const POST = asyncHandler(
  withAuth(async (req: NextRequest, { user }) => {
    const validation = await validateBody(req, createOrderSchema);
    if (validation.error) return validation.error;

    const rawIdempotencyKey = req.headers.get(PAYMENT.IDEMPOTENCY_HEADER);
    const keyResult = idempotencyKeySchema.safeParse(rawIdempotencyKey);
    if (!keyResult.success) {
      return sendBadRequest(
        keyResult.error.issues[0]?.message ??
          `${PAYMENT.IDEMPOTENCY_HEADER} header is required`
      );
    }

    try {
      const { checkout, reused } = await PaymentService.createOrder(
        user.id,
        validation.data.courseId,
        keyResult.data
      );

      const payload = {
        orderId: checkout.orderId,
        amount: checkout.amount,
        currency: checkout.currency,
        paymentId: checkout.paymentId,
        keyId: checkout.keyId,
        reused,
      };

      if (reused) {
        return sendSuccess(payload, "Checkout session ready");
      }

      return sendCreated(payload, "Order created successfully");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.startsWith("PROFILE_INCOMPLETE")) {
          return sendError(
            "Please complete your profile before purchasing a course",
            HTTP_STATUS.UNPROCESSABLE_ENTITY
          );
        }
        if (error.message.includes("checkout is already in progress")) {
          return sendError(error.message, HTTP_STATUS.CONFLICT);
        }
        return sendBadRequest(error.message);
      }
      throw error;
    }
  })
);
