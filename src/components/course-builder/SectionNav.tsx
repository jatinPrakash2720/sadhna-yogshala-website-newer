"use client";

/**
 * Yogshala LMS — Course Builder Section Navigation
 * Sticky left mini-nav with scroll-spy active state.
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCourseBuilderStore, type BuilderSection } from "@/store/courseBuilderStore";
import {
  BookOpen,
  Image as ImageIcon,
  Video,
  GalleryHorizontal,
  DollarSign,
  User,
  ListOrdered,
  Search,
  Send,
} from "lucide-react";

const SECTIONS: { id: BuilderSection; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: "basic", label: "Basic Info", icon: BookOpen },
  { id: "thumbnail", label: "Thumbnail", icon: ImageIcon },
  { id: "video", label: "Intro Video", icon: Video },
  { id: "gallery", label: "Gallery", icon: GalleryHorizontal },
  { id: "pricing", label: "Pricing & Batch", icon: DollarSign },
  { id: "instructor", label: "Instructor", icon: User },
  { id: "curriculum", label: "Curriculum", icon: ListOrdered },
  { id: "seo", label: "SEO Settings", icon: Search },
  { id: "publish", label: "Publish", icon: Send },
];

export default function SectionNav() {
  const { activeSection, setActiveSection } = useCourseBuilderStore();

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(`section-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setActiveSection(sectionId as BuilderSection);
  };

  return (
    <nav className="hidden xl:flex flex-col gap-1 w-48 flex-shrink-0 sticky top-4" aria-label="Course builder sections">
      <p className="text-[10px] font-bold uppercase tracking-widest text-sage-400 px-3 mb-2">
        Sections
      </p>
      {SECTIONS.map(({ id, label, icon: Icon }) => {
        const isActive = activeSection === id;
        return (
          <motion.button
            key={id}
            onClick={() => scrollToSection(id)}
            whileHover={{ x: 2 }}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-all duration-200 group",
              isActive
                ? "bg-brand-50 text-brand-700 border border-brand-200"
                : "text-sage-500 hover:bg-cream-100 hover:text-gray-700"
            )}
          >
            <Icon
              className={cn(
                "h-3.5 w-3.5 flex-shrink-0",
                isActive ? "text-brand-600" : "text-sage-400 group-hover:text-sage-600"
              )}
            />
            <span className="truncate">{label}</span>
            {isActive && (
              <motion.div
                layoutId="nav-active"
                className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500"
              />
            )}
          </motion.button>
        );
      })}
    </nav>
  );
}
