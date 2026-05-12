/**
 * Yogshala LMS — Verify Payment API
 * POST /api/payments/verify — Verify Razorpay payment signature.
 */

import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { sendSuccess, sendBadRequest } from "@/utils/apiResponse";
import { withAuth } from "@/middleware/withAuth";
import { validateBody } from "@/middleware/withValidation";
import { verifyPaymentSchema } from "@/validations/payment.validation";
import { PaymentService } from "@/services/payment.service";

export const POST = asyncHandler(
  withAuth(async (req: NextRequest) => {
    const validation = await validateBody(req, verifyPaymentSchema);
    if (validation.error) return validation.error;

    try {
      const payment = await PaymentService.verifyPayment(
        validation.data.razorpayOrderId,
        validation.data.razorpayPaymentId,
        validation.data.razorpaySignature
      );

      return sendSuccess(
        { payment },
        "Payment verified and enrollment created successfully"
      );
    } catch (error) {
      if (error instanceof Error) {
        return sendBadRequest(error.message);
      }
      throw error;
    }
  })
);
