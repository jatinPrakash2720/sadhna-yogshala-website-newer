"use client";

import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { computeDurationInMonths } from "@/lib/courseSchedule";
import type { CourseBuilderFormValues } from "@/hooks/useCourseBuilder";
import CourseSchedulePicker from "@/components/course-builder/CourseSchedulePicker";

interface ScheduleSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<CourseBuilderFormValues, any, any>;
}

export default function ScheduleSection({ form }: ScheduleSectionProps) {
  const { register, setValue, watch, formState: { errors } } = form;

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const scheduledSessions = watch("scheduledSessions") ?? [];

  const hasValidRange =
    Boolean(startDate) &&
    Boolean(endDate) &&
    new Date(endDate) >= new Date(startDate);

  const durationInMonths =
    hasValidRange ? computeDurationInMonths(startDate, endDate) : 0;

  useEffect(() => {
    if (!hasValidRange) return;
    setValue("durationInMonths", durationInMonths, { shouldDirty: true });
    setValue("totalClasses", scheduledSessions.length, { shouldDirty: true });
  }, [
    hasValidRange,
    durationInMonths,
    scheduledSessions.length,
    setValue,
  ]);

  useEffect(() => {
    if (!hasValidRange) return;
    const validKeys = new Set<string>();
    const cursor = new Date(startDate);
    cursor.setHours(12, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(12, 0, 0, 0);
    while (cursor <= end) {
      const year = cursor.getFullYear();
      const month = String(cursor.getMonth() + 1).padStart(2, "0");
      const day = String(cursor.getDate()).padStart(2, "0");
      validKeys.add(`${year}-${month}-${day}`);
      cursor.setDate(cursor.getDate() + 1);
    }
    const filtered = scheduledSessions.filter((session) =>
      validKeys.has(session.scheduledDate)
    );
    if (filtered.length !== scheduledSessions.length) {
      setValue("scheduledSessions", filtered, { shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, hasValidRange, setValue]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="input-label flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-sage-400" />
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            {...register("startDate")}
            type="date"
            className={cn("input-field", errors.startDate && "border-red-400")}
          />
          {errors.startDate && (
            <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>
          )}
        </div>
        <div>
          <label className="input-label">End Date <span className="text-red-500">*</span></label>
          <input
            {...register("endDate")}
            type="date"
            className={cn("input-field", errors.endDate && "border-red-400")}
          />
          {errors.endDate && (
            <p className="mt-1 text-xs text-red-500">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {hasValidRange && (
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-brand-100 bg-brand-50/50 px-4 py-3 text-sm">
          <div className="flex items-center gap-2 text-brand-800">
            <Clock className="h-4 w-4" />
            <span>
              Duration: <strong>{durationInMonths}</strong> month
              {durationInMonths === 1 ? "" : "s"}
            </span>
          </div>
          <div className="text-sage-600">
            Total classes: <strong>{scheduledSessions.length}</strong>
          </div>
        </div>
      )}

      {hasValidRange ? (
        <CourseSchedulePicker
          startDate={startDate}
          endDate={endDate}
          sessions={scheduledSessions}
          onChange={(sessions) =>
            setValue("scheduledSessions", sessions, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
      ) : (
        <div className="rounded-xl border border-dashed border-cream-300 bg-cream-50/50 px-4 py-10 text-center text-sm text-sage-500">
          Select start and end dates to open the schedule calendar.
        </div>
      )}

      {errors.scheduledSessions && (
        <p className="text-sm text-red-600">
          {typeof errors.scheduledSessions.message === "string"
            ? errors.scheduledSessions.message
            : "Fix scheduled class times before continuing"}
        </p>
      )}
    </div>
  );
}
