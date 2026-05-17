"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CalendarDays, Edit, Loader2, MapPin, Plus, Search, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { cn, formatDate, formatPrice } from "@/lib/utils";

interface WorkshopRow {
  _id: string;
  title: string;
  category: string;
  mode: string;
  startDate: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  discountPrice?: number;
  city?: string;
  venueName?: string;
  isPublished: boolean;
  thumbnail?: { url: string };
}

async function fetchWorkshops(search: string) {
  const params = new URLSearchParams({ limit: "50", all: "true" });
  if (search) params.set("search", search);
  const res = await fetch(`/api/workshops?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load workshops");
  const json = await res.json();
  return json.data as WorkshopRow[];
}

async function deleteWorkshop(id: string) {
  const res = await fetch(`/api/workshops/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete workshop");
  return res.json();
}

export default function AdminWorkshopsPage() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["admin-workshops", search], queryFn: () => fetchWorkshops(search) });
  const deleteMutation = useMutation({
    mutationFn: deleteWorkshop,
    onSuccess: () => {
      toast.success("Workshop deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-workshops"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workshops</h1>
          <p className="mt-0.5 text-sm text-sage-500">Event-based yoga sessions, retreats, and premium experiences.</p>
        </div>
        <Link href="/admin/workshops/create" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-brand hover:bg-brand-700">
          <Plus className="h-4 w-4" /> Create Workshop
        </Link>
      </div>

      <div className="rounded-lg border border-cream-200 bg-white shadow-card">
        <div className="border-b border-cream-200 bg-cream-50/50 p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sage-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search workshops..." className="input pl-9" />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand-600" /></div>
        ) : (
          <div className="divide-y divide-cream-100">
            {data.map((workshop) => {
              const seatsLeft = workshop.maxParticipants - workshop.currentParticipants;
              return (
                <motion.div key={workshop._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div className="flex gap-4">
                    <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-cream-100">
                      {workshop.thumbnail?.url ? <img src={workshop.thumbnail.url} alt="" className="h-full w-full object-cover" /> : null}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate font-bold text-gray-900">{workshop.title}</h2>
                        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold", workshop.isPublished ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700")}>{workshop.isPublished ? "Published" : "Draft"}</span>
                        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold capitalize text-brand-700">{workshop.mode}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-sage-600">
                        <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{formatDate(workshop.startDate)} · {workshop.startTime}-{workshop.endTime}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{workshop.city || workshop.venueName || "Online"}</span>
                        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{seatsLeft} seats left</span>
                        <span className="font-bold text-gray-900">{formatPrice(workshop.discountPrice ?? workshop.price)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/workshops/edit/${workshop._id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-2 text-xs font-bold text-brand-700"><Edit className="h-3.5 w-3.5" /> Edit</Link>
                    <button onClick={() => deleteMutation.mutate(workshop._id)} className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
