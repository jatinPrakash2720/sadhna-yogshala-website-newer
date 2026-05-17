"use client";

/**
 * Curriculum Builder — dynamic sections with drag-and-drop lessons,
 * add/remove/edit sections and lessons, animated expansion
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  GripVertical,
  BookOpen,
  Play,
  Clock,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCourseBuilderStore } from "@/store/courseBuilderStore";

export default function CurriculumBuilder() {
  const {
    courseData,
    addSection,
    removeSection,
    updateSection,
    addLesson,
    removeLesson,
    updateLesson,
  } = useCourseBuilderStore();

  const curriculum = courseData.curriculum ?? [];
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(curriculum.map((s) => s.id))
  );
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalLessons = curriculum.reduce((acc, s) => acc + (s.lessons?.length || 0), 0);
  const totalMinutes = curriculum.reduce(
    (acc, s) => acc + (s.lessons ?? []).reduce((la, l) => la + (l.duration || 0), 0),
    0
  );

  return (
    <div className="space-y-4">
      {/* Header stats */}
      <div className="flex items-center gap-4 text-xs text-sage-500">
        <span className="flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" />
          {curriculum.length} section{curriculum.length !== 1 ? "s" : ""}
        </span>
        <span className="flex items-center gap-1.5">
          <Play className="h-3.5 w-3.5" />
          {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
        </span>
        {totalMinutes > 0 && (
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
          </span>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-3">
        <AnimatePresence>
          {curriculum.map((section, sIdx) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="border border-cream-200 rounded-2xl overflow-hidden bg-white"
            >
              {/* Section header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-cream-50 border-b border-cream-100">
                <GripVertical className="h-4 w-4 text-sage-300 cursor-grab flex-shrink-0" />
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="flex-shrink-0 text-sage-400 hover:text-sage-600 transition-colors"
                >
                  {expandedSections.has(section.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {/* Section title */}
                {editingSectionId === section.id ? (
                  <input
                    type="text"
                    value={section.sectionTitle}
                    onChange={(e) => updateSection(section.id, e.target.value)}
                    onBlur={() => setEditingSectionId(null)}
                    autoFocus
                    className="flex-1 text-sm font-semibold text-gray-800 bg-white border border-brand-300 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditingSectionId(section.id)}
                    className="flex-1 text-left text-sm font-semibold text-gray-800 hover:text-brand-600 transition-colors truncate"
                  >
                    {section.sectionTitle || `Section ${sIdx + 1}`}
                  </button>
                )}

                <span className="text-[11px] text-sage-400 flex-shrink-0">
                  {section.lessons?.length || 0} lesson{(section.lessons?.length || 0) !== 1 ? "s" : ""}
                </span>

                <button
                  type="button"
                  onClick={() => removeSection(section.id)}
                  className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0 p-1 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Lessons */}
              <AnimatePresence>
                {expandedSections.has(section.id) && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    {/* Lesson rows */}
                    {(section.lessons ?? []).map((lesson, lIdx) => (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        className="flex items-center gap-3 px-4 py-3 border-b border-cream-50 last:border-b-0 group hover:bg-cream-50/50 transition-colors"
                      >
                        <GripVertical className="h-4 w-4 text-sage-200 cursor-grab flex-shrink-0" />

                        {/* Lesson number */}
                        <span className="h-5 w-5 rounded-full bg-sage-100 text-sage-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {lIdx + 1}
                        </span>

                        {/* Lesson title */}
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) =>
                            updateLesson(section.id, lesson.id, { title: e.target.value })
                          }
                          placeholder="Lesson title..."
                          className="flex-1 text-sm text-gray-700 bg-transparent border-0 outline-none placeholder:text-sage-300 min-w-0"
                        />

                        {/* Duration */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Clock className="h-3 w-3 text-sage-300" />
                          <input
                            type="number"
                            value={lesson.duration}
                            onChange={(e) =>
                              updateLesson(section.id, lesson.id, { duration: Number(e.target.value) })
                            }
                            min={0}
                            className="w-12 text-xs text-sage-500 bg-transparent border-0 outline-none text-center"
                          />
                          <span className="text-[10px] text-sage-300">min</span>
                        </div>

                        {/* Preview toggle */}
                        <button
                          type="button"
                          onClick={() =>
                            updateLesson(section.id, lesson.id, { isPreview: !lesson.isPreview })
                          }
                          className={cn(
                            "flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full transition-all flex-shrink-0",
                            lesson.isPreview
                              ? "bg-brand-50 text-brand-600 border border-brand-200"
                              : "bg-cream-100 text-sage-400 hover:bg-brand-50 hover:text-brand-500"
                          )}
                          title="Toggle free preview"
                        >
                          <Eye className="h-3 w-3" />
                          {lesson.isPreview ? "Preview" : "Locked"}
                        </button>

                        {/* Delete lesson */}
                        <button
                          type="button"
                          onClick={() => removeLesson(section.id, lesson.id)}
                          className="text-red-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </motion.div>
                    ))}

                    {/* Add lesson button */}
                    <div className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => addLesson(section.id)}
                        className="flex items-center gap-2 text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors py-1.5 px-3 rounded-lg hover:bg-brand-50 w-full justify-center border border-dashed border-brand-200 hover:border-brand-300"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Lesson
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add section button */}
      <motion.button
        type="button"
        onClick={addSection}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-brand-200 rounded-2xl text-sm font-semibold text-brand-600 hover:border-brand-400 hover:bg-brand-50 transition-all duration-200"
      >
        <Plus className="h-4 w-4" />
        Add Section
      </motion.button>

      {curriculum.length === 0 && (
        <div className="text-center py-6 text-sage-400">
          <BookOpen className="h-8 w-8 mx-auto mb-2 text-sage-300" />
          <p className="text-sm">No sections yet. Add your first section above.</p>
        </div>
      )}
    </div>
  );
}
