"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import { mapCourseToCard } from "@/lib/utils/mappers";
import type { ICourse, ApiResponse } from "@/types";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const stagger: Variants = {
  show: { transition: { staggerChildren: 0.15 } }
};

export default function ExploreCourses() {
  const { data: coursesData, isLoading, error } = useQuery({
    queryKey: ["featured-courses-home"],
    queryFn: async () => {
      const res = await axios.get<ApiResponse<ICourse[]>>("/api/courses?isPublished=true");
      return res.data.data ?? [];
    },
  });

  const courses = (coursesData ?? []).slice(0, 3).map(mapCourseToCard);

  return (
    <section className="w-full bg-cream-50/50 pt-24 pb-10 md:pt-32 md:pb-14 border-t border-cream-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <motion.div 
          variants={stagger} 
          initial="hidden" 
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center"
        >
          {/* Header Section */}
          <motion.div variants={fadeUp} className="text-center max-w-2xl mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-outfit font-bold text-gray-900 tracking-tight mb-4">
              Explore Our Yoga Courses
            </h2>
            <p className="text-sage-600 text-lg leading-relaxed font-light">
              Deepen your practice, build strength, and find inner calm with our top professional yoga and mindfulness courses led by expert guides.
            </p>
          </motion.div>

          {/* Courses Grid or States */}
          {isLoading ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-sage-500">
              <Loader2 className="h-10 w-10 animate-spin text-brand-600 mb-4" />
              <p className="text-sm font-medium">Loading our latest courses...</p>
            </div>
          ) : error ? (
            <div className="w-full text-center py-12 bg-white rounded-3xl border border-red-100 p-8">
              <p className="text-red-500 font-medium">Failed to load courses. Please try again later.</p>
            </div>
          ) : courses.length > 0 ? (
            <motion.div 
              variants={stagger} 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-16"
            >
              {courses.map((course, idx) => (
                <CourseCard key={course.id} course={course} index={idx} />
              ))}
            </motion.div>
          ) : (
            <div className="w-full text-center py-16 bg-white rounded-3xl border border-cream-200 p-8 max-w-xl mb-16">
              <p className="text-sage-500 font-medium mb-4">No published courses available right now.</p>
              <Link
                href="/login"
                className="inline-block bg-brand-600 text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-brand-700 transition-colors"
              >
                Sign In to Join
              </Link>
            </div>
          )}

          {/* Explore More CTA */}
          {courses.length > 0 && (
            <motion.div variants={fadeUp}>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 bg-white border border-brand-200 text-brand-700 hover:bg-brand-50 font-bold px-8 py-4 rounded-full text-sm tracking-wider uppercase shadow-sm hover:shadow transition-all hover:-translate-y-0.5"
              >
                View All Courses
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
