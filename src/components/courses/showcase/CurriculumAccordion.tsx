"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, PlayCircle, Lock, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ICurriculumSection } from "@/types";

interface CurriculumAccordionProps {
  curriculum: ICurriculumSection[];
}

export const CurriculumAccordion: React.FC<CurriculumAccordionProps> = ({ curriculum }) => {
  const [expandedIndices, setExpandedIndices] = useState<number[]>([0]);

  const toggleSection = (idx: number) => {
    setExpandedIndices(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="space-y-4">
      {curriculum.map((section, idx) => (
        <div 
          key={idx} 
          className="group bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
        >
          {/* Section Header */}
          <button 
            onClick={() => toggleSection(idx)}
            className="w-full flex items-center justify-between p-6 sm:p-8 text-left bg-cream-50/30 group-hover:bg-cream-50 transition-colors"
          >
            <div className="flex items-center gap-6">
              <div className="h-12 w-12 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-lg">
                {idx + 1}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg leading-tight">{section.sectionTitle}</h3>
                <div className="flex items-center gap-3 mt-1.5 text-xs font-bold text-sage-400 uppercase tracking-widest">
                  <span>{section.lessons?.length || 0} Lessons</span>
                  <span className="h-1 w-1 rounded-full bg-sage-300" />
                  <span>{section.lessons?.reduce((acc, l) => acc + (l.duration || 0), 0)} min total</span>
                </div>
              </div>
            </div>
            <div className={cn(
              "h-10 w-10 rounded-full border border-cream-200 flex items-center justify-center transition-transform duration-300",
              expandedIndices.includes(idx) ? "rotate-180 bg-brand-600 border-brand-600" : "bg-white"
            )}>
              <ChevronDown className={cn("h-5 w-5", expandedIndices.includes(idx) ? "text-white" : "text-sage-400")} />
            </div>
          </button>

          {/* Lessons List */}
          <AnimatePresence>
            {expandedIndices.includes(idx) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="p-4 sm:p-6 space-y-2 border-t border-cream-100">
                  {section.lessons?.map((lesson, lIdx) => (
                    <div 
                      key={lIdx}
                      className="flex items-center justify-between p-4 rounded-2xl hover:bg-cream-50 transition-colors group/lesson"
                    >
                      <div className="flex items-center gap-5">
                        <div className="h-10 w-10 rounded-xl bg-cream-100 flex items-center justify-center text-sage-400 group-hover/lesson:bg-brand-100 group-hover/lesson:text-brand-600 transition-colors">
                          {lesson.isPreview ? <PlayCircle className="h-5 w-5" /> : <Lock className="h-4 w-4 opacity-50" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 leading-none">{lesson.title}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                             {lesson.isPreview && <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-1.5 py-0.5 rounded">Free Preview</span>}
                             <span className="text-[10px] font-bold text-sage-400 uppercase tracking-wider">{lesson.duration} mins</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {lesson.isPreview ? (
                          <button className="text-[11px] font-bold text-brand-600 hover:underline">Watch Now</button>
                        ) : (
                          <Lock className="h-4 w-4 text-sage-300" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
