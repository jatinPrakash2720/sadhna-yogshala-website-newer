"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  TrendingUp,
  BookOpen,
  Calendar,
  ArrowRight,
  Video,
  Zap,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDateTime, getTimeRemaining } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = { show: { transition: { staggerChildren: 0.08 } } };

async function fetchMyCourses() {
  const res = await fetch("/api/enrollments/my-courses");
  if (!res.ok) throw new Error("Failed to load enrolled courses");
  const json = await res.json();
  return json.data as any[];
}

async function fetchMyClasses() {
  const res = await fetch("/api/classes");
  if (!res.ok) throw new Error("Failed to load class sessions");
  const json = await res.json();
  return json.data.sessions as any[];
}

export default function DashboardPage() {
  const { data: enrollments = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ["my-courses"],
    queryFn: fetchMyCourses,
  });

  const { data: classes = [], isLoading: isLoadingClasses } = useQuery({
    queryKey: ["my-classes"],
    queryFn: fetchMyClasses,
  });

  if (isLoadingCourses || isLoadingClasses) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  // Calculate dynamic stats
  const totalCourses = enrollments.length;
  const sessionsCompleted = enrollments.reduce((sum, enr) => {
    const progress = enr.progressPercentage ?? 0;
    const totalClasses = enr.course?.totalClasses ?? 20;
    return sum + Math.round((progress / 100) * totalClasses);
  }, 0);

  const upcomingClasses = classes.filter((c) => c.status === "upcoming");
  const avgProgress = totalCourses
    ? Math.round(
        enrollments.reduce((sum, enr) => sum + (enr.progressPercentage ?? 0), 0) /
          totalCourses
      )
    : 0;

  const stats = [
    { label: "Courses Enrolled", value: totalCourses, icon: BookOpen, color: "text-brand-600", bg: "bg-brand-50" },
    { label: "Sessions Completed", value: sessionsCompleted, icon: Video, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Upcoming Classes", value: upcomingClasses.length, icon: Calendar, color: "text-earth-600", bg: "bg-earth-50" },
    { label: "Avg. Progress", value: `${avgProgress}%`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
  ];

  // Next upcoming class (earliest scheduled)
  const nextClass = upcomingClasses[0];
  const nextClassScheduledAt = nextClass
    ? (() => {
        const datePart = new Date(nextClass.scheduledDate).toISOString().split("T")[0];
        return new Date(`${datePart}T${nextClass.startTime || "00:00"}:00`);
      })()
    : null;

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="p-6 sm:p-8 max-w-5xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back! 🌅</h1>
        <p className="text-sage-500 mt-1">Here&apos;s your wellness journey at a glance.</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <motion.div key={label} variants={fadeUp} className="card p-5">
            <div className={`h-10 w-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-sage-500 mt-0.5">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Next class banner */}
      {nextClass && nextClassScheduledAt && (
        <motion.div
          variants={fadeUp}
          className="bg-hero-gradient rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="h-6 w-6 text-brand-300" />
            </div>
            <div>
              <p className="text-xs text-brand-300 font-semibold uppercase tracking-wider mb-0.5">Next Class</p>
              <p className="font-bold text-white">{nextClass.title}</p>
              <p className="text-sm text-white/70">
                Starts in{" "}
                <span className="text-brand-300 font-semibold">
                  {getTimeRemaining(nextClassScheduledAt)}
                </span>{" "}
                · {nextClass.duration ?? 60} mins with {nextClass.course?.instructorName ?? nextClass.course?.instructor?.name ?? "Instructor"}
              </p>
            </div>
          </div>
          {nextClass.meetingLink && (
            <a href={nextClass.meetingLink} target="_blank" rel="noopener noreferrer">
              <Button
                variant="accent"
                size="sm"
                id="dashboard-join-class-btn"
                className="flex-shrink-0"
              >
                <Video className="h-4 w-4" />
                Join Now
              </Button>
            </a>
          )}
        </motion.div>
      )}

      {/* My courses progress */}
      <motion.div variants={fadeUp} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Your Courses</h2>
          <Link href="/dashboard/my-courses" className="text-sm text-brand-600 hover:underline font-medium flex items-center gap-1">
            See all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {totalCourses === 0 ? (
          <div className="card p-8 text-center text-sage-500">
            You are not enrolled in any courses yet.{" "}
            <Link href="/courses" className="text-brand-600 font-semibold hover:underline">
              Browse courses
            </Link>{" "}
            to get started!
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enr) => {
              const progress = enr.progressPercentage ?? 0;
              const totalClasses = enr.course?.totalClasses ?? 20;
              const completedSessions = Math.round((progress / 100) * totalClasses);
              const courseTitle = enr.course?.title ?? "Course Title";
              const thumbnailSrc = enr.course?.thumbnail?.url ?? "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=80";

              return (
                <motion.div key={enr._id} variants={fadeUp} className="card p-5 flex items-center gap-5">
                  <div className="relative h-16 w-24 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={thumbnailSrc} alt={courseTitle} fill className="object-cover" sizes="96px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/courses/${enr.course?.slug}`} className="font-semibold text-sm text-gray-900 hover:text-brand-700 transition-colors line-clamp-1">
                      {courseTitle}
                    </Link>
                    <p className="text-xs text-sage-400 mt-0.5 mb-2">
                      {completedSessions} / {totalClasses} sessions completed
                    </p>
                    {/* Progress bar */}
                    <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full transition-all duration-700"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-brand-600 font-semibold mt-1">{progress}%</p>
                  </div>
                  <Badge variant={progress >= 50 ? "green" : "gold"} className="hidden sm:flex flex-shrink-0">
                    {progress >= 80 ? "Almost done!" : progress >= 50 ? "On track" : "Just started"}
                  </Badge>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

