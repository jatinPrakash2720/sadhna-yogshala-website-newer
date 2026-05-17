"use client";

import TimelineRail, { type TimelineItem } from "@/components/ui/timeline-rail";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/utils";
import type { IWorkshop } from "@/types";

function toTimeLabel(workshop: IWorkshop) {
  const [hour = "00", minute = "00"] = workshop.startTime.split(":");
  const date = new Date();
  date.setHours(Number(hour), Number(minute));
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function WorkshopRailTimeline({ workshops }: { workshops: IWorkshop[] }) {
  const visibleWorkshops = workshops.slice(0, 8);
  const items: TimelineItem[] = visibleWorkshops.map((workshop, index) => ({
    href: `/workshops/${workshop.slug || workshop._id}`,
    label: "",
    caption: "",
    active: index < 3,
  }));

  if (!items.length) return null;

  return (
    <div className="rounded-lg border border-cream-200 bg-white p-6 shadow-card">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brand-600">Workshop calendar</p>
          <h2 className="mt-1 text-xl font-bold text-gray-950">Upcoming workshop timeline</h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-sage-500">
          Browse the next events by start time and date.
        </p>
      </div>
      <div className="overflow-x-auto overflow-y-visible pb-3 pt-8">
        <div className="min-w-[1180px]">
          <TimelineRail
            items={items}
            size="md"
            labelAngle={0}
            gapClassName="gap-[9.5rem]"
            lineColorClass="bg-cream-200"
            dotClass="bg-sage-300 hover:bg-sage-400"
            dotActiveClass="bg-brand-700"
            railClassName="left-[5.75rem] right-[5.75rem]"
            className="px-20"
            labelClassName="hidden"
            captionClassName="hidden"
            emphasizeActiveTrail
          />
          <div className="mt-8 grid grid-flow-col auto-cols-[11.5rem] gap-5">
            {visibleWorkshops.map((workshop) => {
              const seatsLeft = Math.max(0, workshop.maxParticipants - workshop.currentParticipants);
              const location = workshop.mode === "online" ? "Online" : workshop.city || workshop.venueName || "Venue";

              return (
                <a
                  key={String(workshop._id)}
                  href={`/workshops/${workshop.slug || workshop._id}`}
                  className="rounded-lg border border-cream-200 bg-cream-50/70 p-3 transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-white hover:shadow-card"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-800">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(workshop.startDate).replace(", 2026", "")}
                  </div>
                  <h3 className="mt-2 min-h-10 text-sm font-bold leading-5 text-gray-950 line-clamp-2">
                    {workshop.title}
                  </h3>
                  <div className="mt-3 space-y-1.5 text-[11px] leading-4 text-sage-600">
                    <p className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{toTimeLabel(workshop)}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{location}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{seatsLeft} seats left</span>
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold capitalize text-brand-700 ring-1 ring-cream-200">
                      {workshop.mode}
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {formatPrice(workshop.discountPrice ?? workshop.price)}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
