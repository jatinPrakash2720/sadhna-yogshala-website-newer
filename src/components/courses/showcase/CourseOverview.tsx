"use client";

import React from "react";
import { CheckCircle2, Target, HelpCircle, BookOpen } from "lucide-react";
import type { ICourse } from "@/types";

interface CourseOverviewProps {
  course: ICourse;
}

export const CourseOverview: React.FC<CourseOverviewProps> = ({ course }) => {
  return (
    <div className="space-y-20">
      {/* Description Section */}
      <section id="about" className="scroll-mt-32">
        <div className="flex items-center gap-3 mb-8">
           <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center">
             <BookOpen className="h-5 w-5 text-brand-600" />
           </div>
           <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Course Description</h2>
        </div>
        
        <div className="bg-white rounded-[40px] p-8 md:p-12 border border-cream-200 shadow-sm leading-relaxed text-sage-700">
          <div className="prose prose-sage max-w-none space-y-6">
            {course.description.split("\n").map((p, i) => p ? (
              <p key={i} className="text-lg leading-relaxed text-gray-700">{p}</p>
            ) : <br key={i} />)}
          </div>
        </div>
      </section>
    </div>
  );
};
