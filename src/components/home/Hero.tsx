"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const HERO_BACKGROUNDS = [
  {
    src: "/mountain-hero.png",
    alt: "Mountain Yoga Background",
  },
  {
    src: "/background-image/pexels-guilherme-xac-2734805-5466261.jpg",
    alt: "Yoga practice at sunrise",
  },
  {
    src: "/background-image/pexels-maxt-4248988.jpg",
    alt: "Outdoor wellness and yoga landscape",
  },
  {
    src: "/background-image/pexels-ray-lei-2809836-13849093.jpg",
    alt: "Peaceful yoga retreat setting",
  },
  {
    src: "/background-image/pexels-taryn-elliott-7565610.jpg",
    alt: "Mindful yoga session",
  },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % HERO_BACKGROUNDS.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? HERO_BACKGROUNDS.length - 1 : current - 1
    );
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % HERO_BACKGROUNDS.length);
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col">
      {/* Hero Content Section */}
      <div className="relative w-full h-screen flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          {HERO_BACKGROUNDS.map((background, index) => (
            <Image
              key={background.src}
              src={background.src}
              alt={background.alt}
              fill
              className={`object-cover object-center transition-opacity duration-1000 ease-in-out ${
                index === activeIndex ? "opacity-100" : "opacity-0"
              }`}
              priority={index === 0}
              sizes="100vw"
            />
          ))}
          {/* Subtle overlay for text readability */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="max-w-4xl mx-auto px-8 w-full text-center text-white z-10">
          <h1 className="text-4xl md:text-6xl lg:text-[5.1rem] font-outfit font-light mb-8 leading-tight tracking-wide">
            YOU CANNOT DO YOGA <br />
            <span className="font-normal">YOGA IS YOUR NATURAL STATE</span>
          </h1>

          <Link
            href="/login"
            className="inline-block bg-brand-600 text-white px-10 py-4 rounded-full font-bold text-sm tracking-widest hover:bg-brand-700 transition-all shadow-lg uppercase mt-8"
          >
            Join Now
          </Link>
        </div>

        {/* Navigation Arrows (Visual) */}
        <button
          type="button"
          onClick={goToPrevious}
          className="absolute left-8 top-1/2 z-10 hidden -translate-y-1/2 text-white/50 transition-colors hover:text-white md:block"
          aria-label="Previous hero background"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="w-16 h-16"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={goToNext}
          className="absolute right-8 top-1/2 z-10 hidden -translate-y-1/2 text-white/50 transition-colors hover:text-white md:block"
          aria-label="Next hero background"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="w-16 h-16"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {HERO_BACKGROUNDS.map((background, index) => (
            <button
              key={background.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Show hero background ${index + 1}`}
            />
          ))}
        </div>
      </div>

    </section>
  );
}
