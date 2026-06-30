/**
 * Yogshala LMS — TypeScript Type Definitions
 * Shared interfaces and types used across the backend.
 */

import { Document, Types } from "mongoose";
import {
  UserRole,
  AuthProvider,
  UserStatus,
  Gender,
  BatchType,
  MeetingPlatform,
  PaymentStatus,
  ClassStatus,
  CalendarSyncStatus,
  ClassSessionSource,
} from "@/constants";

// ─── Base Document Interface ─────────────────────────────
export interface IBaseDocument extends Document {
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
  bio?: string;
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

// ─── Media Assets ───────────────────────────────────────
export interface IMediaAsset {
  url: string;
  public_id: string;
}

export interface IVideoAsset {
  url: string;
  public_id: string;
  thumbnail: string;
  duration: number;
}

// ─── Instructor ─────────────────────────────────────────
export interface IInstructor {
  name: string;
  title?: string;
  bio?: string;
  image?: IMediaAsset;
}

// ─── Curriculum ──────────────────────────────────────────
export interface ICurriculumLesson {
  _id?: Types.ObjectId | string;
  title: string;
  duration: number; // minutes
  isPreview: boolean;
}

export interface ICurriculumSection {
  _id?: Types.ObjectId | string;
  sectionTitle: string;
  lessons: ICurriculumLesson[];
}

// ─── SEO ─────────────────────────────────────────────────
export interface ISEOSettings {
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  keywords?: string[];
}

// ─── Course Schedule ─────────────────────────────────────
export interface IScheduledSession {
  scheduledDate: string;
  startTime: string;
  endTime: string;
  slotKey?: string;
}

// ─── Course ──────────────────────────────────────────────
export interface ICourse extends IBaseDocument {
  // Core info
  title: string;
  slug: string;
  shortDescription?: string;
  description: string;
  category?: string;
  level?: string;
  language?: string;

  // Media
  thumbnail?: IMediaAsset;
  gallery?: IMediaAsset[];
  introVideo?: IVideoAsset;

  // Instructor
  instructor?: IInstructor;
  instructorName?: string; // legacy field

  // Pricing & batch
  price: number;
  discountPrice?: number;
  durationInMonths: number;
  batchType: BatchType;
  startDate: Date;
  endDate: Date;
  totalClasses: number;
  meetingPlatform: MeetingPlatform;

  // Live class schedule (used to auto-generate ClassSessions)
  classDays: number[];
  classStartTime: string;
  classEndTime: string;
  calendarLinksGenerated: boolean;
  calendarLinksGeneratedAt?: Date;
  instructorUser?: Types.ObjectId;
  scheduledSessions?: IScheduledSession[];

  // Curriculum
  curriculum?: ICurriculumSection[];

  // SEO
  seo?: ISEOSettings;

  // Publishing
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
  calendarSyncStatus: CalendarSyncStatus;
  calendarSyncError?: string;
  calendarSyncedAt?: Date;
}

// ─── Payment ─────────────────────────────────────────────
export interface IPaymentCheckoutPayload {
  orderId: string;
  amount: number;
  currency: string;
}

export interface IPayment extends IBaseDocument {
  user: Types.ObjectId;
  course: Types.ObjectId;
  internalOrderId: string;
  idempotencyKey?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentExpiry: Date;
  checkoutPayload?: IPaymentCheckoutPayload;
}

// ─── Class Session ───────────────────────────────────────
export interface IClassSession extends IBaseDocument {
  course: Types.ObjectId;
  title: string;
  meetingLink?: string;
  googleEventId?: string;
  scheduledDate: Date;
  startTime: string;
  endTime: string;
  status: ClassStatus;
  source?: ClassSessionSource;
  sessionNumber?: number;
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

// ─── Course Builder Form Types ───────────────────────────
export interface CourseFormLesson {
  id: string;
  title: string;
  duration: number;
  isPreview: boolean;
}

export interface CourseFormSection {
  id: string;
  sectionTitle: string;
  lessons: CourseFormLesson[];
}

export interface CourseFormData {
  // Basic info
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  level: string;
  language: string;

  // Pricing & batch
  price: number;
  discountPrice?: number;
  durationInMonths: number;
  totalClasses: number;
  batchType: string;
  meetingPlatform: string;
  startDate: string;
  endDate: string;
  classDays: number[];
  classStartTime: string;
  classEndTime: string;

  scheduledSessions: IScheduledSession[];

  // Instructor
  instructorUserId: string;
  instructorName: string;
  instructorTitle: string;
  instructorBio: string;

  // Media (Assets from Cloudinary)
  thumbnail?: IMediaAsset;
  introVideo?: IVideoAsset;
  gallery?: IMediaAsset[];

  // Curriculum
  curriculum: CourseFormSection[];

  // SEO
  metaTitle: string;
  metaDescription: string;
  seoSlug: string;
  keywords: string[];

  // Publishing
  isPublished: boolean;
  calendarLinksGenerated?: boolean;
}


