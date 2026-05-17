"use client";
import { useState } from "react";
import Image from "next/image";

interface Testimonial {
  quote: string;
  description: string;
  name: string;
  location: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    description:
      "Nunc sed augue lacus viverra vitae congue eu consequat. Vitae et leo duis ut diam quam. Maecenas sed enim ut sem. Placerat duis ultricies.",
    name: "Eva Cramer",
    location: "Hobbs, NM",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    quote:
      "The yoga classes at Sadhana Yogshala have transformed my life. The instructors are knowledgeable and supportive.",
    description:
      "I've been practicing here for over a year and the community is amazing. The peaceful environment helps me find balance in my daily routine.",
    name: "Sarah Johnson",
    location: "Albuquerque, NM",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    quote:
      "Best yoga studio in town! The variety of classes and the serene atmosphere make every session special.",
    description:
      "From beginners to advanced practitioners, everyone feels welcome. The meditation sessions are particularly rejuvenating.",
    name: "Michael Chen",
    location: "Santa Fe, NM",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const currentTestimonial = testimonials[currentIndex];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-8 md:px-20 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column - Testimonials */}
        <div className="bg-white">
          <div className="mb-6">
            <h3 className="text-xs uppercase tracking-widest text-secondary font-semibold mb-4">
              TESTIMONIALS
            </h3>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
              We thank our clients for their feedback
            </h2>
          </div>

          {/* Quote Icon */}
          <div className="mb-6">
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <path
                d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l1.017 2.087c-3.312.783-5.017 3.391-5.017 6.521h4v10h-9zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l1 2.087c-3.312.783-5 3.391-5 6.521h3.5v10h-8.5z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Testimonial Content */}
          <div className="space-y-4 mb-8">
            <p className="text-lg md:text-xl text-primary leading-relaxed">
              {currentTestimonial.quote}
            </p>
            <p className="text-sm md:text-base text-secondary leading-relaxed">
              {currentTestimonial.description}
            </p>
          </div>

          {/* Profile Section */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <Image
                src={currentTestimonial.avatar}
                alt={currentTestimonial.name}
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l1.017 2.087c-3.312.783-5.017 3.391-5.017 6.521h4v10h-9zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l1 2.087c-3.312.783-5 3.391-5 6.521h3.5v10h-8.5z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
            <div>
              <p className="font-semibold text-primary">
                {currentTestimonial.name}
              </p>
              <p className="text-sm text-secondary">
                {currentTestimonial.location}
              </p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border border-accent/30 bg-white text-primary hover:bg-accent/10 transition-colors flex items-center justify-center"
              aria-label="Previous testimonial"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full border border-accent/30 bg-white text-primary hover:bg-accent/10 transition-colors flex items-center justify-center"
              aria-label="Next testimonial"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Column - Video Player */}
        <div className="relative w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden">
          {!isVideoPlaying ? (
            <>
              <Image
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773"
                alt="Meditation practice"
                fill
                className="object-cover"
              />
              <button
                onClick={handlePlayVideo}
                className="absolute inset-0 bg-transparent hover:bg-black/5 transition-colors group flex items-center justify-center"
                aria-label="Play video"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary ml-1"
                  >
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                </div>
              </button>
            </>
          ) : (
            <div className="w-full h-full bg-black flex items-center justify-center">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Yoga Practice Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
