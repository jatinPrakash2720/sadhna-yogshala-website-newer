"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import CourseCard from "@/components/courses/CourseCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { mapCourseToCard } from "@/lib/utils/mappers";
import type { ICourse, ApiResponse } from "@/types";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

export default function CoursesPage() {
  const [search, setSearch] = useState("");

  const { data: coursesData, isLoading, error } = useQuery({
    queryKey: ["courses", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("isPublished", "true");

      const res = await axios.get<ApiResponse<ICourse[]>>(`/api/courses?${params.toString()}`);
      return res.data.data ?? [];
    },
  });

  const courses = (coursesData ?? []).map(mapCourseToCard);

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={stagger} initial="hidden" animate="show">
          {/* Header */}
          <motion.div variants={fadeUp} className="max-w-3xl mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Our Courses</h1>
            <p className="text-lg text-sage-600">
              Explore our comprehensive library of yoga, meditation, and breathwork courses. Find the perfect practice for your level and goals.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div variants={fadeUp} className="flex flex-col lg:flex-row gap-6 mb-12">
            <div className="flex-1 max-w-md">
              <Input
                id="search-courses"
                placeholder="Search by course title or instructor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="h-5 w-5" />}
              />
            </div>
          </motion.div>

          {/* Results Info */}
          <motion.div variants={fadeUp} className="mb-6 flex items-center justify-between text-sm text-sage-600">
            <p>
              {isLoading ? (
                "Loading courses..."
              ) : (
                <>Showing <span className="font-semibold text-gray-900">{courses.length}</span> courses</>
              )}
            </p>
            <button className="flex items-center gap-2 hover:text-brand-600 transition-colors">
              <SlidersHorizontal className="h-4 w-4" /> Sort by: Newest
            </button>
          </motion.div>

          {/* Grid */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-sage-400">
              <Loader2 className="h-10 w-10 animate-spin mb-4" />
              <p>Fetching the latest courses for you...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-red-500">
              <p>Failed to load courses. Please try again later.</p>
            </div>
          ) : courses.length > 0 ? (
            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, idx) => (
                <CourseCard key={course.id} course={course} index={idx} />
              ))}
            </motion.div>
          ) : (
            <motion.div variants={fadeUp} className="py-20 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-cream-200 text-sage-400 mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
              <p className="text-sage-500 max-w-md mx-auto mb-6">
                We couldn't find any courses matching your search criteria. Try adjusting your filters or search term.
              </p>
              <Button onClick={() => { setSearch(""); }}>
                Clear all filters
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
