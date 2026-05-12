/**
 * Yogshala LMS — Razorpay Webhook API
 * POST /api/payments/webhook — Handle Razorpay webhook events.
 *
 * IMPORTANT: This route uses raw body for signature verification.
 * Auth.js session is NOT required — webhooks come from Razorpay servers.
 */

import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/services/payment.service";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Read raw body for signature verification
    const payload = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { success: false, message: "Missing webhook signature" },
        { status: 400 }
      );
    }

    await PaymentService.processWebhook(payload, signature);

    return NextResponse.json(
      { success: true, message: "Webhook processed" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Webhook Error]:", error);

    if (error instanceof Error && error.message === "Invalid webhook signature") {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }

    // Always return 200 to Razorpay to prevent retries for processing errors
    return NextResponse.json(
      { success: true, message: "Acknowledged" },
      { status: 200 }
    );
  }
}
