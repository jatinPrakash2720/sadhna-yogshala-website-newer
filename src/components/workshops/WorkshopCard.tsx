"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, Monitor, Users } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/utils";
import type { IWorkshop } from "@/types";

export default function WorkshopCard({ workshop }: { workshop: IWorkshop }) {
  const seatsLeft = Math.max(0, workshop.maxParticipants - workshop.currentParticipants);
  const location = workshop.mode === "online" ? "Online" : [workshop.city, workshop.state].filter(Boolean).join(", ") || workshop.venueName;

  return (
    <Link href={`/workshops/${workshop.slug || workshop._id}`} className="group block overflow-hidden rounded-lg border border-cream-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] bg-cream-100">
        {workshop.thumbnail?.url ? (
          <Image src={workshop.thumbnail.url} alt={workshop.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 33vw, 100vw" />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-700">Workshop</div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold capitalize text-brand-800 shadow-sm">
          {workshop.mode}
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{workshop.category || "Yoga Workshop"}</p>
          <h3 className="mt-1 line-clamp-2 text-base font-bold text-gray-900">{workshop.title}</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-sage-600">
          <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatDate(workshop.startDate)}</span>
          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{workshop.startTime} - {workshop.endTime}</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{location}</span>
          <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{seatsLeft} seats left</span>
        </div>
        <div className="flex items-center justify-between border-t border-cream-100 pt-3">
          <div>
            <span className="text-lg font-bold text-gray-900">{formatPrice(workshop.discountPrice ?? workshop.price)}</span>
            {workshop.discountPrice ? <span className="ml-1 text-xs text-sage-400 line-through">{formatPrice(workshop.price)}</span> : null}
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
            <Monitor className="h-3 w-3" /> {workshop.durationInDays} day{workshop.durationInDays > 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}
