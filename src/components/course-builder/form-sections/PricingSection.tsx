"use client";

/**
 * Pricing & Batch Section — price, discountPrice, duration, classes, batch, dates, platform
 */

import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { DollarSign, Calendar, Clock, Video, Sun, Sunset, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CourseBuilderFormValues } from "@/hooks/useCourseBuilder";

const BATCH_TYPES = [
  { value: "morning", label: "Morning", icon: Sun, color: "text-amber-500", bg: "bg-amber-50 border-amber-200" },
  { value: "afternoon", label: "Afternoon", icon: Sunset, color: "text-orange-500", bg: "bg-orange-50 border-orange-200" },
  { value: "evening", label: "Evening", icon: Moon, color: "text-indigo-500", bg: "bg-indigo-50 border-indigo-200" },
];

const PLATFORMS = [
  { value: "zoom", label: "Zoom" },
  { value: "google-meet", label: "Google Meet" },
];

interface PricingSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<CourseBuilderFormValues, any, any>;
}

export default function PricingSection({ form }: PricingSectionProps) {
  const { register, setValue, watch, formState: { errors } } = form;

  const batchType = watch("batchType");
  const price = Number(watch("price") || 0);
  const discountPrice = Number(watch("discountPrice") || 0);
  const discountPercent = price > 0 && discountPrice > 0 && discountPrice < price
    ? Math.round(((price - discountPrice) / price) * 100)
    : null;

  return (
    <div className="space-y-5">
      {/* Price row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Price */}
        <div>
          <label className="input-label">
            Price (₹) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400 text-sm font-medium">₹</span>
            <input
              {...register("price", { valueAsNumber: true })}
              type="number"
              min={0}
              step={1}
              placeholder="4999"
              className={cn("input-field pl-7", errors.price && "border-red-400")}
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>
          )}
        </div>

        {/* Discount price */}
        <div>
          <label className="input-label">
            Discount Price (₹)
            <span className="ml-1 text-xs font-normal text-sage-400">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400 text-sm font-medium">₹</span>
            <input
              {...register("discountPrice", { valueAsNumber: true, setValueAs: v => v === "" ? undefined : Number(v) })}
              type="number"
              min={0}
              step={1}
              placeholder="3499"
              className="input-field pl-7"
            />
          </div>
          {discountPercent && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-xs text-green-600 font-semibold"
            >
              🎉 {discountPercent}% discount
            </motion.p>
          )}
        </div>
      </div>

      {/* Duration + Total Classes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="input-label flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-sage-400" />
            Duration (months) <span className="text-red-500">*</span>
          </label>
          <input
            {...register("durationInMonths", { valueAsNumber: true })}
            type="number"
            min={1}
            max={24}
            placeholder="3"
            className={cn("input-field", errors.durationInMonths && "border-red-400")}
          />
          {errors.durationInMonths && (
            <p className="mt-1 text-xs text-red-500">{errors.durationInMonths.message}</p>
          )}
        </div>

        <div>
          <label className="input-label">
            Total Classes <span className="text-red-500">*</span>
          </label>
          <input
            {...register("totalClasses", { valueAsNumber: true })}
            type="number"
            min={1}
            max={500}
            placeholder="45"
            className={cn("input-field", errors.totalClasses && "border-red-400")}
          />
          {errors.totalClasses && (
            <p className="mt-1 text-xs text-red-500">{errors.totalClasses.message}</p>
          )}
        </div>
      </div>

      {/* Batch Type */}
      <div>
        <label className="input-label">
          Batch Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {BATCH_TYPES.map(({ value, label, icon: Icon, color, bg }) => {
            const isSelected = batchType === value;
            return (
              <motion.button
                key={value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setValue("batchType", value as any, { shouldDirty: true })}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 text-center",
                  isSelected ? bg + " shadow-sm" : "bg-white border-cream-200 hover:border-cream-300"
                )}
              >
                <Icon className={cn("h-5 w-5", isSelected ? color : "text-sage-400")} />
                <span className={cn("text-xs font-semibold", isSelected ? "text-gray-800" : "text-sage-500")}>
                  {label}
                </span>
              </motion.button>
            );
          })}
        </div>
        {errors.batchType && (
          <p className="mt-1 text-xs text-red-500">{errors.batchType.message}</p>
        )}
      </div>

      {/* Meeting Platform */}
      <div>
        <label className="input-label flex items-center gap-1.5">
          <Video className="h-3.5 w-3.5 text-sage-400" />
          Meeting Platform <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {PLATFORMS.map(({ value, label }) => {
            const isSelected = watch("meetingPlatform") === value;
            return (
              <motion.button
                key={value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setValue("meetingPlatform", value as any, { shouldDirty: true })}
                className={cn(
                  "flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium",
                  isSelected
                    ? "bg-brand-50 border-brand-300 text-brand-700 shadow-sm"
                    : "bg-white border-cream-200 text-sage-500 hover:border-cream-300"
                )}
              >
                <Video className={cn("h-4 w-4", isSelected ? "text-brand-600" : "text-sage-400")} />
                {label}
              </motion.button>
            );
          })}
        </div>
        {errors.meetingPlatform && (
          <p className="mt-1 text-xs text-red-500">{errors.meetingPlatform.message}</p>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="input-label flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-sage-400" />
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            {...register("startDate")}
            type="date"
            className={cn("input-field", errors.startDate && "border-red-400")}
          />
          {errors.startDate && (
            <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label className="input-label flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-sage-400" />
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            {...register("endDate")}
            type="date"
            className={cn("input-field", errors.endDate && "border-red-400")}
          />
          {errors.endDate && (
            <p className="mt-1 text-xs text-red-500">{errors.endDate.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
