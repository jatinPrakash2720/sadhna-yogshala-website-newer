export interface CourseCard {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  duration: number; // in minutes
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  isLive: boolean;
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  courseCount: number;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  role: string;
  rating: number;
  text: string;
  course: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface EnrollmentCard {
  id: string;
  course: CourseCard;
  enrolledAt: string;
  progress: number;
  completedSessions: number;
  totalSessions: number;
}

export interface ClassCard {
  id: string;
  title: string;
  courseTitle: string;
  instructor: string;
  scheduledAt: string;
  duration: number;
  meetLink?: string;
  status: "upcoming" | "live" | "completed" | "cancelled";
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
}

export interface AdminStat {
  label: string;
  value: string | number;
  change: number;
  icon: string;
  trend: "up" | "down";
}
