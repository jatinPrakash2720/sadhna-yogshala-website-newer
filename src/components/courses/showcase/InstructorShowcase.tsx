"use client";

import React from "react";
import Image from "next/image";
import { Users, Star, Globe, Mail, Link as LinkIcon } from "lucide-react";
import type { IInstructor } from "@/types";

interface InstructorShowcaseProps {
  instructor: IInstructor | undefined;
}

export const InstructorShowcase: React.FC<InstructorShowcaseProps> = ({ instructor }) => {
  if (!instructor) return null;

  return (
    <div className="bg-white rounded-[48px] p-10 md:p-14 border border-cream-200 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-12 lg:items-center">
        {/* Left: Avatar & Socials */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative h-48 w-48 rounded-[40px] overflow-hidden border-[12px] border-cream-100 shadow-inner">
            {instructor.image?.url ? (
              <Image src={instructor.image.url} alt={instructor.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-brand-50 flex items-center justify-center text-brand-200">
                <Users className="h-20 w-20" />
              </div>
            )}
          </div>
          
          <div className="flex gap-4 mt-8">
            <SocialIcon icon={Globe} href="#" />
            <SocialIcon icon={Mail} href="#" />
            <SocialIcon icon={LinkIcon} href="#" />
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-[0.2em] bg-brand-50 px-3 py-1 rounded-lg">Lead Instructor</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-gold-500">
              <Star className="h-4 w-4 fill-gold-400" /> 4.9 Instructor Rating
            </div>
          </div>
          
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">{instructor.name}</h2>
          <p className="text-lg font-bold text-sage-400 mb-8">{instructor.title || "Master of Yogic Arts & Mindfulness"}</p>
          
          <div className="prose prose-sage max-w-none text-sage-600 leading-relaxed italic mb-10">
            {instructor.bio || "Bringing over 15 years of deep meditative practice and technical yoga expertise, I focus on holistic transformation that merges physical strength with mental clarity."}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-10 border-t border-cream-100">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-sage-400 uppercase tracking-widest">Total Students</span>
              <span className="text-2xl font-black text-gray-900">4,500+</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-sage-400 uppercase tracking-widest">Courses</span>
              <span className="text-2xl font-black text-gray-900">12</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-sage-400 uppercase tracking-widest">Experience</span>
              <span className="text-2xl font-black text-gray-900">15+ Yrs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialIcon = ({ icon: Icon, href }: { icon: any, href: string }) => (
  <a 
    href={href} 
    className="h-12 w-12 rounded-2xl bg-cream-50 flex items-center justify-center text-sage-400 hover:bg-brand-600 hover:text-white transition-all duration-300 shadow-sm"
  >
    <Icon className="h-5 w-5" />
  </a>
);
