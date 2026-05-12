/**
 * Yogshala LMS — TypeScript Type Definitions
 * Shared interfaces and types used across the backend.
 */

import { Types } from "mongoose";
import {
  UserRole,
  AuthProvider,
  UserStatus,
  Gender,
  BatchType,
  MeetingPlatform,
  PaymentStatus,
  ClassStatus,
} from "@/constants";

// ─── Base Document Interface ─────────────────────────────
export interface IBaseDocument {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ─── User ────────────────────────────────────────────────
export interface IUser extends IBaseDocument {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: UserRole;
  authProvider: AuthProvider;
  image?: string;
  isVerified: boolean;
  profileCompleted: boolean;
  purchasedCourses: Types.ObjectId[];
  dob?: Date;
  gender?: Gender;
  emergencyContact?: string;
  healthConditions?: string;
  status: UserStatus;
  lastLogin?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  // Schema method
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ─── Course ──────────────────────────────────────────────
export interface ICourse extends IBaseDocument {
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  price: number;
  durationInMonths: number;
  batchType: BatchType;
  startDate: Date;
  endDate: Date;
  totalClasses: number;
  instructorName: string;
  meetingPlatform: MeetingPlatform;
  isPublished: boolean;
}

// ─── Enrollment ──────────────────────────────────────────
export interface IEnrollment extends IBaseDocument {
  student: Types.ObjectId;
  course: Types.ObjectId;
  progressPercentage: number;
  paymentStatus: PaymentStatus;
  completed: boolean;
  enrolledAt: Date;
}

// ─── Payment ─────────────────────────────────────────────
export interface IPayment extends IBaseDocument {
  user: Types.ObjectId;
  course: Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  paymentStatus: PaymentStatus;
}

// ─── Class Session ───────────────────────────────────────
export interface IClassSession extends IBaseDocument {
  course: Types.ObjectId;
  title: string;
  meetingLink?: string;
  scheduledDate: Date;
  startTime: string;
  endTime: string;
  status: ClassStatus;
}

// ─── Attendance ──────────────────────────────────────────
export interface IAttendance extends IBaseDocument {
  student: Types.ObjectId;
  classSession: Types.ObjectId;
  attended: boolean;
}

// ─── Notification ────────────────────────────────────────
export interface INotification extends IBaseDocument {
  user: Types.ObjectId;
  title: string;
  message: string;
  isRead: boolean;
}

// ─── API Response Types ──────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]> | string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ─── Auth Types ──────────────────────────────────────────
export interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
  profileCompleted: boolean;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  profileCompleted: boolean;
}

// ─── Request Types ───────────────────────────────────────
export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  gender?: Gender;
  dob?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CompleteProfileRequest {
  phone: string;
  password: string;
  dob?: string;
  gender?: Gender;
  emergencyContact?: string;
  healthConditions?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  thumbnail?: string;
  price: number;
  durationInMonths: number;
  batchType: BatchType;
  startDate: string;
  endDate: string;
  totalClasses: number;
  instructorName: string;
  meetingPlatform: MeetingPlatform;
  isPublished?: boolean;
}

export interface CourseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  batchType?: BatchType;
  meetingPlatform?: MeetingPlatform;
  isPublished?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
}

export interface CreateOrderRequest {
  courseId: string;
}

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface CreateClassRequest {
  courseId: string;
  title: string;
  meetingLink?: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
}

// ─── Dashboard Stats ─────────────────────────────────────
export interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  activeStudents: number;
  recentPayments: IPayment[];
}
