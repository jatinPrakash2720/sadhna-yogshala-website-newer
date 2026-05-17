import type { ICourse } from "@/types";
import type { CourseCard } from "@/types/frontend";

/**
 * Maps a backend ICourse document to a frontend CourseCard interface.
 */
export function mapCourseToCard(course: ICourse): CourseCard {
  return {
    id: course._id.toString(),
    title: course.title,
    slug: course.slug,
    description: course.description,
    instructor: course.instructor?.name || course.instructorName || "Yoga Instructor",
    instructorAvatar: course.instructor?.image?.url || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    thumbnail: course.thumbnail?.url || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    price: course.price,
    originalPrice: course.discountPrice,
    rating: 4.8, // Placeholder until reviews are implemented
    reviewCount: 24, // Placeholder
    enrolledCount: 150, // Placeholder
    duration: 60, // Placeholder in minutes
    level: (course.level as "beginner" | "intermediate" | "advanced") || "beginner",
    category: course.category || "Yoga",
    isLive: course.meetingPlatform === "zoom" || course.meetingPlatform === "google-meet",
    isFeatured: true,
    tags: course.tags,
  };
}
