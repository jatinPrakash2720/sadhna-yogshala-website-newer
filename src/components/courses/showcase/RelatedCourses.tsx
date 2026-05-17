"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const RELATED_COURSES = [
  {
    id: "1",
    title: "Advanced Vinyasa Flow",
    thumbnail: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&q=80&w=800",
    instructor: "Sarah Jenkins",
    price: 4999,
    rating: 4.9,
    duration: "3 Months",
    slug: "advanced-vinyasa-flow"
  },
  {
    id: "2",
    title: "Meditation & Mindfulness",
    thumbnail: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800",
    instructor: "Michael Chen",
    price: 2999,
    rating: 4.8,
    duration: "1 Month",
    slug: "meditation-mindfulness"
  }
];

export const RelatedCourses: React.FC = () => {
  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">More to Explore</h2>
        <Link href="/courses" className="hidden sm:flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors">
          View All Catalog <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {RELATED_COURSES.map((course) => (
          <Link href={`/courses/${course.slug}`} key={course.id} className="group block">
            <div className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 p-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-cream-100">
                <Image src={course.thumbnail} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="px-2 pb-2">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-brand-600 transition-colors line-clamp-1">{course.title}</h4>
                  <span className="font-black text-gray-900">{formatPrice(course.price)}</span>
                </div>
                <p className="text-xs font-bold text-sage-400 uppercase tracking-widest mb-4">{course.instructor}</p>
                
                <div className="flex items-center gap-4 text-xs font-bold text-sage-600 pt-4 border-t border-cream-100">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-gold-400 fill-gold-400" /> {course.rating} Rating
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-brand-500" /> {course.duration}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-8 text-center sm:hidden">
        <Link href="/courses">
           <button className="w-full py-4 rounded-xl bg-cream-50 font-bold text-brand-700 border border-cream-200">
             View All Catalog
           </button>
        </Link>
      </div>
    </section>
  );
};
