"use client";
import { useState } from 'react';
import Image from "next/image";

const categories = ["Beginners Yoga", "Stretching", "Fly-Yoga", "Yin Yoga", "Flo Yoga"];

const steps = [
  { number: 1, title: "Free Rugs", desc: "Felis lectus sit aliquet gravida pretium dui netus et. Lacus in molestie in diam lorem." },
  { number: 2, title: "Changing Room", desc: "Felis lectus sit aliquet gravida pretium dui netus et. Lacus in molestie in diam lorem." },
  { number: 3, title: "Free Rugs", desc: "Felis lectus sit aliquet gravida pretium dui netus et. Lacus in molestie in diam lorem." },
  { number: 4, title: "Changing Room", desc: "Felis lectus sit aliquet gravida pretium dui netus et. Lacus in molestie in diam lorem." },
];

export default function LatestClasses() {
  const [activeTab, setActiveTab] = useState("Beginners Yoga");

  return (
    <section className="py-20 px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-serif font-bold text-primary mb-4">Latest Classes</h2>
        <p className="text-secondary uppercase tracking-widest text-sm">Sub Heading To Explain More</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-8 mb-16">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`text-sm font-bold transition-colors ${
              activeTab === cat 
                ? 'text-primary border-b-2 border-primary pb-1' 
                : 'text-secondary hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Image Side */}
        <div className="relative h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="/class-image.png"
            alt="Yoga Class"
            fill
            className="object-cover"
          />
        </div>

        {/* Content Side */}
        <div>
          <h3 className="text-3xl font-bold text-primary mb-6">{activeTab}</h3>
          <p className="text-secondary mb-12 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Sed sagittis dis vitae suspendisse adipiscing magna arcu et nibh. Felis lectus sit aliquet gravida pretium dui netus et. Lacus in molestie in diam lorem.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center text-3xl font-serif text-primary">
                  {step.number}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary mb-2">{step.title}</h4>
                  <p className="text-sm text-secondary leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-12 bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all shadow-lg">
            Get A Free Trial
          </button>
        </div>
      </div>
    </section>
  );
}
