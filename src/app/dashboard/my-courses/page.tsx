"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

async function fetchMyCourses() {
  const res = await fetch("/api/enrollments/my-courses");
  if (!res.ok) throw new Error("Failed to load enrolled courses");
  const json = await res.json();
  return json.data as any[];
}

export default function MyCoursesPage() {
  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ["my-courses"],
    queryFn: fetchMyCourses,
  });

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="p-6 sm:p-8 max-w-4xl mx-auto">
      <motion.div variants={fadeUp} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">My Courses</h1>
        <p className="text-sage-500">{enrollments.length} courses in your library</p>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      ) : enrollments.length === 0 ? (
        <motion.div variants={fadeUp} className="text-center py-20">
          <BookOpen className="h-12 w-12 text-sage-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No courses yet</h2>
          <p className="text-sage-500 mb-6">Start your yoga journey today!</p>
          <Link href="/courses" className="btn-primary inline-flex">Browse Courses</Link>
        </motion.div>
      ) : (
        <div className="space-y-5">
          {enrollments.map((enr) => {
            const progress = enr.progressPercentage ?? 0;
            const totalClasses = enr.course?.totalClasses ?? 20;
            const completedSessions = Math.round((progress / 100) * totalClasses);
            const courseTitle = enr.course?.title ?? "Course Title";
            const category = enr.course?.category ?? "Yoga";
            const instructor = enr.course?.instructorName ?? enr.course?.instructor?.name ?? "Priya Sharma";
            const thumbnailSrc = enr.course?.thumbnail?.url ?? "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=80";

            return (
              <motion.div key={enr._id} variants={fadeUp} className="card overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  {/* Thumbnail */}
                  <div className="relative h-44 sm:h-auto sm:w-56 flex-shrink-0">
                    <Image
                      src={thumbnailSrc}
                      alt={courseTitle}
                      fill
                      className="object-cover"
                      sizes="224px"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">{category}</p>
                        <h2 className="font-bold text-lg text-gray-900 leading-tight">{courseTitle}</h2>
                        <p className="text-sm text-sage-500 mt-0.5">with {instructor}</p>
                      </div>
                      <Badge variant={progress >= 80 ? "green" : progress >= 40 ? "gold" : "gray"} className="flex-shrink-0">
                        {progress >= 100 ? "✓ Completed" : progress >= 80 ? "Almost Done" : progress >= 40 ? "In Progress" : "Just Started"}
                      </Badge>
                    </div>

                    {/* Sessions */}
                    <p className="text-sm text-sage-500 mb-3">
                      {completedSessions} of {totalClasses} sessions completed
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-sage-500">Progress</span>
                        <span className="font-semibold text-brand-600">{progress}%</span>
                      </div>
                      <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full"
                        />
                      </div>
                    </div>

                    <Link
                      href={`/courses/${enr.course?.slug}`}
                      id={`my-course-continue-${enr._id}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                    >
                      {progress === 0 ? "Start Course" : progress >= 100 ? "Review Course" : "Continue Learning"}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

