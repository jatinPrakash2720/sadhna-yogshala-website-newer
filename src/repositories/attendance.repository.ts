/**
 * Yogshala LMS — Attendance Repository
 * Data access layer for Attendance model operations.
 */

import Attendance from "@/models/Attendance.model";
import { connectToDatabase } from "@/config/database";
import type { IAttendance } from "@/types";

export class AttendanceRepository {
  private static async connect() {
    await connectToDatabase();
  }

  /**
   * Record attendance for a student in a class session.
   */
  static async upsert(
    studentId: string,
    classSessionId: string,
    attended: boolean
  ): Promise<IAttendance> {
    await this.connect();
    const attendance = await Attendance.findOneAndUpdate(
      { student: studentId, classSession: classSessionId },
      { attended },
      { upsert: true, new: true, runValidators: true }
    ).lean<IAttendance>();
    return attendance!;
  }

  /**
   * Get attendance records for a student.
   */
  static async findByStudent(studentId: string): Promise<IAttendance[]> {
    await this.connect();
    return Attendance.find({ student: studentId })
      .populate("classSession", "title scheduledDate startTime endTime")
      .sort({ createdAt: -1 })
      .lean<IAttendance[]>();
  }

  /**
   * Get attendance for a specific class session.
   */
  static async findByClassSession(
    classSessionId: string
  ): Promise<IAttendance[]> {
    await this.connect();
    return Attendance.find({ classSession: classSessionId })
      .populate("student", "name email image")
      .lean<IAttendance[]>();
  }
}

export default AttendanceRepository;
