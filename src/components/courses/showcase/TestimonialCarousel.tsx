"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah Jenkins",
    role: "Yoga Practitioner",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    content: "This course completely changed my perspective on daily wellness. The instructor's guidance is so calming, and the progression of the classes is perfectly paced for absolute beginners like me.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    avatar: "https://i.pravatar.cc/150?u=michael",
    content: "Working long hours at a desk left me with severe back pain. The flexibility and posture correction routines in this program have been a lifesaver. Highly recommended!",
    rating: 5
  },
  {
    name: "Elena Rodriguez",
    role: "Fitness Enthusiast",
    avatar: "https://i.pravatar.cc/150?u=elena",
    content: "I've tried many online yoga classes, but the production quality and curriculum depth here are unmatched. It feels like a premium, in-person studio experience.",
    rating: 4.5
  }
];

export const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section className="bg-brand-900 rounded-[48px] p-10 md:p-16 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-700/30 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <h2 className="text-3xl font-extrabold mb-12 text-center tracking-tight">Student Success Stories</h2>
        
        <div className="max-w-3xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-gold-400 fill-gold-400" />
                ))}
              </div>
              <p className="text-xl md:text-2xl font-medium leading-relaxed mb-10 text-brand-50 italic">
                "{TESTIMONIALS[currentIndex].content}"
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-brand-500">
                  <Image src={TESTIMONIALS[currentIndex].avatar} alt={TESTIMONIALS[currentIndex].name} fill className="object-cover" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-white leading-tight">{TESTIMONIALS[currentIndex].name}</h4>
                  <p className="text-xs text-brand-300">{TESTIMONIALS[currentIndex].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-4 mt-12">
            <button onClick={prev} className="h-12 w-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={next} className="h-12 w-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
