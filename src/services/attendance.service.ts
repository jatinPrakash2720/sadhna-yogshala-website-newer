/**
 * Yogshala LMS — Attendance Service
 * Business logic for attendance tracking.
 */

import { AttendanceRepository } from "@/repositories/attendance.repository";
import type { IAttendance } from "@/types";

export class AttendanceService {
  /**
   * Record or update attendance for a student in a class session.
   */
  static async recordAttendance(
    studentId: string,
    classSessionId: string,
    attended: boolean
  ): Promise<IAttendance> {
    return AttendanceRepository.upsert(studentId, classSessionId, attended);
  }

  /**
   * Get attendance records for a student.
   */
  static async getStudentAttendance(
    studentId: string
  ): Promise<IAttendance[]> {
    return AttendanceRepository.findByStudent(studentId);
  }

  /**
   * Get attendance for a specific class session (admin).
   */
  static async getClassAttendance(
    classSessionId: string
  ): Promise<IAttendance[]> {
    return AttendanceRepository.findByClassSession(classSessionId);
  }
}

export default AttendanceService;
