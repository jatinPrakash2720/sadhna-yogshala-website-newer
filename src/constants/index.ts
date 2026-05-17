/**
 * Yogshala LMS — Application Constants & Enums
 * Centralized constants used across the entire backend.
 */

// ─── User Role ───────────────────────────────────────────
export enum UserRole {
  STUDENT = "student",
  ADMIN = "admin",
}

// ─── Auth Provider ───────────────────────────────────────
export enum AuthProvider {
  MANUAL = "manual",
  GOOGLE = "google",
}

// ─── User Status ─────────────────────────────────────────
export enum UserStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
  SUSPENDED = "suspended",
}

// ─── Gender ──────────────────────────────────────────────
export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
  PREFER_NOT_TO_SAY = "prefer_not_to_say",
}

// ─── Batch Type ──────────────────────────────────────────
export enum BatchType {
  MORNING = "morning",
  AFTERNOON = "afternoon",
  EVENING = "evening",
}

// ─── Meeting Platform ────────────────────────────────────
export enum MeetingPlatform {
  ZOOM = "zoom",
  GOOGLE_MEET = "google-meet",
  TEAMS = "teams",
  OTHER = "other",
}

// ─── Workshop Mode ───────────────────────────────────────
export enum WorkshopMode {
  ONLINE = "online",
  OFFLINE = "offline",
  HYBRID = "hybrid",
}

// ─── Workshop Enrollment Status ─────────────────────────
export enum WorkshopEnrollmentStatus {
  ENROLLED = "enrolled",
  WAITLISTED = "waitlisted",
  CANCELLED = "cancelled",
}

// ─── Payment Status ──────────────────────────────────────
export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

// ─── Class Session Status ────────────────────────────────
export enum ClassStatus {
  UPCOMING = "upcoming",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

// ─── HTTP Status Codes ───────────────────────────────────
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ─── Pagination Defaults ─────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// ─── Auth Constants ──────────────────────────────────────
export const AUTH = {
  SALT_ROUNDS: 12,
  JWT_EXPIRES_IN: "7d",
  RESET_TOKEN_EXPIRES_HOURS: 1,
  SESSION_MAX_AGE: 7 * 24 * 60 * 60, // 7 days in seconds
  COOKIE_NAME: "yogshala-session",
} as const;

// ─── Password Validation ────────────────────────────────
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const PASSWORD_REQUIREMENTS =
  "Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)";

// ─── Phone Validation ────────────────────────────────────
export const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

// ─── Currency ────────────────────────────────────────────
export const DEFAULT_CURRENCY = "INR";
