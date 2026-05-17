/**
 * Yogshala LMS — Payment Service
 * Business logic for Razorpay order creation, payment verification,
 * and webhook processing.
 */

import crypto from "crypto";
import razorpay from "@/config/razorpay";
import { PaymentRepository } from "@/repositories/payment.repository";
import { EnrollmentRepository } from "@/repositories/enrollment.repository";
import { CourseRepository } from "@/repositories/course.repository";
import { UserRepository } from "@/repositories/user.repository";
import { NotificationRepository } from "@/repositories/notification.repository";
import { AuthService } from "@/services/auth.service";
import { PaymentStatus, DEFAULT_CURRENCY } from "@/constants";
import type { IPayment } from "@/types";

export class PaymentService {
  /**
   * Create a Razorpay order for a course purchase.
   * Validates: course exists, user profile complete, not already enrolled.
   */
  static async createOrder(
    userId: string,
    courseId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<{ order: any; payment: IPayment }> {
    // 1. Check profile completeness
    const isComplete = await AuthService.isProfileComplete(userId);
    if (!isComplete) {
      throw new Error(
        "PROFILE_INCOMPLETE: Please complete your profile before purchasing"
      );
    }

    // 2. Find the course
    const course = await CourseRepository.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    if (!course.isPublished) {
      throw new Error("This course is not available for purchase");
    }

    // 3. Check for duplicate enrollment
    const existingEnrollment =
      await EnrollmentRepository.findByStudentAndCourse(userId, courseId);
    if (existingEnrollment && existingEnrollment.paymentStatus === PaymentStatus.PAID) {
      throw new Error("You are already enrolled in this course");
    }

    // 4. Create Razorpay order
    const amountInPaise = Math.round(course.price * 100);
    if (amountInPaise < 100) {
      throw new Error("Amount must be at least 100 paise");
    }

    const orderOptions = {
      amount: amountInPaise, // Amount in paise
      currency: DEFAULT_CURRENCY,
      receipt: `rcpt_${Date.now()}_${userId.toString().slice(-6)}`,
      notes: {
        userId,
        courseId,
        courseName: course.title,
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    // 5. Save payment record (pending)
    const payment = await PaymentRepository.create({
      user: userId as unknown as IPayment["user"],
      course: courseId as unknown as IPayment["course"],
      razorpayOrderId: order.id,
      amount: course.price,
      currency: DEFAULT_CURRENCY,
      paymentStatus: PaymentStatus.PENDING,
    });

    return { order, payment };
  }

  /**
   * Verify Razorpay payment signature and create enrollment.
   */
  static async verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<IPayment> {
    // 1. Find the pending payment
    const payment = await PaymentRepository.findByOrderId(razorpayOrderId);
    if (!payment) {
      throw new Error("Payment record not found");
    }

    if (payment.paymentStatus === PaymentStatus.PAID) {
      throw new Error("Payment already verified");
    }

    // 2. Verify signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      // Mark as failed
      await PaymentRepository.updateByOrderId(razorpayOrderId, {
        paymentStatus: PaymentStatus.FAILED,
      });
      throw new Error("Payment verification failed: Invalid signature");
    }

    // 3. Update payment record
    const updatedPayment = await PaymentRepository.updateByOrderId(
      razorpayOrderId,
      {
        razorpayPaymentId,
        razorpaySignature,
        paymentStatus: PaymentStatus.PAID,
      }
    );

    // 4. Create enrollment
    await EnrollmentRepository.create({
      student: payment.user,
      course: payment.course,
      paymentStatus: PaymentStatus.PAID,
      enrolledAt: new Date(),
    });

    // 5. Add course to user's purchasedCourses
    await UserRepository.updateById(payment.user.toString(), {
      $addToSet: { purchasedCourses: payment.course },
    });

    // 6. Send notification
    await NotificationRepository.create({
      user: payment.user,
      title: "Payment Successful",
      message: "Your payment has been verified and you are now enrolled in the course.",
    });

    return updatedPayment!;
  }

  /**
   * Process Razorpay webhook event.
   * Handles payment.captured and payment.failed events.
   */
  static async processWebhook(
    payload: string,
    signature: string
  ): Promise<void> {
    // Verify webhook signature
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
      const { payment: { entity } } = eventPayload;
      const orderId = entity.order_id;

      // Check if already processed (idempotency)
      const existingPayment = await PaymentRepository.findByOrderId(orderId);
      if (existingPayment?.paymentStatus === PaymentStatus.PAID) {
        return; // Already processed
      }

      // Update payment
      if (existingPayment) {
        await PaymentRepository.updateByOrderId(orderId, {
          razorpayPaymentId: entity.id,
          paymentStatus: PaymentStatus.PAID,
        });

        // Create enrollment if not exists
        const existingEnrollment =
          await EnrollmentRepository.findByStudentAndCourse(
            existingPayment.user.toString(),
            existingPayment.course.toString()
          );

        if (!existingEnrollment) {
          await EnrollmentRepository.create({
            student: existingPayment.user,
            course: existingPayment.course,
            paymentStatus: PaymentStatus.PAID,
            enrolledAt: new Date(),
          });

          await UserRepository.updateById(
            existingPayment.user.toString(),
            {
              $addToSet: { purchasedCourses: existingPayment.course },
            }
          );
        }
      }
    } else if (eventType === "payment.failed") {
      const { payment: { entity } } = eventPayload;
      const orderId = entity.order_id;

      await PaymentRepository.updateByOrderId(orderId, {
        paymentStatus: PaymentStatus.FAILED,
      });
    }
  }
}

export default PaymentService;
