"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, Video, Clock, Star, Users, Globe, Share2, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { ICourse } from "@/types";
import { toast } from "sonner";

interface CourseHeroProps {
  course: ICourse;
}

export const CourseHero: React.FC<CourseHeroProps> = ({ course }) => {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Course link copied!");
  };

  return (
    <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-brand-900">
      {/* Background Cinematic Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-brand-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Text Content */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Breadcrumbs & Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <Badge className="bg-brand-500/20 text-brand-100 border border-brand-400/30 px-3 py-1 text-[11px] font-bold tracking-wider uppercase">
                  {course.category || "Yoga"}
                </Badge>
                <Badge className="bg-white/10 text-brand-200 border border-white/10 px-3 py-1 text-[11px] font-bold tracking-wider uppercase">
                  {course.level || "All Levels"}
                </Badge>
                <div className="flex items-center gap-1 ml-2 text-brand-300/80 text-xs font-medium">
                  <Star className="h-3.5 w-3.5 text-gold-400 fill-gold-400" />
                  <span className="text-white font-bold">4.9</span>
                  <span>(1,240 ratings)</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
                {course.title}
              </h1>
              <p className="text-lg md:text-xl text-brand-100/70 mb-10 max-w-2xl leading-relaxed">
                {course.shortDescription || "Elevate your practice with our premium, professionally-guided course designed for transformation and mindfulness."}
              </p>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">Enrolled</span>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-brand-300" />
                    <span className="text-white font-bold">1.5k+ Students</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">Duration</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-brand-300" />
                    <span className="text-white font-bold">{course.durationInMonths} Months</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">Language</span>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-brand-300" />
                    <span className="text-white font-bold">{course.language || "English"}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">Updated</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-brand-300" />
                    <span className="text-white font-bold">May 2024</span>
                  </div>
                </div>
              </div>

              {/* Instructor Quick Info */}
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 rounded-2xl overflow-hidden border-2 border-brand-500/30 bg-brand-800 shadow-xl">
                  {course.instructor?.image?.url ? (
                    <Image src={course.instructor.image.url} alt="Instructor" fill className="object-cover" />
                  ) : (
                    <Users className="h-7 w-7 m-auto mt-3.5 text-brand-400" />
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-0.5">Created By</p>
                  <h4 className="text-white font-bold text-lg leading-none">
                    {course.instructor?.name || course.instructorName}
                  </h4>
                  <p className="text-xs text-brand-200/60 mt-1">{course.instructor?.title || "Master Yogi"}</p>
                </div>
                <button 
                  onClick={handleShare}
                  className="ml-auto p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-brand-200"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Visual Collage */}
          <div className="lg:col-span-5 hidden lg:block relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full aspect-[4/5] rounded-[40px] overflow-hidden border-[8px] border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.3)] group"
            >
              {course.thumbnail?.url ? (
                <Image 
                  src={course.thumbnail.url} 
                  alt={course.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  priority
                />
              ) : (
                <div className="w-full h-full bg-brand-800 flex items-center justify-center">
                  <Video className="h-20 w-20 text-brand-600/50" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/20 to-transparent" />
            </motion.div>

            {/* Floating Gallery Elements */}
            {course.gallery && course.gallery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -bottom-8 -left-12 w-48 aspect-square rounded-3xl overflow-hidden border-[6px] border-brand-900 shadow-2xl rotate-[-6deg]"
              >
                <Image src={course.gallery[0].url} alt="Gallery image 1" fill className="object-cover" />
              </motion.div>
            )}

            {course.gallery && course.gallery.length > 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute top-12 -right-8 w-36 aspect-square rounded-3xl overflow-hidden border-[6px] border-brand-900 shadow-2xl rotate-[8deg]"
              >
                <Image src={course.gallery[1].url} alt="Gallery image 2" fill className="object-cover" />
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);
