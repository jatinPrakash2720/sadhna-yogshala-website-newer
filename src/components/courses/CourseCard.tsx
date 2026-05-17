"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Star, Users, PlayCircle, Signal } from "lucide-react";
import type { CourseCard as CourseCardType } from "@/types/frontend";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDuration } from "@/lib/utils";

interface CourseCardProps {
  course: CourseCardType;
  index?: number;
}

export default function CourseCard({ course, index = 0 }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-cream-200 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative h-56 w-full overflow-hidden bg-cream-100">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Overlay Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <Badge variant={course.level === "beginner" ? "green" : course.level === "intermediate" ? "gold" : "red"} className="backdrop-blur-md bg-white/90">
            <Signal className="h-3 w-3 mr-1" />
            <span className="capitalize">{course.level}</span>
          </Badge>
          {course.isLive && (
            <Badge variant="red" className="backdrop-blur-md bg-red-500/90 text-white border-none shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse mr-1" />
              LIVE
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-600 mb-3">
          <span>{course.category}</span>
        </div>

        <Link href={`/courses/${course.slug}`} className="group-hover:text-brand-700 transition-colors">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
            {course.title}
          </h3>
        </Link>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative h-6 w-6 rounded-full overflow-hidden bg-cream-200">
            <Image src={course.instructorAvatar} alt={course.instructor} fill className="object-cover" sizes="24px" />
          </div>
          <span className="text-sm text-sage-600 font-medium">{course.instructor}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-sage-500 mb-6 mt-auto">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-brand-400" />
            {formatDuration(course.duration)}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-gold-400 fill-gold-400" />
            <span className="font-medium text-gray-900">{course.rating}</span> ({course.reviewCount})
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-brand-400" />
            {course.enrolledCount}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-cream-100">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">{formatPrice(course.price)}</span>
            {course.originalPrice && (
              <span className="text-xs text-sage-400 line-through decoration-sage-300">
                {formatPrice(course.originalPrice)}
              </span>
            )}
          </div>
          <Link
            href={`/courses/${course.slug}`}
            className="flex items-center justify-center h-10 w-10 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors"
            aria-label="View Course"
          >
            <PlayCircle className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
