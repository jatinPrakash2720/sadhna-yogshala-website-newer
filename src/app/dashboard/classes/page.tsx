"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Video, User, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MOCK_CLASSES } from "@/lib/mocks/data";
import { formatDateTime, getTimeRemaining } from "@/lib/utils";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const statusColors = {
  upcoming: "gold" as const,
  live: "red" as const,
  completed: "green" as const,
  cancelled: "gray" as const,
};

export default function ClassesPage() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="p-6 sm:p-8 max-w-3xl mx-auto">
      <motion.div variants={fadeUp} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Upcoming Classes</h1>
        <p className="text-sage-500">{MOCK_CLASSES.filter((c) => c.status === "upcoming").length} sessions scheduled</p>
      </motion.div>

      <div className="space-y-4">
        {MOCK_CLASSES.map((cls) => (
          <motion.div
            key={cls.id}
            variants={fadeUp}
            className={`card p-6 ${cls.status === "live" ? "border-red-200 bg-red-50/30" : ""}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${cls.status === "live" ? "bg-red-100" : "bg-brand-50"}`}>
                  <Video className={`h-6 w-6 ${cls.status === "live" ? "text-red-500" : "text-brand-600"}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h2 className="font-bold text-gray-900 text-sm sm:text-base">{cls.title}</h2>
                    <Badge variant={statusColors[cls.status]} className="capitalize text-[10px]">
                      {cls.status === "live" && <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse mr-1 inline-block" />}
                      {cls.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-sage-400 mb-2">{cls.courseTitle}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-sage-500">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-brand-500" />{formatDateTime(cls.scheduledAt)}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-brand-500" />{cls.duration} mins</span>
                    <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-brand-500" />{cls.instructor}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {cls.status === "upcoming" && (
                  <p className="text-xs text-earth-600 font-semibold">Starts in {getTimeRemaining(cls.scheduledAt)}</p>
                )}
                <a href={cls.meetLink} target="_blank" rel="noopener noreferrer">
                  <Button variant={cls.status === "live" ? "accent" : "secondary"} size="sm" id={`join-class-${cls.id}`} disabled={cls.status === "completed" || cls.status === "cancelled"}>
                    <ExternalLink className="h-3.5 w-3.5" />
                    {cls.status === "live" ? "Join Now" : "Join Link"}
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
