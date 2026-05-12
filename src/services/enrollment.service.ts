/**
 * Yogshala LMS — Enrollment Service
 * Business logic for enrollment management and progress tracking.
 */

import { EnrollmentRepository } from "@/repositories/enrollment.repository";
import { PAGINATION } from "@/constants";

export class EnrollmentService {
  /**
   * Get enrolled courses for a student.
   */
  static async getMyEnrollments(
    studentId: string,
    page: number = PAGINATION.DEFAULT_PAGE,
    limit: number = PAGINATION.DEFAULT_LIMIT
  ) {
    const { enrollments, total } =
      await EnrollmentRepository.findByStudent(studentId, page, limit);

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

  /**
   * Get a single enrollment by ID (with validation that it belongs to the student).
   */
  static async getEnrollmentById(enrollmentId: string, studentId: string) {
    const enrollment = await EnrollmentRepository.findById(enrollmentId);

    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    // Verify ownership
    if (enrollment.student.toString() !== studentId) {
      throw new Error("You do not have access to this enrollment");
    }

    return enrollment;
  }

  /**
   * Update enrollment progress.
   */
  static async updateProgress(
    enrollmentId: string,
    progressPercentage: number
  ) {
    const completed = progressPercentage >= 100;

    return EnrollmentRepository.updateById(enrollmentId, {
      progressPercentage: Math.min(progressPercentage, 100),
      completed,
    });
  }
}

export default EnrollmentService;
