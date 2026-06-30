"use client";

import { useQuery } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CourseBuilderFormValues } from "@/hooks/useCourseBuilder";

interface InstructorUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

async function fetchInstructorOptions(): Promise<InstructorUser[]> {
  const res = await fetch("/api/admin/users?limit=100&role=admin");
  if (!res.ok) throw new Error("Failed to load instructors");
  const json = await res.json();
  return json.data ?? [];
}

interface InstructorSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<CourseBuilderFormValues, any, any>;
}

export default function InstructorSection({ form }: InstructorSectionProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const instructorUserId = watch("instructorUserId") || "";
  const name = watch("instructorName") || "";
  const title = watch("instructorTitle") || "";
  const bio = watch("instructorBio") || "";

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["course-builder-instructors"],
    queryFn: fetchInstructorOptions,
  });

  const handleInstructorSelect = (userId: string) => {
    setValue("instructorUserId", userId, { shouldDirty: true });
    const selected = users.find((user) => user._id === userId);
    if (selected) {
      setValue("instructorName", selected.name, { shouldDirty: true });
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="input-label flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-sage-400" />
          Select Instructor <span className="text-red-500">*</span>
        </label>
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-sage-500 py-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading instructors...
          </div>
        ) : (
          <select
            value={instructorUserId}
            onChange={(e) => handleInstructorSelect(e.target.value)}
            className={cn("input-field", errors.instructorUserId && "border-red-400")}
          >
            <option value="">Choose an instructor</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        )}
        {errors.instructorUserId && (
          <p className="mt-1 text-xs text-red-500">{errors.instructorUserId.message}</p>
        )}
        {errors.instructorName && (
          <p className="mt-1 text-xs text-red-500">{errors.instructorName.message}</p>
        )}
      </div>

      {name && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4 p-4 bg-brand-50 border border-brand-100 rounded-2xl"
        >
          <div className="h-14 w-14 rounded-full bg-brand-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {name[0]?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{name}</p>
            {title && <p className="text-sm text-brand-600">{title}</p>}
            {bio && <p className="text-xs text-sage-500 mt-1 line-clamp-2">{bio}</p>}
          </div>
        </motion.div>
      )}

      <div>
        <label className="input-label">Title / Designation</label>
        <input
          {...register("instructorTitle")}
          placeholder="e.g. Senior Yoga Instructor, RYT 500"
          className="input-field"
        />
      </div>

      <div>
        <label className="input-label">Bio</label>
        <textarea
          {...register("instructorBio")}
          rows={4}
          placeholder="Brief bio about the instructor..."
          className="input-field resize-none"
        />
      </div>
    </div>
  );
}
