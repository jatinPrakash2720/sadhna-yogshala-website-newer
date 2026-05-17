/**
 * Yogshala LMS — Admin Service
 * Business logic for admin dashboard, user management, and reports.
 */

import { UserRepository } from "@/repositories/user.repository";
import { CourseRepository } from "@/repositories/course.repository";
import { EnrollmentRepository } from "@/repositories/enrollment.repository";
import { PaymentRepository } from "@/repositories/payment.repository";
import { UserRole, UserStatus, PaymentStatus } from "@/constants";
import type { DashboardStats, IUser } from "@/types";

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
   * List all users (paginated) with optional search and role filter.
   */
  static async listUsers(
    page: number = 1,
    limit: number = 10,
    search?: string,
    role?: UserRole
  ) {
    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      filter.role = role;
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
   * Promote or demote a user's role.
   *
   * Safety rules:
   * - Admin cannot change their own role
   * - If demoting an admin → ensure at least 1 other admin remains
   */
  static async updateUserRole(
    targetUserId: string,
    newRole: UserRole,
    requestingAdminId: string
  ): Promise<IUser | null> {
    // Rule: Admin cannot change their own role via this endpoint
    if (targetUserId === requestingAdminId) {
      throw new Error(
        "Cannot change your own role. Ask another admin to do this."
      );
    }

    // Fetch target user
    const targetUser = await UserRepository.findById(targetUserId);
    if (!targetUser) return null;

    // Rule: If demoting an admin, ensure we're not removing the last one
    if (
      targetUser.role === UserRole.ADMIN &&
      newRole === UserRole.STUDENT
    ) {
      const adminCount = await UserRepository.count({ role: UserRole.ADMIN });
      if (adminCount <= 1) {
        throw new Error(
          "Cannot demote the only admin. Promote another user to admin first."
        );
      }
    }

    // No-op if role is already the same
    if (targetUser.role === newRole) {
      return targetUser;
    }

    // Update the role
    const updatedUser = await UserRepository.updateById(targetUserId, {
      role: newRole,
    });

    return updatedUser;
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
