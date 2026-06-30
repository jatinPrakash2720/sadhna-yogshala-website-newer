/**
 * Yogshala LMS — Payment Repository
 * Data access layer for Payment model operations.
 */

import Payment from "@/models/Payment.model";
import { connectToDatabase } from "@/config/database";
import { PaymentStatus } from "@/constants";
import type { IPayment, IPaymentCheckoutPayload } from "@/types";
import mongoose from "mongoose";

export function isMongoDuplicateKeyError(error: unknown): boolean {
  return (
    error instanceof mongoose.mongo.MongoServerError &&
    error.code === 11000
  );
}

export class PaymentRepository {
  private static async connect() {
    await connectToDatabase();
  }

  /**
   * Create a payment record.
   */
  static async create(data: Partial<IPayment>): Promise<IPayment> {
    await this.connect();
    const payment = await Payment.create(data);
    return payment.toJSON() as IPayment;
  }

  /**
   * Find payment by MongoDB ID.
   */
  static async findById(id: string): Promise<IPayment | null> {
    await this.connect();
    return Payment.findById(id).lean<IPayment>();
  }

  /**
   * Find payment by Razorpay order ID.
   */
  static async findByOrderId(orderId: string): Promise<IPayment | null> {
    await this.connect();
    return Payment.findOne({ razorpayOrderId: orderId }).lean<IPayment>();
  }

  /**
   * Layer 1: find payment by client idempotency key.
   */
  static async findByIdempotencyKey(
    idempotencyKey: string
  ): Promise<IPayment | null> {
    await this.connect();
    return Payment.findOne({ idempotencyKey }).lean<IPayment>();
  }

  /**
   * Layer 2: find non-expired pending payment for user+course.
   */
  static async findActivePendingByUserAndCourse(
    userId: string,
    courseId: string
  ): Promise<IPayment | null> {
    await this.connect();
    return Payment.findOne({
      user: userId,
      course: courseId,
      paymentStatus: PaymentStatus.PENDING,
      paymentExpiry: { $gt: new Date() },
    }).lean<IPayment>();
  }

  /**
   * Mark expired pending payments as failed so a new checkout can start.
   */
  static async expireStalePending(
    userId: string,
    courseId: string
  ): Promise<void> {
    await this.connect();
    await Payment.updateMany(
      {
        user: userId,
        course: courseId,
        paymentStatus: PaymentStatus.PENDING,
        paymentExpiry: { $lte: new Date() },
      },
      { paymentStatus: PaymentStatus.FAILED }
    );
  }

  /**
   * Update payment by MongoDB ID.
   */
  static async updateById(
    id: string,
    data: mongoose.UpdateQuery<IPayment>
  ): Promise<IPayment | null> {
    await this.connect();
    return Payment.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean<IPayment>();
  }

  /**
   * Update payment by Razorpay order ID.
   */
  static async updateByOrderId(
    orderId: string,
    data: mongoose.UpdateQuery<IPayment>
  ): Promise<IPayment | null> {
    await this.connect();
    return Payment.findOneAndUpdate({ razorpayOrderId: orderId }, data, {
      new: true,
      runValidators: true,
    }).lean<IPayment>();
  }

  /**
   * Layer 3: atomically transition pending → paid (verify idempotency).
   */
  static async atomicMarkPaid(
    razorpayOrderId: string,
    userId: string,
    data: {
      razorpayPaymentId: string;
      razorpaySignature?: string;
    }
  ): Promise<IPayment | null> {
    await this.connect();
    return Payment.findOneAndUpdate(
      {
        razorpayOrderId,
        user: userId,
        paymentStatus: PaymentStatus.PENDING,
      },
      {
        $set: {
          ...data,
          paymentStatus: PaymentStatus.PAID,
        },
      },
      { new: true, runValidators: true }
    ).lean<IPayment>();
  }

  /**
   * Persist Razorpay checkout payload for idempotent replays.
   */
  static async saveCheckoutPayload(
    paymentId: string,
    razorpayOrderId: string,
    checkoutPayload: IPaymentCheckoutPayload
  ): Promise<IPayment | null> {
    return this.updateById(paymentId, {
      razorpayOrderId,
      checkoutPayload,
    });
  }

  /**
   * Find all payments for a user.
   */
  static async findByUser(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ payments: IPayment[]; total: number }> {
    await this.connect();
    const skip = (page - 1) * limit;
    const filter = { user: userId };

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate("course", "title slug price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<IPayment[]>(),
      Payment.countDocuments(filter),
    ]);

    return { payments, total };
  }

  /**
   * Find all payments with pagination.
   */
  static async findAll(
    filter: mongoose.QueryFilter<IPayment> = {},
    page: number = 1,
    limit: number = 10
  ): Promise<{ payments: IPayment[]; total: number }> {
    await this.connect();
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate("user", "name email")
        .populate("course", "title slug price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<IPayment[]>(),
      Payment.countDocuments(filter),
    ]);

    return { payments, total };
  }

  /**
   * Calculate total revenue from paid payments.
   */
  static async getTotalRevenue(): Promise<number> {
    await this.connect();
    const result = await Payment.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    return result[0]?.total || 0;
  }
}

export default PaymentRepository;
