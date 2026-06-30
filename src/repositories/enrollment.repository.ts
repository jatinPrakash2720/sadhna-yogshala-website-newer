/**
 * Yogshala LMS — Enrollment Repository
 * Data access layer for Enrollment model operations.
 */

import Enrollment from "@/models/Enrollment.model";
import { connectToDatabase } from "@/config/database";
import { CalendarSyncStatus, PaymentStatus } from "@/constants";
import type { IEnrollment } from "@/types";
import mongoose from "mongoose";

export class EnrollmentRepository {
  private static async connect() {
    await connectToDatabase();
  }

  /**
   * Find enrollment by ID with populated references.
   */
  static async findById(id: string): Promise<IEnrollment | null> {
    await this.connect();
    return Enrollment.findById(id)
      .populate("student", "name email image")
      .populate("course", "title slug thumbnail price batchType instructorName")
      .lean<IEnrollment>();
  }

  /**
   * Find enrollment by student and course.
   */
  static async findByStudentAndCourse(
    studentId: string,
    courseId: string
  ): Promise<IEnrollment | null> {
    await this.connect();
    return Enrollment.findOne({
      student: studentId,
      course: courseId,
    }).lean<IEnrollment>();
  }

  /**
   * Create a new enrollment.
   */
  static async create(data: Partial<IEnrollment>): Promise<IEnrollment> {
    await this.connect();
    const enrollment = await Enrollment.create(data);
    return enrollment.toJSON() as IEnrollment;
  }

  /**
   * Update an enrollment.
   */
  static async updateById(
    id: string,
    data: mongoose.UpdateQuery<IEnrollment>
  ): Promise<IEnrollment | null> {
    await this.connect();
    return Enrollment.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean<IEnrollment>();
  }

  /**
   * Get all enrollments for a student.
   */
  static async findByStudent(
    studentId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ enrollments: IEnrollment[]; total: number }> {
    await this.connect();
    const skip = (page - 1) * limit;

    const filter = { student: studentId };

    const [enrollments, total] = await Promise.all([
      Enrollment.find(filter)
        .populate("course", "title slug thumbnail price batchType instructorName startDate endDate meetingPlatform")
        .sort({ enrolledAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<IEnrollment[]>(),
      Enrollment.countDocuments(filter),
    ]);

    return { enrollments, total };
  }

  /**
   * Find all enrollments with pagination.
   */
  static async findAll(
    filter: mongoose.QueryFilter<IEnrollment> = {},
    page: number = 1,
    limit: number = 10
  ): Promise<{ enrollments: IEnrollment[]; total: number }> {
    await this.connect();
    const skip = (page - 1) * limit;

    const [enrollments, total] = await Promise.all([
      Enrollment.find(filter)
        .populate("student", "name email image")
        .populate("course", "title slug price")
        .sort({ enrolledAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<IEnrollment[]>(),
      Enrollment.countDocuments(filter),
    ]);

    return { enrollments, total };
  }

  /**
   * Count enrollments.
   */
  static async count(filter: mongoose.QueryFilter<IEnrollment> = {}): Promise<number> {
    await this.connect();
    return Enrollment.countDocuments(filter);
  }

  /**
   * Find paid enrollments pending Google Calendar attendee sync.
   */
  static async findPendingCalendarSyncs(): Promise<IEnrollment[]> {
    await this.connect();
    return Enrollment.find({
      calendarSyncStatus: CalendarSyncStatus.PENDING,
      paymentStatus: PaymentStatus.PAID,
    })
      .populate("student", "name email")
      .populate("course", "title")
      .lean<IEnrollment[]>();
  }

  /**
   * Update calendar sync status for an enrollment.
   */
  static async updateCalendarSyncStatus(
    id: string,
    status: CalendarSyncStatus,
    error?: string
  ): Promise<IEnrollment | null> {
    await this.connect();

    const update: mongoose.UpdateQuery<IEnrollment> = {
      calendarSyncStatus: status,
    };

    if (status === CalendarSyncStatus.SYNCED) {
      update.calendarSyncedAt = new Date();
      update.calendarSyncError = undefined;
    }

    if (status === CalendarSyncStatus.FAILED && error) {
      update.calendarSyncError = error.slice(0, 500);
    }

    return Enrollment.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean<IEnrollment>();
  }
}

export default EnrollmentRepository;
