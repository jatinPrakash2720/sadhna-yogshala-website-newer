"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IWorkshopTimelineItem } from "@/types";

export default function WorkshopTimeline({
  items,
  compact = false,
}: {
  items: IWorkshopTimelineItem[];
  compact?: boolean;
}) {
  if (!items?.length) return null;

  return (
    <div className="relative">
      <div className="absolute left-[4.45rem] top-3 bottom-3 w-px bg-brand-100" />
      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={`${item.time}-${item.title}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
            className="relative grid grid-cols-[4.5rem_1fr] gap-4"
          >
            <div className="text-xs font-bold text-brand-700 pt-1">{item.time}</div>
            <div className="relative">
              <span className="absolute -left-[1.05rem] top-1.5 h-3 w-3 rounded-full bg-brand-600 ring-4 ring-brand-50" />
              <div className={cn("rounded-lg border border-cream-200 bg-white", compact ? "p-3" : "p-4")}>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-sage-400" />
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                </div>
                {item.description && (
                  <p className="mt-1 text-xs leading-5 text-sage-500">{item.description}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
