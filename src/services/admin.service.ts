/**
 * Yogshala LMS — Admin Service
 * Business logic for admin dashboard, user management, and reports.
 */

import { UserRepository } from "@/repositories/user.repository";
import { CourseRepository } from "@/repositories/course.repository";
import { EnrollmentRepository } from "@/repositories/enrollment.repository";
import { PaymentRepository } from "@/repositories/payment.repository";
import { UserRole, UserStatus, PaymentStatus } from "@/constants";
import type { DashboardStats } from "@/types";

export class AdminService {
  /**
   * Get admin dashboard statistics.
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      activeStudents,
      recentPaymentsData,
    ] = await Promise.all([
      UserRepository.count(),
      CourseRepository.count(),
      EnrollmentRepository.count(),
      PaymentRepository.getTotalRevenue(),
      UserRepository.count({
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
      }),
      PaymentRepository.findAll(
        { paymentStatus: PaymentStatus.PAID },
        1,
        5
      ),
    ]);

    return {
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      activeStudents,
      recentPayments: recentPaymentsData.payments,
    };
  }

  /**
   * List all users (paginated).
   */
  static async listUsers(
    page: number = 1,
    limit: number = 10,
    search?: string
  ) {
    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const { users, total } = await UserRepository.findAll(
      filter,
      page,
      limit
    );

    const totalPages = Math.ceil(total / limit);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * List all payments (paginated).
   */
  static async listPayments(page: number = 1, limit: number = 10) {
    const { payments, total } = await PaymentRepository.findAll(
      {},
      page,
      limit
    );

    const totalPages = Math.ceil(total / limit);

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * List all enrollments (paginated).
   */
  static async listEnrollments(page: number = 1, limit: number = 10) {
    const { enrollments, total } = await EnrollmentRepository.findAll(
      {},
      page,
      limit
    );

    const totalPages = Math.ceil(total / limit);

    return {
      enrollments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }
}

export default AdminService;
