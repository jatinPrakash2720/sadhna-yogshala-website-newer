"use client";

import React from "react";
import { Clock, Calendar, Globe, Award, BookOpen, MonitorPlay } from "lucide-react";
import type { ICourse } from "@/types";

interface CourseStatsProps {
  course: ICourse;
}

export const CourseStats: React.FC<CourseStatsProps> = ({ course }) => {
  const stats = [
    {
      icon: Clock,
      label: "Duration",
      value: `${course.durationInMonths} Months`,
    },
    {
      icon: MonitorPlay,
      label: "Live & Recorded",
      value: `${course.totalClasses} Classes`,
    },
    {
      icon: Award,
      label: "Skill Level",
      value: course.level || "All Levels",
    },
    {
      icon: Globe,
      label: "Language",
      value: course.language || "English",
    },
    {
      icon: Calendar,
      label: "Batch Starts",
      value: new Date(course.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    },
    {
      icon: BookOpen,
      label: "Batch Type",
      value: course.batchType?.replace('_', ' ') || "Flexible",
      capitalize: true
    }
  ];

  return (
    <div className="bg-white rounded-[40px] p-8 md:p-12 border border-cream-200 shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-6">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center text-center group">
            <div className="h-14 w-14 rounded-2xl bg-cream-50 flex items-center justify-center mb-4 group-hover:bg-brand-50 group-hover:-translate-y-1 transition-all duration-300">
              <stat.icon className="h-6 w-6 text-sage-400 group-hover:text-brand-600 transition-colors" />
            </div>
            <p className="text-[11px] font-bold text-sage-400 uppercase tracking-[0.2em] mb-1.5">{stat.label}</p>
            <p className={`text-lg font-bold text-gray-900 ${stat.capitalize ? 'capitalize' : ''}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
