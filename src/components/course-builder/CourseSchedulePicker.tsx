"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { COURSE_TIME_SLOTS } from "@/constants";
import {
  formatDateKey,
  getDatesInRange,
  sortScheduledSessions,
} from "@/lib/courseSchedule";
import type { IScheduledSession } from "@/types";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CourseSchedulePickerProps {
  startDate: string;
  endDate: string;
  sessions: IScheduledSession[];
  onChange: (sessions: IScheduledSession[]) => void;
}

function sessionForDate(
  sessions: IScheduledSession[],
  dateKey: string
): IScheduledSession | undefined {
  return sessions.find((session) => session.scheduledDate === dateKey);
}

function isSlotSelected(
  session: IScheduledSession | undefined,
  slotKey: string
): boolean {
  return Boolean(session?.slotKey === slotKey);
}

export default function CourseSchedulePicker({
  startDate,
  endDate,
  sessions,
  onChange,
}: CourseSchedulePickerProps) {
  const rangeDates = useMemo(
    () => getDatesInRange(startDate, endDate),
    [startDate, endDate]
  );

  const rangeDateKeys = useMemo(
    () => new Set(rangeDates.map((date) => formatDateKey(date))),
    [rangeDates]
  );

  const [viewMonth, setViewMonth] = useState(() => {
    const first = new Date(startDate);
    return new Date(first.getFullYear(), first.getMonth(), 1);
  });

  const sortedSessions = useMemo(
    () => sortScheduledSessions(sessions),
    [sessions]
  );

  const upsertSession = (next: IScheduledSession) => {
    const filtered = sessions.filter(
      (session) => session.scheduledDate !== next.scheduledDate
    );
    onChange(sortScheduledSessions([...filtered, next]));
  };

  const removeSession = (dateKey: string) => {
    onChange(sessions.filter((session) => session.scheduledDate !== dateKey));
  };

  const selectDateOnly = (dateKey: string) => {
    const existing = sessionForDate(sessions, dateKey);
    if (existing && !existing.slotKey) {
      removeSession(dateKey);
      return;
    }
    upsertSession({
      scheduledDate: dateKey,
      startTime: "",
      endTime: "",
      slotKey: "custom",
    });
  };

  const selectSlot = (dateKey: string, slot: (typeof COURSE_TIME_SLOTS)[number]) => {
    const existing = sessionForDate(sessions, dateKey);
    if (existing?.slotKey === slot.key) {
      removeSession(dateKey);
      return;
    }
    upsertSession({
      scheduledDate: dateKey,
      startTime: slot.startTime,
      endTime: slot.endTime,
      slotKey: slot.key,
    });
  };

  const updateSessionTime = (
    dateKey: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    onChange(
      sortScheduledSessions(
        sessions.map((session) =>
          session.scheduledDate === dateKey
            ? { ...session, [field]: value }
            : session
        )
      )
    );
  };

  const monthStart = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const monthEnd = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0);
  const gridStart = new Date(monthStart);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  const calendarCells: Date[] = [];
  const cursor = new Date(gridStart);
  for (let i = 0; i < 42; i++) {
    calendarCells.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  const canGoPrev =
    monthStart > new Date(new Date(startDate).getFullYear(), new Date(startDate).getMonth(), 1);
  const canGoNext =
    monthEnd < new Date(new Date(endDate).getFullYear(), new Date(endDate).getMonth(), 1);

  const monthLabel = viewMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-cream-200 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <Calendar className="h-4 w-4 text-brand-600" />
            Select class dates & time slots
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={!canGoPrev}
              onClick={() =>
                setViewMonth(
                  new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1)
                )
              }
              className="rounded-lg border border-cream-200 p-1.5 text-sage-500 transition hover:bg-cream-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[140px] text-center text-sm font-medium text-gray-800">
              {monthLabel}
            </span>
            <button
              type="button"
              disabled={!canGoNext}
              onClick={() =>
                setViewMonth(
                  new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)
                )
              }
              className="rounded-lg border border-cream-200 p-1.5 text-sage-500 transition hover:bg-cream-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-cream-200 bg-cream-50/60">
          {WEEKDAY_LABELS.map((day) => (
            <div
              key={day}
              className="px-1 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-sage-500 sm:text-xs"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarCells.map((day) => {
            const dateKey = formatDateKey(day);
            const inRange = rangeDateKeys.has(dateKey);
            const inMonth = day.getMonth() === viewMonth.getMonth();
            const session = sessionForDate(sessions, dateKey);
            const isSelected = Boolean(session);
            const isDateOnly = isSelected && session?.slotKey === "custom";

            if (!inMonth) {
              return (
                <div
                  key={dateKey + "-pad"}
                  className="min-h-[88px] border-b border-r border-cream-100 bg-cream-50/40 sm:min-h-[110px]"
                />
              );
            }

            return (
              <div
                key={dateKey}
                className={cn(
                  "min-h-[88px] border-b border-r border-cream-200 p-1 sm:min-h-[110px] sm:p-1.5",
                  !inRange && "bg-cream-50/50 opacity-50",
                  inRange && isSelected && "bg-brand-50/40"
                )}
              >
                <button
                  type="button"
                  disabled={!inRange}
                  onClick={() => inRange && selectDateOnly(dateKey)}
                  className={cn(
                    "mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition sm:h-7 sm:w-7 sm:text-sm",
                    isDateOnly
                      ? "bg-brand-600 text-white"
                      : isSelected
                        ? "bg-brand-100 text-brand-700 ring-2 ring-brand-400"
                        : "text-gray-700 hover:bg-cream-100",
                    !inRange && "cursor-not-allowed"
                  )}
                >
                  {day.getDate()}
                </button>

                {inRange && (
                  <div className="space-y-0.5">
                    {COURSE_TIME_SLOTS.map((slot) => {
                      const slotActive = isSlotSelected(session, slot.key);
                      return (
                        <button
                          key={slot.key}
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            selectSlot(dateKey, slot);
                          }}
                          className={cn(
                            "w-full rounded px-1 py-0.5 text-[9px] font-medium leading-tight transition sm:text-[10px]",
                            slotActive
                              ? "bg-brand-600 text-white shadow-sm"
                              : "bg-white text-sage-600 ring-1 ring-cream-200 hover:bg-brand-50 hover:ring-brand-200"
                          )}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">
            Scheduled classes ({sortedSessions.length})
          </h3>
          <p className="text-xs text-sage-500">
            Click a date for custom times, or pick a slot above
          </p>
        </div>

        {sortedSessions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-cream-300 bg-cream-50/50 px-4 py-8 text-center text-sm text-sage-500">
            No classes selected yet. Choose dates on the calendar above.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-cream-200">
            <div className="hidden grid-cols-[1.2fr_0.8fr_1fr_1fr_auto] gap-3 border-b border-cream-200 bg-cream-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-sage-500 sm:grid">
              <span>Date</span>
              <span>Day</span>
              <span>Start time</span>
              <span>End time</span>
              <span />
            </div>
            <div className="divide-y divide-cream-100">
              {sortedSessions.map((session) => {
                const date = new Date(session.scheduledDate);
                const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
                const displayDate = date.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <div
                    key={session.scheduledDate}
                    className="grid grid-cols-1 gap-3 px-4 py-3 sm:grid-cols-[1.2fr_0.8fr_1fr_1fr_auto] sm:items-center"
                  >
                    <div>
                      <p className="text-xs text-sage-500 sm:hidden">Date</p>
                      <p className="text-sm font-medium text-gray-800">{displayDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-sage-500 sm:hidden">Day</p>
                      <p className="text-sm text-sage-600">{dayName}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-sage-500 sm:hidden">Start time</p>
                      <input
                        type="time"
                        value={session.startTime}
                        onChange={(event) =>
                          updateSessionTime(
                            session.scheduledDate,
                            "startTime",
                            event.target.value
                          )
                        }
                        className="input-field h-9 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-sage-500 sm:hidden">End time</p>
                      <input
                        type="time"
                        value={session.endTime}
                        onChange={(event) =>
                          updateSessionTime(
                            session.scheduledDate,
                            "endTime",
                            event.target.value
                          )
                        }
                        className="input-field h-9 py-1 text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSession(session.scheduledDate)}
                      className="flex items-center justify-center rounded-lg border border-cream-200 p-2 text-sage-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 sm:justify-self-end"
                      aria-label="Remove class"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
