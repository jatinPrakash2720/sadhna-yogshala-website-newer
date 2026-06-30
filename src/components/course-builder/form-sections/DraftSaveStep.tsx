"use client";

import { useQuery } from "@tanstack/react-query";
import { Clock, Save, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatGenerationEstimate } from "@/lib/courseSchedule";
import type { CourseBuilderFormValues } from "@/hooks/useCourseBuilder";
import type { UseFormReturn } from "react-hook-form";

interface DraftSaveStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<CourseBuilderFormValues, any, any>;
  onSaveDraft: (generateCalendarLinks: boolean) => void;
  isSubmitting: boolean;
  calendarLinksGenerated?: boolean;
}

export default function DraftSaveStep({
  form,
  onSaveDraft,
  isSubmitting,
  calendarLinksGenerated,
}: DraftSaveStepProps) {
  const totalClasses = Number(form.watch("totalClasses") || 0);
  const estimate = totalClasses > 0 ? formatGenerationEstimate(totalClasses) : "~1 minute";

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-cream-200 bg-cream-50 p-4 text-sm text-sage-700">
        <p className="font-medium text-gray-900">Review before saving</p>
        <ul className="mt-3 space-y-2 text-xs">
          <li>• Course stays a <strong>draft</strong> — not visible to students yet.</li>
          <li>• Save without links if you are still editing the schedule.</li>
          <li>• Save with links to create all Google Meet events for this batch.</li>
          <li>• Enrolled students are added to calendar invites daily at 6:30 AM IST.</li>
        </ul>
      </div>

      {calendarLinksGenerated && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          Google Meet links were previously generated for this course. Saving with links again
          will replace the auto-generated sessions.
        </p>
      )}

      <div className="grid grid-cols-1 gap-3">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => onSaveDraft(false)}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl border-2 border-cream-200 bg-white px-4 py-3.5 text-sm font-semibold text-gray-800 transition hover:bg-cream-50 disabled:opacity-60"
          )}
        >
          <Save className="h-4 w-4" />
          Save Draft (no Meet links)
        </button>

        <button
          type="button"
          disabled={isSubmitting || totalClasses < 1}
          onClick={() => onSaveDraft(true)}
          className={cn(
            "flex flex-col items-center justify-center gap-1 rounded-xl bg-brand-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          )}
        >
          <span className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Save Draft (with Google Meet links)
          </span>
          <span className="flex items-center gap-1 text-[11px] font-normal text-brand-100">
            <Clock className="h-3 w-3" />
            Estimated generation time: {estimate}
          </span>
        </button>
      </div>
    </div>
  );
}
