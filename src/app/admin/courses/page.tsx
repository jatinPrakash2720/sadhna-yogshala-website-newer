"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  BookOpen,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { formatPrice, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Course {
  _id: string;
  title: string;
  instructorName?: string;
  instructor?: { name: string };
  price: number;
  discountPrice?: number;
  batchType: string;
  isPublished: boolean;
  totalClasses: number;
  startDate: string;
  thumbnail?: { url: string };
  createdAt: string;
}

async function fetchCourses(search: string) {
  const params = new URLSearchParams({ limit: "50", isPublished: "" });
  if (search) params.set("search", search);
  const res = await fetch(`/api/courses?${params.toString().replace("isPublished=", "")}`);
  if (!res.ok) throw new Error("Failed to fetch courses");
  const json = await res.json();
  // Fetch all (including drafts) — admin sees all
  return json.data as Course[];
}

async function deleteCourse(id: string) {
  const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete course");
  return res.json();
}

export default function AdminCoursesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data: courses = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-courses", searchTerm],
    queryFn: () => fetchCourses(searchTerm),
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      toast.success("Course deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      setConfirmDelete(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const filtered = searchTerm
    ? courses.filter((c) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : courses;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Courses</h1>
          <p className="text-sage-500 text-sm mt-0.5">
            {isLoading ? "Loading..." : `${filtered.length} course${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link
          href="/admin/courses/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors shadow-brand"
        >
          <Plus className="h-4 w-4" />
          Create Course
        </Link>
      </div>

      {/* Table card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-cream-200 shadow-card overflow-hidden"
      >
        {/* Toolbar */}
        <div className="p-4 border-b border-cream-200 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-cream-50/50">
          <div className="relative w-full sm:max-w-xs">
            <Search className="h-4 w-4 text-sage-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
            />
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 text-xs text-sage-500 hover:text-gray-700 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <AlertCircle className="h-8 w-8 text-red-400" />
            <p className="text-sm text-sage-500">Failed to load courses</p>
            <button
              onClick={() => refetch()}
              className="text-xs text-brand-600 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-16 w-16 rounded-2xl bg-cream-100 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-sage-400" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-700">No courses found</p>
              <p className="text-sm text-sage-400 mt-1">
                {searchTerm ? "Try a different search" : "Create your first course to get started"}
              </p>
            </div>
            {!searchTerm && (
              <Link
                href="/admin/courses/create"
                className="flex items-center gap-2 text-sm font-semibold text-white bg-brand-600 px-4 py-2 rounded-xl hover:bg-brand-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create Course
              </Link>
            )}
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-cream-50/80 text-sage-600 font-semibold border-b border-cream-200 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3">Course</th>
                  <th className="px-6 py-3">Instructor</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Batch</th>
                  <th className="px-6 py-3 text-center">Price</th>
                  <th className="px-6 py-3 text-center">Classes</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                <AnimatePresence>
                  {filtered.map((course) => (
                    <motion.tr
                      key={course._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-cream-50/50 transition-colors"
                    >
                      {/* Course title */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-cream-100 text-brand-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {course.thumbnail?.url ? (
                              <img
                                src={course.thumbnail.url}
                                alt={course.title}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              <BookOpen className="h-5 w-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate max-w-[220px]">{course.title}</p>
                            <p className="text-[11px] text-sage-400">
                              {course.startDate ? formatDate(course.startDate) : "No start date"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Instructor */}
                      <td className="px-6 py-4 text-sage-600">
                        {course.instructor?.name || course.instructorName || "—"}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold",
                          course.isPublished
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        )}>
                          {course.isPublished ? (
                            <><Eye className="h-3 w-3" /> Published</>
                          ) : (
                            <><EyeOff className="h-3 w-3" /> Draft</>
                          )}
                        </span>
                      </td>

                      {/* Batch */}
                      <td className="px-6 py-4 text-center">
                        <span className="capitalize text-sage-600 text-xs font-medium">
                          {course.batchType}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-center font-semibold text-gray-900">
                        {formatPrice(course.discountPrice ?? course.price)}
                        {course.discountPrice && (
                          <span className="ml-1 text-[10px] text-sage-400 line-through font-normal">
                            {formatPrice(course.price)}
                          </span>
                        )}
                      </td>

                      {/* Classes */}
                      <td className="px-6 py-4 text-center text-sage-600">
                        {course.totalClasses}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/courses/edit/${course._id}`}
                            className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            <Pencil className="h-3 w-3" />
                            Edit
                          </Link>
                          <button
                            onClick={() => setConfirmDelete(course._id)}
                            className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
            >
              <div className="h-12 w-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-base font-bold text-gray-900 text-center">Delete Course?</h3>
              <p className="text-sm text-sage-500 text-center mt-1">
                This will permanently delete the course and all Cloudinary media. This cannot be undone.
              </p>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 text-sm font-semibold border border-cream-200 rounded-xl text-gray-700 hover:bg-cream-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(confirmDelete)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 py-2.5 text-sm font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {deleteMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Deleting...</>
                  ) : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
