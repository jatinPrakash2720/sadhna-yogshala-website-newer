"use client";

/**
 * Yogshala LMS — Live Course Preview Card
 * Reusable card showing course as students see it in the catalog.
 */

import { motion } from "framer-motion";
import { Star, Clock, Users, BookOpen, Play, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, formatDate } from "@/lib/utils";
import { useCourseBuilderStore } from "@/store/courseBuilderStore";

interface LivePreviewCardProps {
  compact?: boolean;
}

export default function LivePreviewCard({ compact = false }: LivePreviewCardProps) {
  const { courseData, thumbnailPreview } = useCourseBuilderStore();

  const title = courseData.title || "Course Title";
  const shortDesc = courseData.shortDescription || "A brief description of the course will appear here.";
  const price = Number(courseData.price) || 0;
  const discountPrice = courseData.discountPrice ? Number(courseData.discountPrice) : undefined;
  const instructor = courseData.instructorName || "Instructor Name";
  const totalClasses = courseData.totalClasses || 0;
  const durationInMonths = courseData.durationInMonths || 0;
  const batchType = courseData.batchType || "";
  const level = courseData.level || "";
  const tags = courseData.tags ?? [];

  const discountPercent = discountPrice && price > discountPrice
    ? Math.round(((price - discountPrice) / price) * 100)
    : null;

  const thumbnailSrc = thumbnailPreview?.url || null;

  return (
    <motion.div
      layout
      className={cn(
        "bg-white rounded-2xl border border-cream-200 shadow-card overflow-hidden",
        compact ? "max-w-xs" : "w-full"
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-brand-900 to-brand-600 overflow-hidden">
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/40">
            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="text-xs">Thumbnail Preview</span>
          </div>
        )}
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
          <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play className="h-5 w-5 text-white fill-white" />
          </div>
        </div>
        {/* Discount badge */}
        {discountPercent && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            {discountPercent}% OFF
          </div>
        )}
        {/* Batch badge */}
        {batchType && (
          <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-lg capitalize">
            {batchType}
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 space-y-3">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[10px] font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full"
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className={cn(
          "font-bold text-gray-900 line-clamp-2 leading-tight",
          compact ? "text-sm" : "text-base"
        )}>
          {title}
        </h3>

        {/* Short description */}
        {!compact && (
          <p className="text-xs text-sage-500 line-clamp-2">{shortDesc}</p>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-sage-500">
          {totalClasses > 0 && (
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {totalClasses} classes
            </span>
          )}
          {durationInMonths > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {durationInMonths} mo
            </span>
          )}
          {level && (
            <span className="flex items-center gap-1 capitalize">
              <Users className="h-3 w-3" />
              {level}
            </span>
          )}
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-brand-700">
              {instructor[0]?.toUpperCase() || "I"}
            </span>
          </div>
          <span className="text-xs text-sage-600 truncate">{instructor}</span>
          <div className="ml-auto flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={cn("h-3 w-3", i < 4 ? "text-gold-400 fill-gold-400" : "text-cream-300 fill-cream-300")} />
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between pt-1 border-t border-cream-100">
          <div className="flex items-baseline gap-2">
            <span className={cn(
              "font-bold text-gray-900",
              compact ? "text-base" : "text-lg"
            )}>
              {formatPrice(discountPrice ?? price)}
            </span>
            {discountPrice && price > discountPrice && (
              <span className="text-xs text-sage-400 line-through">
                {formatPrice(price)}
              </span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-xs font-semibold text-white bg-brand-600 px-3 py-1.5 rounded-lg hover:bg-brand-700 transition-colors"
          >
            Enroll Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
