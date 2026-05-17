"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlayCircle, Video, CheckCircle, Shield, Award, 
  Infinity as LifeTime, Smartphone, FileText 
} from "lucide-react";
import { CheckoutButton } from "@/components/courses/CheckoutButton";
import { formatPrice } from "@/lib/utils";
import type { ICourse } from "@/types";

interface StickyEnrollmentCardProps {
  course: ICourse;
}

export const StickyEnrollmentCard: React.FC<StickyEnrollmentCardProps> = ({ course }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="lg:sticky lg:top-28 w-full max-w-md mx-auto lg:ml-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-cream-200"
      >
        {/* Media Preview Area */}
        <div className="relative group aspect-video cursor-pointer bg-gray-900" onClick={() => !isPlaying && course.introVideo?.url && setIsPlaying(true)}>
          <AnimatePresence mode="wait">
            {!isPlaying ? (
              <motion.div 
                key="thumb"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                {course.thumbnail?.url ? (
                  <Image src={course.thumbnail.url} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sage-200 bg-cream-50">
                    <Video className="h-16 w-16 opacity-10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="h-20 w-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/40 shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
                    <PlayCircle className="h-10 w-10 text-white fill-white/20" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-center">
                   <p className="text-white text-[10px] font-bold uppercase tracking-widest drop-shadow-md">Click to watch preview</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full">
                <video src={course.introVideo?.url} controls autoPlay className="w-full h-full object-cover" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsPlaying(false); }}
                  className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md"
                >✕</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pricing & CTA */}
        <div className="p-8">
          <div className="flex items-end gap-3 mb-8">
            <span className="text-5xl font-black text-gray-900 tracking-tight">
              {formatPrice(course.price)}
            </span>
            {course.discountPrice && (
              <div className="flex flex-col mb-1">
                <span className="text-sm font-bold text-red-500 mb-0.5">{Math.round(((course.discountPrice - course.price)/course.discountPrice)*100)}% OFF</span>
                <span className="text-lg text-sage-300 line-through leading-none">{formatPrice(course.discountPrice)}</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <CheckoutButton courseId={course._id.toString()} />
            <p className="text-center text-xs text-sage-400 flex items-center justify-center gap-1.5 font-medium">
              <Shield className="h-3.5 w-3.5 text-brand-500" /> 7-Day Money-Back Guarantee
            </p>
          </div>

          {/* Value Props */}
          <div className="mt-10 pt-8 border-t border-cream-100">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">This course includes</h4>
            <div className="grid grid-cols-1 gap-5">
              <ValueItem icon={LifeTime} text="Full lifetime access" />
              <ValueItem icon={Smartphone} text="Access on mobile and TV" />
              <ValueItem icon={Award} text="Certificate of completion" />
              <ValueItem icon={FileText} text="Practice assignments" />
              <ValueItem icon={Video} text={`${course.totalClasses} downloadable resources`} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ValueItem = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <div className="flex items-center gap-4 text-sm font-semibold text-gray-700">
    <div className="h-8 w-8 rounded-xl bg-brand-50 flex items-center justify-center border border-brand-100">
      <Icon className="h-4 w-4 text-brand-600" />
    </div>
    <span>{text}</span>
  </div>
);
