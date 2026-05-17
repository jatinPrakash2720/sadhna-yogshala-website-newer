"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, ExternalLink, MapPin, Monitor, Sparkles, Users, Video } from "lucide-react";
import { toast } from "sonner";
import CountdownTimer from "./CountdownTimer";
import WorkshopTimeline from "./WorkshopTimeline";
import { formatDate, formatPrice } from "@/lib/utils";
import type { IWorkshop } from "@/types";

export default function WorkshopShowcaseClient({ workshop }: { workshop: IWorkshop }) {
  const [enrolling, setEnrolling] = useState(false);
  const seatsLeft = Math.max(0, workshop.maxParticipants - workshop.currentParticipants);
  const location = workshop.mode === "online" ? "Online" : [workshop.venueName, workshop.city].filter(Boolean).join(", ");

  async function enroll() {
    setEnrolling(true);
    try {
      const res = await fetch(`/api/workshops/${workshop._id}/enroll`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Enrollment failed");
      toast.success(json.data.enrollment.status === "waitlisted" ? "Added to waitlist" : "Workshop enrollment confirmed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  }

  return (
    <main className="bg-cream-50">
      <section className="relative min-h-[82vh] overflow-hidden bg-[#12351f] text-white">
        {workshop.thumbnail?.url && <Image src={workshop.thumbnail.url} alt={workshop.title} fill priority className="object-cover opacity-45" sizes="100vw" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12351f] via-[#12351f]/70 to-[#12351f]/20" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-6 pb-16 pt-28 lg:grid-cols-[1fr_380px] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur">{workshop.category || "Workshop"}</span>
              <span className="rounded-full bg-brand-400 px-3 py-1 text-xs font-bold capitalize text-brand-950">{workshop.mode}</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-6xl">{workshop.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">{workshop.shortDescription}</p>
            <div className="mt-8 grid gap-3 text-sm text-white/90 sm:grid-cols-3">
              <span className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-brand-300" />{formatDate(workshop.startDate)}</span>
              <span className="flex items-center gap-2"><MapPin className="h-5 w-5 text-brand-300" />{location}</span>
              <span className="flex items-center gap-2"><Users className="h-5 w-5 text-brand-300" />{seatsLeft} seats left</span>
            </div>
          </motion.div>
          <motion.aside initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg bg-white p-5 text-gray-900 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-wide text-sage-500">Starts in</p>
            <div className="mt-3"><CountdownTimer target={workshop.startDate} /></div>
            <div className="my-5 border-t border-cream-200" />
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-sage-500">Workshop pass</p>
                <p className="text-3xl font-bold text-brand-800">{formatPrice(workshop.discountPrice ?? workshop.price)}</p>
                {workshop.discountPrice ? <p className="text-sm text-sage-400 line-through">{formatPrice(workshop.price)}</p> : null}
              </div>
              <p className="text-right text-xs font-semibold text-sage-500">{workshop.durationInHours} hours<br />{workshop.durationInDays} day event</p>
            </div>
            <button onClick={enroll} disabled={enrolling || seatsLeft <= 0} className="mt-5 w-full rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-brand hover:bg-brand-700 disabled:opacity-60">
              {enrolling ? "Enrolling..." : seatsLeft <= 0 ? "Sold out" : "Enroll in Workshop"}
            </button>
          </motion.aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <div className="rounded-lg bg-white p-6 shadow-card">
            <h2 className="text-2xl font-bold text-gray-900">About this experience</h2>
            <p className="mt-4 whitespace-pre-line leading-8 text-sage-700">{workshop.fullDescription}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-card">
            <h2 className="mb-5 text-2xl font-bold text-gray-900">Workshop schedule</h2>
            <WorkshopTimeline items={workshop.timeline} />
          </div>
          {workshop.galleryImages?.length ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {workshop.galleryImages.slice(0, 6).map((image) => (
                <div key={image.public_id} className="relative aspect-square overflow-hidden rounded-lg bg-cream-100">
                  <Image src={image.url} alt={workshop.title} fill className="object-cover" sizes="33vw" />
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <aside className="space-y-5">
          <div className="rounded-lg bg-white p-5 shadow-card">
            <h3 className="font-bold text-gray-900">Instructor</h3>
            <p className="mt-2 text-lg font-bold text-brand-800">{workshop.instructor}</p>
            {workshop.guestInstructor ? <p className="text-sm text-sage-500">With {workshop.guestInstructor}</p> : null}
            <p className="mt-3 text-sm leading-6 text-sage-600">{workshop.speakerBio}</p>
          </div>
          <InfoList title="Benefits" items={workshop.benefits} icon={Sparkles} />
          <InfoList title="Requirements" items={workshop.requirements} icon={CheckCircle2} />
          <div className="rounded-lg bg-white p-5 shadow-card">
            <h3 className="font-bold text-gray-900">Access</h3>
            <div className="mt-3 space-y-3 text-sm text-sage-600">
              {(workshop.mode === "online" || workshop.mode === "hybrid") && <p className="flex items-center gap-2"><Video className="h-4 w-4 text-brand-600" />Meeting link shared after enrollment</p>}
              {(workshop.mode === "offline" || workshop.mode === "hybrid") && <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-600" />{workshop.address || location}</p>}
              {workshop.googleMapsLink && <a href={workshop.googleMapsLink} target="_blank" className="inline-flex items-center gap-2 font-semibold text-brand-700"><ExternalLink className="h-4 w-4" />Open map</a>}
              <p className="flex items-center gap-2 capitalize"><Monitor className="h-4 w-4 text-brand-600" />{workshop.mode}</p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function InfoList({ title, items, icon: Icon }: { title: string; items: string[]; icon: any }) {
  if (!items?.length) return null;
  return (
    <div className="rounded-lg bg-white p-5 shadow-card">
      <h3 className="font-bold text-gray-900">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.map((item) => <p key={item} className="flex gap-2 text-sm text-sage-700"><Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600" />{item}</p>)}
      </div>
    </div>
  );
}
