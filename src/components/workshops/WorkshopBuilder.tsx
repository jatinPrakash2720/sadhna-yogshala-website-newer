"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowLeft, ImagePlus, Plus, Save, Trash2, Video, Wand2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import WorkshopTimeline from "./WorkshopTimeline";
import type { IMediaAsset, IVideoAsset, WorkshopFormData } from "@/types";

const schema = z.object({
  title: z.string().min(3).max(200),
  shortDescription: z.string().max(300).default(""),
  fullDescription: z.string().min(10).max(6000),
  slug: z.string().max(200).default(""),
  category: z.string().default(""),
  tags: z.array(z.string()).default([]),
  price: z.coerce.number().min(0),
  discountPrice: z.coerce.number().min(0).optional(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  durationInHours: z.coerce.number().min(0.5).max(72),
  durationInDays: z.coerce.number().int().min(1).max(3),
  mode: z.enum(["online", "offline", "hybrid"]),
  venueName: z.string().default(""),
  address: z.string().default(""),
  city: z.string().default(""),
  state: z.string().default(""),
  country: z.string().default("India"),
  googleMapsLink: z.string().default(""),
  meetingPlatform: z.string().default("zoom"),
  meetingLink: z.string().default(""),
  maxParticipants: z.coerce.number().int().min(1),
  waitlistEnabled: z.boolean().default(false),
  instructor: z.string().min(2),
  guestInstructor: z.string().default(""),
  speakerBio: z.string().default(""),
  benefits: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  timeline: z.array(z.object({ id: z.string(), time: z.string(), title: z.string(), description: z.string() })).default([]),
  isPublished: z.boolean().default(false),
});

const defaults: WorkshopFormData = {
  title: "",
  shortDescription: "",
  fullDescription: "",
  slug: "",
  category: "Wellness",
  tags: [],
  price: 999,
  discountPrice: undefined,
  startDate: "",
  endDate: "",
  startTime: "09:00",
  endTime: "13:00",
  durationInHours: 4,
  durationInDays: 1,
  mode: "online",
  venueName: "",
  address: "",
  city: "",
  state: "",
  country: "India",
  googleMapsLink: "",
  meetingPlatform: "zoom",
  meetingLink: "",
  maxParticipants: 30,
  waitlistEnabled: true,
  instructor: "",
  guestInstructor: "",
  speakerBio: "",
  benefits: ["Deeper body awareness", "A practical home practice plan"],
  requirements: ["Yoga mat", "Comfortable clothing"],
  timeline: [
    { id: "a", time: "09:00 AM", title: "Introduction", description: "Opening circle, intent setting, and workshop overview." },
    { id: "b", time: "10:00 AM", title: "Yoga Session", description: "Guided posture work with mindful breath." },
    { id: "c", time: "12:00 PM", title: "Meditation", description: "Closing meditation and integration." },
  ],
  isPublished: false,
};

async function upload(file: File, field: "thumbnail" | "introVideo" | "gallery") {
  const formData = new FormData();
  formData.append(field === "gallery" ? "gallery" : field, file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Upload failed");
  return json.data;
}

export default function WorkshopBuilder({
  mode,
  workshopId,
  initialData,
}: {
  mode: "create" | "edit";
  workshopId?: string;
  initialData?: Partial<WorkshopFormData>;
}) {
  const router = useRouter();
  const [thumbnail, setThumbnail] = useState<IMediaAsset | undefined>(initialData?.thumbnail);
  const [introVideo, setIntroVideo] = useState<IVideoAsset | undefined>(initialData?.introVideo);
  const [galleryImages, setGalleryImages] = useState<IMediaAsset[]>(initialData?.galleryImages ?? []);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");

  const form = useForm<WorkshopFormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { ...defaults, ...initialData },
  });
  const values = useWatch({ control: form.control }) as WorkshopFormData;
  const timeline = form.watch("timeline");
  const modeValue = form.watch("mode");

  const seatsLeft = useMemo(() => Math.max(0, (values.maxParticipants || 0) - (initialData as any)?.currentParticipants || 0), [values.maxParticipants, initialData]);

  const onSubmit = form.handleSubmit(async (data) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        tags: data.tags,
        benefits: data.benefits.filter(Boolean),
        requirements: data.requirements.filter(Boolean),
        timeline: data.timeline.map(({ time, title, description }) => ({ time, title, description })),
        thumbnail,
        introVideo,
        galleryImages,
      };
      const res = await fetch(mode === "create" ? "/api/workshops" : `/api/workshops/${workshopId}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to save workshop");
      toast.success(mode === "create" ? "Workshop created" : "Workshop saved");
      router.replace(`/admin/workshops/edit/${json.data.workshop._id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  });

  const addArrayValue = (field: "benefits" | "requirements") => form.setValue(field, [...form.getValues(field), ""]);
  const updateArrayValue = (field: "benefits" | "requirements", index: number, value: string) => {
    const next = [...form.getValues(field)];
    next[index] = value;
    form.setValue(field, next, { shouldDirty: true });
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="sticky top-0 z-20 border-b border-cream-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href="/admin/workshops" className="flex items-center gap-1.5 text-sm font-medium text-sage-600 hover:text-brand-700">
              <ArrowLeft className="h-4 w-4" /> Workshops
            </Link>
            <div className="h-4 w-px bg-cream-200" />
            <div>
              <h1 className="text-sm font-bold text-gray-900">{mode === "create" ? "Create Workshop" : "Edit Workshop"}</h1>
              <p className="max-w-[240px] truncate text-[11px] text-sage-400">{values.title || "Premium event builder"}</p>
            </div>
          </div>
          <button onClick={onSubmit} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-brand hover:bg-brand-700 disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Workshop"}
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1800px] gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_460px]">
        <form onSubmit={onSubmit} className="space-y-5">
          <Section title="Essentials">
            <Field label="Title"><input {...form.register("title")} className="input" placeholder="Full Moon Breathwork Workshop" /></Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Category"><input {...form.register("category")} className="input" /></Field>
              <Field label="Slug"><input {...form.register("slug")} className="input" placeholder="auto-generated if blank" /></Field>
            </div>
            <Field label="Short Description"><input {...form.register("shortDescription")} className="input" /></Field>
            <Field label="Full Description"><textarea {...form.register("fullDescription")} className="input min-h-36" /></Field>
          </Section>

          <Section title="Media">
            <div className="grid gap-3 md:grid-cols-3">
              <UploadButton label="Thumbnail" icon={ImagePlus} uploading={uploading === "thumbnail"} onFile={async (file) => { setUploading("thumbnail"); try { setThumbnail((await upload(file, "thumbnail")).thumbnail); } finally { setUploading(""); } }} />
              <UploadButton label="Intro video" icon={Video} uploading={uploading === "video"} onFile={async (file) => { setUploading("video"); try { setIntroVideo((await upload(file, "introVideo")).introVideo); } finally { setUploading(""); } }} />
              <UploadButton label="Gallery" icon={ImagePlus} uploading={uploading === "gallery"} onFile={async (file) => { setUploading("gallery"); try { const result = await upload(file, "gallery"); setGalleryImages((prev) => [...prev, ...result.gallery]); } finally { setUploading(""); } }} />
            </div>
          </Section>

          <Section title="Timing, Capacity & Pricing">
            <div className="grid gap-4 md:grid-cols-4">
              <Field label="Start date"><input type="date" {...form.register("startDate")} className="input" /></Field>
              <Field label="End date"><input type="date" {...form.register("endDate")} className="input" /></Field>
              <Field label="Start time"><input type="time" {...form.register("startTime")} className="input" /></Field>
              <Field label="End time"><input type="time" {...form.register("endTime")} className="input" /></Field>
              <Field label="Hours"><input type="number" step="0.5" {...form.register("durationInHours")} className="input" /></Field>
              <Field label="Days"><input type="number" {...form.register("durationInDays")} className="input" /></Field>
              <Field label="Price"><input type="number" {...form.register("price")} className="input" /></Field>
              <Field label="Discount price"><input type="number" {...form.register("discountPrice")} className="input" /></Field>
              <Field label="Seats"><input type="number" {...form.register("maxParticipants")} className="input" /></Field>
              <label className="mt-6 flex items-center gap-2 text-sm font-medium text-gray-700"><input type="checkbox" {...form.register("waitlistEnabled")} /> Enable waitlist</label>
              <label className="mt-6 flex items-center gap-2 text-sm font-medium text-gray-700"><input type="checkbox" {...form.register("isPublished")} /> Published</label>
            </div>
          </Section>

          <Section title="Mode & Access">
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Mode"><select {...form.register("mode")} className="input"><option value="online">Online</option><option value="offline">Offline</option><option value="hybrid">Hybrid</option></select></Field>
              {(modeValue === "online" || modeValue === "hybrid") && <><Field label="Platform"><select {...form.register("meetingPlatform")} className="input"><option value="zoom">Zoom</option><option value="google-meet">Google Meet</option><option value="teams">Teams</option><option value="other">Other</option></select></Field><Field label="Meeting link"><input {...form.register("meetingLink")} className="input" /></Field></>}
              {(modeValue === "offline" || modeValue === "hybrid") && <><Field label="Venue"><input {...form.register("venueName")} className="input" /></Field><Field label="City"><input {...form.register("city")} className="input" /></Field><Field label="Google Maps"><input {...form.register("googleMapsLink")} className="input" /></Field><Field label="Address"><textarea {...form.register("address")} className="input md:col-span-3" /></Field></>}
            </div>
          </Section>

          <Section title="Instructor, Benefits & Requirements">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Instructor"><input {...form.register("instructor")} className="input" /></Field>
              <Field label="Guest instructor"><input {...form.register("guestInstructor")} className="input" /></Field>
            </div>
            <Field label="Speaker Bio"><textarea {...form.register("speakerBio")} className="input min-h-24" /></Field>
            <ArrayEditor label="Benefits" values={form.watch("benefits")} onAdd={() => addArrayValue("benefits")} onChange={(i, v) => updateArrayValue("benefits", i, v)} />
            <ArrayEditor label="Requirements" values={form.watch("requirements")} onAdd={() => addArrayValue("requirements")} onChange={(i, v) => updateArrayValue("requirements", i, v)} />
          </Section>

          <Section title="Timeline Builder">
            <div className="space-y-3">
              {timeline.map((item, index) => (
                <div key={item.id} className="grid gap-3 rounded-lg border border-cream-200 bg-cream-50 p-3 md:grid-cols-[120px_1fr_1fr_auto]">
                  <input value={item.time} onChange={(e) => form.setValue(`timeline.${index}.time`, e.target.value)} className="input" />
                  <input value={item.title} onChange={(e) => form.setValue(`timeline.${index}.title`, e.target.value)} className="input" />
                  <input value={item.description} onChange={(e) => form.setValue(`timeline.${index}.description`, e.target.value)} className="input" />
                  <button type="button" onClick={() => form.setValue("timeline", timeline.filter((_, i) => i !== index))} className="rounded-lg border border-red-100 p-2 text-red-500"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => form.setValue("timeline", [...timeline, { id: crypto.randomUUID(), time: "02:00 PM", title: "New session", description: "" }])} className="inline-flex items-center gap-2 rounded-xl border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700"><Plus className="h-4 w-4" /> Add timeline item</button>
            </div>
          </Section>
        </form>

        <aside className="sticky top-20 h-fit rounded-lg border border-cream-200 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-600"><Wand2 className="h-4 w-4" /> Live Preview</div>
          <div className="overflow-hidden rounded-lg border border-cream-200">
            <div className="aspect-[16/10] bg-cream-100">
              {thumbnail?.url ? <img src={thumbnail.url} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sage-500">Thumbnail preview</div>}
            </div>
            <div className="space-y-4 p-4">
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold capitalize text-brand-700">{values.mode}</span>
              <h2 className="text-xl font-bold text-gray-950">{values.title || "Workshop title"}</h2>
              <p className="text-sm leading-6 text-sage-600">{values.shortDescription || "A concise event promise appears here as you type."}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-sage-600">
                <span>{values.startDate ? formatDate(values.startDate) : "Date"}</span>
                <span>{values.startTime} - {values.endTime}</span>
                <span>{values.city || values.venueName || values.meetingPlatform}</span>
                <span>{seatsLeft} seats left</span>
              </div>
              <div className="flex items-end justify-between">
                <div><p className="text-xs text-sage-500">Starts at</p><p className="text-2xl font-bold text-brand-800">{formatPrice(Number(values.discountPrice || values.price || 0))}</p></div>
                <button className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Enroll</button>
              </div>
              <WorkshopTimeline items={timeline} compact />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-lg border border-cream-200 bg-white p-5 shadow-card"><h2 className="mb-4 text-sm font-bold text-gray-900">{title}</h2><div className="space-y-4">{children}</div></section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-sage-600">{label}<div className="mt-1">{children}</div></label>;
}

function UploadButton({ label, icon: Icon, onFile, uploading }: { label: string; icon: any; onFile: (file: File) => void; uploading: boolean }) {
  return <label className={cn("flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-brand-200 bg-brand-50/50 px-4 py-6 text-sm font-semibold text-brand-700", uploading && "opacity-60")}><Icon className="h-5 w-5" />{uploading ? "Uploading..." : label}<input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} /></label>;
}

function ArrayEditor({ label, values, onAdd, onChange }: { label: string; values: string[]; onAdd: () => void; onChange: (index: number, value: string) => void }) {
  return <div><div className="mb-2 flex items-center justify-between"><p className="text-xs font-semibold text-sage-600">{label}</p><button type="button" onClick={onAdd} className="text-xs font-bold text-brand-700">Add</button></div><div className="grid gap-2 md:grid-cols-2">{values.map((value, index) => <input key={index} value={value} onChange={(e) => onChange(index, e.target.value)} className="input" />)}</div></div>;
}
