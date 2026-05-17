"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { MOCK_ENROLLMENTS } from "@/lib/mocks/data";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

export default function MyCoursesPage() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="p-6 sm:p-8 max-w-4xl mx-auto">
      <motion.div variants={fadeUp} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">My Courses</h1>
        <p className="text-sage-500">{MOCK_ENROLLMENTS.length} courses in your library</p>
      </motion.div>

      {MOCK_ENROLLMENTS.length === 0 ? (
        <motion.div variants={fadeUp} className="text-center py-20">
          <BookOpen className="h-12 w-12 text-sage-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No courses yet</h2>
          <p className="text-sage-500 mb-6">Start your yoga journey today!</p>
          <Link href="/courses" className="btn-primary inline-flex">Browse Courses</Link>
        </motion.div>
      ) : (
        <div className="space-y-5">
          {MOCK_ENROLLMENTS.map((enr) => (
            <motion.div key={enr.id} variants={fadeUp} className="card overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Thumbnail */}
                <div className="relative h-44 sm:h-auto sm:w-56 flex-shrink-0">
                  <Image
                    src={enr.course.thumbnail}
                    alt={enr.course.title}
                    fill
                    className="object-cover"
                    sizes="224px"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">{enr.course.category}</p>
                      <h2 className="font-bold text-lg text-gray-900 leading-tight">{enr.course.title}</h2>
                      <p className="text-sm text-sage-500 mt-0.5">with {enr.course.instructor}</p>
                    </div>
                    <Badge variant={enr.progress >= 80 ? "green" : enr.progress >= 40 ? "gold" : "gray"} className="flex-shrink-0">
                      {enr.progress >= 100 ? "✓ Completed" : enr.progress >= 80 ? "Almost Done" : enr.progress >= 40 ? "In Progress" : "Just Started"}
                    </Badge>
                  </div>

                  {/* Sessions */}
                  <p className="text-sm text-sage-500 mb-3">
                    {enr.completedSessions} of {enr.totalSessions} sessions completed
                  </p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-sage-500">Progress</span>
                      <span className="font-semibold text-brand-600">{enr.progress}%</span>
                    </div>
                    <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${enr.progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full"
                      />
                    </div>
                  </div>

                  <Link
                    href={`/courses/${enr.course.slug}`}
                    id={`my-course-continue-${enr.id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    {enr.progress === 0 ? "Start Course" : enr.progress >= 100 ? "Review Course" : "Continue Learning"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
