"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  TrendingUp,
  BookOpen,
  Calendar,
  Award,
  ArrowRight,
  Clock,
  Video,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MOCK_ENROLLMENTS, MOCK_CLASSES } from "@/lib/mocks/data";
import { formatPrice, formatDuration, getTimeRemaining } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = { show: { transition: { staggerChildren: 0.08 } } };

export default function DashboardPage() {
  const stats = [
    { label: "Courses Enrolled", value: MOCK_ENROLLMENTS.length, icon: BookOpen, color: "text-brand-600", bg: "bg-brand-50" },
    { label: "Sessions Completed", value: MOCK_ENROLLMENTS.reduce((a, e) => a + e.completedSessions, 0), icon: Video, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Upcoming Classes", value: MOCK_CLASSES.filter((c) => c.status === "upcoming").length, icon: Calendar, color: "text-earth-600", bg: "bg-earth-50" },
    { label: "Avg. Progress", value: `${Math.round(MOCK_ENROLLMENTS.reduce((a, e) => a + e.progress, 0) / MOCK_ENROLLMENTS.length)}%`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="p-6 sm:p-8 max-w-5xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Good morning, Kavya! 🌅</h1>
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
      {MOCK_CLASSES[0] && (
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
              <p className="font-bold text-white">{MOCK_CLASSES[0].title}</p>
              <p className="text-sm text-white/70">
                Starts in{" "}
                <span className="text-brand-300 font-semibold">{getTimeRemaining(MOCK_CLASSES[0].scheduledAt)}</span>{" "}
                · {MOCK_CLASSES[0].duration} mins with {MOCK_CLASSES[0].instructor}
              </p>
            </div>
          </div>
          <a href={MOCK_CLASSES[0].meetLink} target="_blank" rel="noopener noreferrer">
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
        <div className="space-y-4">
          {MOCK_ENROLLMENTS.map((enr) => (
            <motion.div key={enr.id} variants={fadeUp} className="card p-5 flex items-center gap-5">
              <div className="relative h-16 w-24 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={enr.course.thumbnail} alt={enr.course.title} fill className="object-cover" sizes="96px" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/courses/${enr.course.slug}`} className="font-semibold text-sm text-gray-900 hover:text-brand-700 transition-colors line-clamp-1">
                  {enr.course.title}
                </Link>
                <p className="text-xs text-sage-400 mt-0.5 mb-2">
                  {enr.completedSessions} / {enr.totalSessions} sessions completed
                </p>
                {/* Progress bar */}
                <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-700"
                    style={{ width: `${enr.progress}%` }}
                  />
                </div>
                <p className="text-xs text-brand-600 font-semibold mt-1">{enr.progress}%</p>
              </div>
              <Badge variant={enr.progress >= 50 ? "green" : "gold"} className="hidden sm:flex flex-shrink-0">
                {enr.progress >= 80 ? "Almost done!" : enr.progress >= 50 ? "On track" : "Just started"}
              </Badge>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
