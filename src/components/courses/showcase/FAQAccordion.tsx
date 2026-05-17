"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "Do I need any prior yoga experience?",
    answer: "Not at all. This course is designed to accommodate absolute beginners while offering depth for experienced practitioners. We start with foundational movements and progressively build up."
  },
  {
    question: "How long do I have access to the course materials?",
    answer: "You get lifetime access! Once enrolled, you can return to the videos, assignments, and community resources whenever you want, for as long as you want."
  },
  {
    question: "What equipment do I need?",
    answer: "A standard yoga mat, comfortable clothing, and a quiet space are all you really need. Optional props like yoga blocks or a strap can be helpful but are not strictly required."
  },
  {
    question: "Is there a money-back guarantee?",
    answer: "Yes, we offer a 7-day no-questions-asked money-back guarantee. If you feel the course isn't right for you, simply contact our support team within the first week for a full refund."
  }
];

export const FAQAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-8">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="h-12 w-12 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
          <MessageCircleQuestion className="h-6 w-6 text-brand-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Frequently Asked Questions</h2>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {FAQS.map((faq, idx) => (
          <div 
            key={idx}
            className={cn(
              "bg-white rounded-3xl border transition-all duration-300 overflow-hidden",
              openIndex === idx ? "border-brand-200 shadow-md" : "border-cream-200 shadow-sm hover:border-brand-200"
            )}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between p-6 sm:p-8 text-left bg-transparent"
            >
              <h4 className="text-lg font-bold text-gray-900 pr-8">{faq.question}</h4>
              <div className={cn(
                "h-8 w-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300",
                openIndex === idx ? "bg-brand-600 border-brand-600" : "bg-cream-50 border-cream-200"
              )}>
                <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", openIndex === idx ? "text-white rotate-180" : "text-sage-400")} />
              </div>
            </button>
            
            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-6 sm:p-8 pt-0 text-sage-600 leading-relaxed border-t border-cream-100 mt-2">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};
