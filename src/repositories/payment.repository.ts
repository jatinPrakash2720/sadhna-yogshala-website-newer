/**
 * Yogshala LMS — Payment Repository
 * Data access layer for Payment model operations.
 */

import Payment from "@/models/Payment.model";
import { connectToDatabase } from "@/config/database";
import type { IPayment } from "@/types";
import mongoose from "mongoose";

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
   * Find payment by Razorpay order ID.
   */
  static async findByOrderId(orderId: string): Promise<IPayment | null> {
    await this.connect();
    return Payment.findOne({ razorpayOrderId: orderId }).lean<IPayment>();
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
