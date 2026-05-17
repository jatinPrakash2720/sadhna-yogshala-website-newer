"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, Wind, Sparkles, Heart } from "lucide-react";

export const BenefitsGrid: React.FC = () => {
  const benefits = [
    {
      icon: Activity,
      title: "Enhanced Flexibility",
      description: "Safely expand your range of motion through guided, progressive asana sequences."
    },
    {
      icon: Wind,
      title: "Breath Control",
      description: "Master Pranayama techniques to calm your nervous system and increase lung capacity."
    },
    {
      icon: Heart,
      title: "Stress Relief",
      description: "Lower cortisol levels and find deep relaxation with mindfulness and restorative poses."
    },
    {
      icon: Sparkles,
      title: "Mental Clarity",
      description: "Sharpen your focus and build a resilient mindset through dedicated meditation practices."
    }
  ];

  return (
    <section className="py-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">Transform Your Life</h2>
        <p className="text-sage-500 font-medium">Discover the profound physical and mental benefits of a consistent, guided yoga practice.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {benefits.map((benefit, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-cream-50/50 rounded-3xl p-8 border border-cream-200 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="h-12 w-12 rounded-xl bg-brand-100 flex items-center justify-center mb-6">
              <benefit.icon className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
            <p className="text-sm text-sage-600 leading-relaxed">{benefit.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
