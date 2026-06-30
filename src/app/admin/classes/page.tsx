"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  ExternalLink,
  Loader2,
  Plus,
  Presentation,
  RefreshCw,
  Trash2,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Course {
  _id: string;
  title: string;
}

interface ClassSession {
  _id: string;
  title: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  meetingLink?: string;
  googleEventId?: string;
  status: string;
  course: { _id: string; title: string; instructorName?: string };
}

interface CreateClassForm {
  courseId: string;
  title: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
}

const EMPTY_FORM: CreateClassForm = {
  courseId: "",
  title: "",
  scheduledDate: "",
  startTime: "06:30",
  endTime: "07:30",
};

async function fetchCourses(): Promise<Course[]> {
  const res = await fetch("/api/courses?limit=100");
  if (!res.ok) throw new Error("Failed to fetch courses");
  const json = await res.json();
  return (json.data ?? []) as Course[];
}

async function fetchClasses(): Promise<ClassSession[]> {
  const res = await fetch("/api/classes");
  if (!res.ok) throw new Error("Failed to fetch class sessions");
  const json = await res.json();
  return json.data?.sessions ?? [];
}

async function createClassSession(payload: CreateClassForm) {
  const res = await fetch("/api/classes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      courseId: payload.courseId,
      title: payload.title,
      scheduledDate: payload.scheduledDate,
      startTime: payload.startTime,
      endTime: payload.endTime,
    }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message ?? "Failed to create class session");
  }
  return json.data?.classSession;
}

async function deleteClassSession(id: string) {
  const res = await fetch(`/api/classes/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message ?? "Failed to delete class session");
  }
}

export default function AdminClassesPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CreateClassForm>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);

  const {
    data: courses = [],
    isLoading: coursesLoading,
  } = useQuery({
    queryKey: ["admin-class-courses"],
    queryFn: fetchCourses,
  });

  const {
    data: sessions = [],
    isLoading: sessionsLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin-class-sessions"],
    queryFn: fetchClasses,
  });

  const createMutation = useMutation({
    mutationFn: createClassSession,
    onSuccess: (session) => {
      toast.success("Class scheduled with Google Meet link");
      queryClient.invalidateQueries({ queryKey: ["admin-class-sessions"] });
      setForm(EMPTY_FORM);
      setShowForm(false);
      if (session?.meetingLink) {
        toast.message("Meet link ready", {
          description: "Students will be invited after the daily calendar sync.",
        });
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteClassSession,
    onSuccess: () => {
      toast.success("Class session deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-class-sessions"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.courseId || !form.title || !form.scheduledDate) {
      toast.error("Please fill in course, title, and date");
      return;
    }
    createMutation.mutate(form);
  };

  const upcomingSessions = [...sessions].sort(
    (a, b) =>
      new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime() ||
      a.startTime.localeCompare(b.startTime)
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Live Classes</h1>
          <p className="text-sm text-sage-500">
            Schedule sessions with auto-generated Google Meet links and calendar events
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Schedule Class
        </button>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4">
        <Video className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
        <div className="text-sm text-brand-800">
          <p className="font-medium">Google Calendar integration</p>
          <p className="mt-1 text-brand-700/80">
            Each class creates a Google Calendar event with a Meet link. Paid enrollments are
            batched as attendees every day at 6:30 AM IST.
          </p>
        </div>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="rounded-xl border border-cream-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-bold text-gray-900">New Class Session</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="input-label">Course</label>
              <select
                value={form.courseId}
                onChange={(e) => setForm((prev) => ({ ...prev, courseId: e.target.value }))}
                className="input-field"
                disabled={coursesLoading}
                required
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="input-label">Class Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Morning Hatha Yoga"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="input-label flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-sage-400" />
                Date
              </label>
              <input
                type="date"
                value={form.scheduledDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, scheduledDate: e.target.value }))
                }
                className="input-field"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="input-label flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-sage-400" />
                  Start
                </label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, startTime: e.target.value }))
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="input-label">End</label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, endTime: e.target.value }))
                  }
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-cream-200 px-4 py-2 text-sm font-medium text-sage-600 hover:bg-cream-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Presentation className="h-4 w-4" />
              )}
              Create with Google Meet
            </button>
          </div>
        </motion.form>
      )}

      <div className="overflow-hidden rounded-xl border border-cream-200 bg-white">
        <div className="flex items-center justify-between border-b border-cream-100 px-6 py-4">
          <h2 className="font-bold text-gray-900">Scheduled Sessions</h2>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 text-sm text-sage-500 hover:text-brand-600"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {sessionsLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-sm text-red-500">
            Failed to load class sessions.
          </div>
        ) : upcomingSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <Presentation className="mb-3 h-10 w-10 text-sage-300" />
            <p className="font-medium text-gray-900">No class sessions yet</p>
            <p className="mt-1 max-w-sm text-sm text-sage-500">
              Schedule your first live class to create a Google Calendar event and Meet link.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-cream-100">
            {upcomingSessions.map((session) => (
              <div
                key={session._id}
                className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{session.title}</h3>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                        session.status === "upcoming"
                          ? "bg-green-50 text-green-700"
                          : "bg-sage-100 text-sage-600"
                      )}
                    >
                      {session.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-sage-500">
                    {session.course?.title ?? "Course"}
                  </p>
                  <p className="mt-1 flex items-center gap-3 text-sm text-sage-600">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(session.scheduledDate)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {session.startTime} – {session.endTime}
                    </span>
                  </p>
                  {session.meetingLink && (
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open Google Meet
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Delete this class and its calendar event?")) {
                      deleteMutation.mutate(session._id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="inline-flex items-center gap-1.5 self-start rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
