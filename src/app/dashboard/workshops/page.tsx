"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { CalendarDays, ExternalLink, Loader2, MapPin, Video } from "lucide-react";
import CountdownTimer from "@/components/workshops/CountdownTimer";
import WorkshopTimeline from "@/components/workshops/WorkshopTimeline";
import { formatDate } from "@/lib/utils";

async function fetchMyWorkshops() {
  const res = await fetch("/api/workshops/my-workshops");
  if (!res.ok) throw new Error("Failed to load workshops");
  const json = await res.json();
  return json.data.enrollments as any[];
}

export default function DashboardWorkshopsPage() {
  const { data = [], isLoading } = useQuery({ queryKey: ["my-workshops"], queryFn: fetchMyWorkshops });

  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Workshops</h1>
        <p className="mt-1 text-sage-500">Upcoming events, links, maps, and schedules.</p>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand-600" /></div>
      ) : data.length === 0 ? (
        <div className="rounded-lg bg-white p-10 text-center shadow-card">
          <p className="font-bold text-gray-900">No workshop enrollments yet</p>
          <Link href="/workshops" className="mt-4 inline-flex rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white">Browse workshops</Link>
        </div>
      ) : (
        <div className="space-y-5">
          {data.map((enrollment) => {
            const workshop = enrollment.workshop;
            return (
              <div key={enrollment._id} className="rounded-lg border border-cream-200 bg-white p-5 shadow-card">
                <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold capitalize text-brand-700">{enrollment.status}</span>
                      <span className="rounded-full bg-cream-100 px-2.5 py-1 text-xs font-bold capitalize text-sage-700">{workshop.mode}</span>
                    </div>
                    <h2 className="mt-3 text-xl font-bold text-gray-900">{workshop.title}</h2>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-sage-600">
                      <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{formatDate(workshop.startDate)} · {workshop.startTime}-{workshop.endTime}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{workshop.city || workshop.venueName || "Online"}</span>
                    </div>
                    <div className="mt-5"><WorkshopTimeline items={workshop.timeline} compact /></div>
                  </div>
                  <div className="space-y-3">
                    <CountdownTimer target={workshop.startDate} />
                    {workshop.meetingLink && <a href={workshop.meetingLink} target="_blank" className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white"><Video className="h-4 w-4" />Join online</a>}
                    {workshop.googleMapsLink && <a href={workshop.googleMapsLink} target="_blank" className="flex items-center justify-center gap-2 rounded-xl border border-brand-200 px-4 py-2.5 text-sm font-bold text-brand-700"><ExternalLink className="h-4 w-4" />Open map</a>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
