"use client";

import React from "react";
import { CourseHero } from "./CourseHero";
import { StickyEnrollmentCard } from "./StickyEnrollmentCard";
import { CourseOverview } from "./CourseOverview";
import { CourseStats } from "./CourseStats";
import { CurriculumAccordion } from "./CurriculumAccordion";
import { InstructorShowcase } from "./InstructorShowcase";
import type { ICourse } from "@/types";

interface CourseShowcaseClientProps {
  course: ICourse;
}

export const CourseShowcaseClient: React.FC<CourseShowcaseClientProps> = ({ course }) => {
  return (
    <div className="bg-cream-50 min-h-screen pb-24">
      {/* Premium Hero Section */}
      <CourseHero course={course} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Main Left Content Column */}
          <div className="lg:col-span-8 space-y-16 md:space-y-24">
            
            {/* 1. Quick Stats */}
            <CourseStats course={course} />

            {/* 2. Course Overview & Requirements */}
            <CourseOverview course={course} />

            {/* 4. Deep Dive Curriculum */}
            <section id="curriculum" className="scroll-mt-32">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Course Curriculum</h2>
                  <p className="text-sage-500 mt-2">Explore the comprehensive roadmap to your transformation.</p>
                </div>
              </div>
              
              {course.curriculum && course.curriculum.length > 0 ? (
                <CurriculumAccordion curriculum={course.curriculum} />
              ) : (
                <div className="bg-white rounded-[32px] p-12 text-center border border-dashed border-cream-300">
                  <p className="text-sage-500 italic">Curriculum details are being finalized. Check back soon!</p>
                </div>
              )}
            </section>

            {/* 5. Instructor Profile */}
            <section id="instructor" className="scroll-mt-32">
              <InstructorShowcase instructor={course.instructor} />
            </section>

          </div>

          {/* Right Sidebar: Sticky Purchase Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 hidden lg:block">
            <StickyEnrollmentCard course={course} />
          </div>

        </div>
      </div>
      
      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-cream-200 lg:hidden z-50">
        <div className="max-w-md mx-auto">
          <StickyEnrollmentCard course={course} />
        </div>
      </div>
    </div>
  );
};
