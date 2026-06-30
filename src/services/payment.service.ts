/**
 * Yogshala LMS — Payment Service
 * Business logic for Razorpay order creation, payment verification,
 * and webhook processing.
 */

import crypto from "crypto";
import { randomUUID } from "crypto";
import razorpay from "@/config/razorpay";
import {
  PaymentRepository,
  isMongoDuplicateKeyError,
} from "@/repositories/payment.repository";
import { EnrollmentRepository } from "@/repositories/enrollment.repository";
import { CourseRepository } from "@/repositories/course.repository";
import { UserRepository } from "@/repositories/user.repository";
import { NotificationRepository } from "@/repositories/notification.repository";
import { AuthService } from "@/services/auth.service";
import { PaymentStatus, DEFAULT_CURRENCY, PAYMENT, CalendarSyncStatus } from "@/constants";
import type { IPayment, IPaymentCheckoutPayload } from "@/types";

export interface CreateOrderResult {
  checkout: IPaymentCheckoutPayload & { paymentId: string; keyId: string };
  payment: IPayment;
  reused: boolean;
}

export class PaymentService {
  private static buildCheckoutResponse(
    payment: IPayment,
    order?: { id: string; amount: number; currency: string }
  ): IPaymentCheckoutPayload & { paymentId: string; keyId: string } {
    const payload = payment.checkoutPayload;
    const orderId = payload?.orderId ?? order?.id ?? payment.razorpayOrderId;
    const amount = payload?.amount ?? order?.amount ?? payment.amount * 100;
    const currency = payload?.currency ?? order?.currency ?? payment.currency;

    if (!orderId) {
      throw new Error("Checkout session is not ready yet");
    }

    return {
      orderId,
      amount,
      currency,
      paymentId: payment._id.toString(),
      keyId: process.env.RAZORPAY_KEY_ID!,
    };
  }

  private static getPaymentExpiry(): Date {
    return new Date(Date.now() + PAYMENT.ORDER_EXPIRY_MINS * 60_000);
  }

  private static resolveCourseAmount(course: {
    price: number;
    discountPrice?: number;
  }): number {
    return course.discountPrice ?? course.price;
  }

  /**
   * Layer 1 + 2 + 3: Create or reuse a Razorpay order for a course purchase.
   */
  static async createOrder(
    userId: string,
    courseId: string,
    idempotencyKey: string
  ): Promise<CreateOrderResult> {
    const isComplete = await AuthService.isProfileComplete(userId);
    if (!isComplete) {
      throw new Error(
        "PROFILE_INCOMPLETE: Please complete your profile before purchasing"
      );
    }

    const course = await CourseRepository.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    if (!course.isPublished) {
      throw new Error("This course is not available for purchase");
    }

    const existingEnrollment =
      await EnrollmentRepository.findByStudentAndCourse(userId, courseId);
    if (
      existingEnrollment &&
      existingEnrollment.paymentStatus === PaymentStatus.PAID
    ) {
      throw new Error("You are already enrolled in this course");
    }

    const amount = this.resolveCourseAmount(course);
    const amountInPaise = Math.round(amount * 100);
    if (amountInPaise < 100) {
      throw new Error("Amount must be at least 100 paise");
    }

    // Layer 1: replay cached response for the same idempotency key
    const byKey = await PaymentRepository.findByIdempotencyKey(idempotencyKey);
    if (byKey) {
      if (byKey.user.toString() !== userId) {
        throw new Error("Idempotency key belongs to another user");
      }
      if (byKey.course.toString() !== courseId) {
        throw new Error("Idempotency key belongs to another course");
      }
      if (byKey.razorpayOrderId && byKey.checkoutPayload) {
        return {
          checkout: this.buildCheckoutResponse(byKey),
          payment: byKey,
          reused: true,
        };
      }
    }

    await PaymentRepository.expireStalePending(userId, courseId);

    // Layer 2: reuse active pending checkout for same user+course
    const activePending =
      await PaymentRepository.findActivePendingByUserAndCourse(
        userId,
        courseId
      );
    if (activePending?.razorpayOrderId && activePending.checkoutPayload) {
      return {
        checkout: this.buildCheckoutResponse(activePending),
        payment: activePending,
        reused: true,
      };
    }

    const internalOrderId = randomUUID();
    const paymentExpiry = this.getPaymentExpiry();

    let payment: IPayment;
    try {
      payment = await PaymentRepository.create({
        user: userId as unknown as IPayment["user"],
        course: courseId as unknown as IPayment["course"],
        internalOrderId,
        idempotencyKey,
        amount,
        currency: DEFAULT_CURRENCY,
        paymentStatus: PaymentStatus.PENDING,
        paymentExpiry,
      });
    } catch (error) {
      if (!isMongoDuplicateKeyError(error)) {
        throw error;
      }

      // Layer 3: race lost — return the winner's pending checkout
      const winner =
        (await PaymentRepository.findByIdempotencyKey(idempotencyKey)) ??
        (await PaymentRepository.findActivePendingByUserAndCourse(
          userId,
          courseId
        ));

      if (winner?.razorpayOrderId && winner.checkoutPayload) {
        return {
          checkout: this.buildCheckoutResponse(winner),
          payment: winner,
          reused: true,
        };
      }

      throw new Error(
        "A checkout is already in progress. Please wait a moment and try again."
      );
    }

    try {
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: DEFAULT_CURRENCY,
        receipt: internalOrderId,
        notes: {
          internalOrderId,
          userId,
          courseId,
          courseName: course.title,
        },
      });

