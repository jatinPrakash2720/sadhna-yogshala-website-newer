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
  GOOGLE_MEET = "google-meet",
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

// ─── Calendar Sync Status ──────────────────────────────────
export enum CalendarSyncStatus {
  PENDING = "PENDING",
  SYNCED = "SYNCED",
  FAILED = "FAILED",
}

// ─── Google Calendar ─────────────────────────────────────
export const GOOGLE_CALENDAR = {
  TIMEZONE: "Asia/Kolkata",
  SCOPES: ["https://www.googleapis.com/auth/calendar"],
  MEET_REQUEST_ID_PREFIX: "yogshala-meet-",
  /** Rough seconds per Google Calendar event creation */
  SECONDS_PER_EVENT: 1.5,
} as const;

// ─── Class Session Source ──────────────────────────────────
export enum ClassSessionSource {
  COURSE_SCHEDULE = "course-schedule",
  MANUAL = "manual",
}

/** Weekday index: 0 = Sunday … 6 = Saturday */
export const CLASS_WEEKDAYS = [
  { value: 0, label: "Sun", short: "S" },
  { value: 1, label: "Mon", short: "M" },
  { value: 2, label: "Tue", short: "T" },
  { value: 3, label: "Wed", short: "W" },
  { value: 4, label: "Thu", short: "T" },
  { value: 5, label: "Fri", short: "F" },
  { value: 6, label: "Sat", short: "S" },
] as const;

/** All seven weekdays (Sun=0 … Sat=6) */
export const ALL_CLASS_DAYS = [0, 1, 2, 3, 4, 5, 6] as const;

export const BATCH_TIME_DEFAULTS: Record<
  BatchType,
  { classStartTime: string; classEndTime: string }
> = {
  [BatchType.MORNING]: { classStartTime: "07:00", classEndTime: "08:00" },
  [BatchType.AFTERNOON]: { classStartTime: "14:00", classEndTime: "15:00" },
  [BatchType.EVENING]: { classStartTime: "19:00", classEndTime: "20:00" },
};

/** Fixed slots shown inside each date block on the schedule calendar */
export const COURSE_TIME_SLOTS = [
  { key: "morning", label: "7–8 AM", startTime: "07:00", endTime: "08:00", batchType: BatchType.MORNING },
  { key: "afternoon", label: "2–3 PM", startTime: "14:00", endTime: "15:00", batchType: BatchType.AFTERNOON },
  { key: "evening", label: "7–8 PM", startTime: "19:00", endTime: "20:00", batchType: BatchType.EVENING },
] as const;

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

// ─── Payment ─────────────────────────────────────────────
export const PAYMENT = {
  /** Minutes before a pending checkout session expires */
  ORDER_EXPIRY_MINS: Number(process.env.PAYMENT_ORDER_EXPIRY_MINS) || 15,
  /** HTTP header for client-generated idempotency keys */
  IDEMPOTENCY_HEADER: "Idempotency-Key",
} as const;
