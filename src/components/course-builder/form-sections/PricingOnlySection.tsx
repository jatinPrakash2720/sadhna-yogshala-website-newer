"use client";

import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CourseBuilderFormValues } from "@/hooks/useCourseBuilder";

interface PricingOnlySectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<CourseBuilderFormValues, any, any>;
}

export default function PricingOnlySection({ form }: PricingOnlySectionProps) {
  const { register, watch, formState: { errors } } = form;

  const price = Number(watch("price") || 0);
  const discountPrice = Number(watch("discountPrice") || 0);
  const discountPercent =
    price > 0 && discountPrice > 0 && discountPrice < price
      ? Math.round(((price - discountPrice) / price) * 100)
      : null;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <div>
          <label className="input-label">
            Discount Price (₹)
            <span className="ml-1 text-xs font-normal text-sage-400">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400 text-sm font-medium">₹</span>
            <input
              {...register("discountPrice", {
                valueAsNumber: true,
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
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
              {discountPercent}% discount
            </motion.p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-cream-200 bg-cream-50 p-4 text-sm text-sage-600">
        <DollarSign className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Students pay this price to enroll. Google Meet links for the full batch are
          generated when you save the draft with calendar links on the final step.
        </p>
      </div>
    </div>
  );
}
