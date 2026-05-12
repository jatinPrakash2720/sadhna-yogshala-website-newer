/**
 * Yogshala LMS — Create Razorpay Order API
 * POST /api/payments/create-order — Initiate a payment order.
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendCreated, sendBadRequest } from "@/utils/apiResponse";
import { withAuth } from "@/middleware/withAuth";
import { validateBody } from "@/middleware/withValidation";
import { createOrderSchema } from "@/validations/payment.validation";
import { PaymentService } from "@/services/payment.service";
import { HTTP_STATUS } from "@/constants";
import { sendError } from "@/utils/apiResponse";

export const POST = asyncHandler(
  withAuth(async (req: NextRequest, { user }) => {
    const validation = await validateBody(req, createOrderSchema);
    if (validation.error) return validation.error;

    try {
      const { order, payment } = await PaymentService.createOrder(
        user.id,
        validation.data.courseId
      );

      return sendCreated(
        {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          paymentId: payment._id,
          keyId: process.env.RAZORPAY_KEY_ID,
        },
        "Order created successfully"
      );
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.startsWith("PROFILE_INCOMPLETE")) {
          return sendError(
            "Please complete your profile before purchasing a course",
            HTTP_STATUS.UNPROCESSABLE_ENTITY
          );
        }
        return sendBadRequest(error.message);
      }
      throw error;
    }
  })
);