      const checkoutPayload: IPaymentCheckoutPayload = {
        orderId: order.id,
        amount: Number(order.amount),
        currency: order.currency,
      };

      const updatedPayment = await PaymentRepository.saveCheckoutPayload(
        payment._id.toString(),
        order.id,
        checkoutPayload
      );

      if (!updatedPayment) {
        throw new Error("Failed to save checkout session");
      }

      return {
        checkout: this.buildCheckoutResponse(updatedPayment, {
          id: order.id,
          amount: Number(order.amount),
          currency: order.currency,
        }),
        payment: updatedPayment,
        reused: false,
      };
    } catch (error) {
      await PaymentRepository.updateById(payment._id.toString(), {
        paymentStatus: PaymentStatus.FAILED,
      });
      throw error;
    }
  }

  /**
   * Grant course access after successful payment.
   */
  private static async fulfillEnrollment(
    payment: IPayment,
    notify: boolean
  ): Promise<void> {
    const userId = payment.user.toString();
    const courseId = payment.course.toString();

    const existingEnrollment =
      await EnrollmentRepository.findByStudentAndCourse(userId, courseId);

    if (!existingEnrollment) {
      try {
        await EnrollmentRepository.create({
          student: payment.user,
          course: payment.course,
          paymentStatus: PaymentStatus.PAID,
          calendarSyncStatus: CalendarSyncStatus.PENDING,
          enrolledAt: new Date(),
        });
      } catch (error) {
        if (!isMongoDuplicateKeyError(error)) {
          throw error;
        }
      }
    }

    await UserRepository.updateById(userId, {
      $addToSet: { purchasedCourses: payment.course },
    });

    if (notify) {
      await NotificationRepository.create({
        user: payment.user,
        title: "Payment Successful",
        message:
          "Your payment has been verified and you are now enrolled in the course.",
      });
    }
  }

  /**
   * Verify Razorpay payment signature and create enrollment.
   */
  static async verifyPayment(
    userId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<IPayment> {
    const payment = await PaymentRepository.findByOrderId(razorpayOrderId);
    if (!payment) {
      throw new Error("Payment record not found");
    }

    if (payment.user.toString() !== userId) {
      throw new Error("Payment does not belong to this user");
    }

    if (payment.paymentStatus === PaymentStatus.PAID) {
      return payment;
    }

    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      await PaymentRepository.updateByOrderId(razorpayOrderId, {
        paymentStatus: PaymentStatus.FAILED,
      });
      throw new Error("Payment verification failed: Invalid signature");
    }

    const updatedPayment =
      (await PaymentRepository.atomicMarkPaid(razorpayOrderId, userId, {
        razorpayPaymentId,
        razorpaySignature,
      })) ??
      (await PaymentRepository.findByOrderId(razorpayOrderId));

    if (!updatedPayment || updatedPayment.paymentStatus !== PaymentStatus.PAID) {
      throw new Error("Payment could not be confirmed");
    }

    await this.fulfillEnrollment(updatedPayment, true);
    return updatedPayment;
  }

  /**
   * Process Razorpay webhook event.
   * Handles payment.captured and payment.failed events.
   */
  static async processWebhook(
    payload: string,
    signature: string
  ): Promise<void> {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(payload)
      .digest("hex");

    if (expectedSignature !== signature) {
      throw new Error("Invalid webhook signature");
    }

    const event = JSON.parse(payload);
    const { event: eventType, payload: eventPayload } = event;

    if (eventType === "payment.captured") {
      const {
        payment: { entity },
      } = eventPayload;
      const orderId = entity.order_id;

      const existingPayment = await PaymentRepository.findByOrderId(orderId);
      if (!existingPayment) {
        return;
      }

      if (existingPayment.paymentStatus === PaymentStatus.PAID) {
        return;
      }

      await PaymentRepository.updateByOrderId(orderId, {
        razorpayPaymentId: entity.id,
        paymentStatus: PaymentStatus.PAID,
      });

      const payment = await PaymentRepository.findByOrderId(orderId);
      if (payment) {
        await this.fulfillEnrollment(payment, false);
      }
    } else if (eventType === "payment.failed") {
      const {
        payment: { entity },
      } = eventPayload;
      const orderId = entity.order_id;

      const existingPayment = await PaymentRepository.findByOrderId(orderId);
      if (existingPayment?.paymentStatus === PaymentStatus.PAID) {
        return;
      }

      await PaymentRepository.updateByOrderId(orderId, {
        paymentStatus: PaymentStatus.FAILED,
      });
    }
  }
}

export default PaymentService;
