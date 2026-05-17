"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Star } from "lucide-react";

const classesPlans = [
  {
    name: "STARTER",
    price: 50,
    yearlyPrice: 40,
    period: "per month",
    features: [
      "Up to 10 yoga classes per month",
      "Access to basic yoga practices",
      "48-hour support response time",
      "Community forum access",
      "Basic meditation sessions",
    ],
    description: "Perfect for beginners starting their yoga journey",
    buttonText: "Start Free Trial",
    href: "/login",
    isPopular: false,
  },
  {
    name: "PROFESSIONAL",
    price: 99,
    yearlyPrice: 79,
    period: "per month",
    features: [
      "Unlimited yoga classes",
      "Access to all yoga practices & asanas",
      "24-hour support response time",
      "Priority booking for classes",
      "Advanced meditation sessions",
      "Personalized practice plans",
      "Live instructor sessions",
    ],
    description: "Ideal for regular practitioners and yoga enthusiasts",
    buttonText: "Get Started",
    href: "/login",
    isPopular: true,
  },
  {
    name: "ENTERPRISE",
    price: 299,
    yearlyPrice: 239,
    period: "per month",
    features: [
      "Everything in Professional",
      "One-on-one private sessions",
      "1-hour support response time",
      "Custom practice programs",
      "Workshop & retreat access",
      "Advanced teacher training",
      "Nutrition & wellness guidance",
    ],
    description: "For dedicated practitioners and yoga teachers",
    buttonText: "Contact Us",
    href: "/contact",
    isPopular: false,
  },
];

export default function ClassesPage() {
  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <main className="min-h-screen bg-cream-50/30 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-outfit font-bold text-brand-900 mb-6">
            Yoga Classes & Membership
          </h1>
          <p className="text-lg text-sage-600 font-light leading-relaxed">
            Choose the plan that works for you. All plans include full access to our yoga practices, meditation sessions, and dedicated instructor support.
          </p>
        </div>

        {/* Pricing Toggle */}
        <div className="flex justify-center items-center gap-4 mb-16">
          <span className={`text-sm font-semibold transition-colors ${isMonthly ? 'text-brand-900' : 'text-sage-400'}`}>Monthly</span>
          <button 
            onClick={() => setIsMonthly(!isMonthly)}
            className="w-14 h-8 bg-brand-200 rounded-full p-1 transition-all duration-300 relative focus:outline-none"
            aria-label="Toggle billing interval"
          >
            <div className={`w-6 h-6 bg-brand-600 rounded-full shadow-md transition-transform duration-300 ${!isMonthly ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <span className={`text-sm font-semibold transition-colors ${!isMonthly ? 'text-brand-900' : 'text-sage-400'}`}>
            Annually <span className="text-brand-600 font-bold ml-1">(Save 20%)</span>
          </span>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {classesPlans.map((plan, index) => {
            const currentPrice = isMonthly ? plan.price : plan.yearlyPrice;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col justify-between bg-white rounded-3xl p-8 border transition-all duration-300 ${
                  plan.isPopular
                    ? "border-brand-600 shadow-xl lg:-translate-y-4"
                    : "border-cream-200 hover:shadow-lg hover:-translate-y-1"
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-8 -translate-y-1/2 bg-brand-600 text-white text-xs uppercase tracking-widest font-bold px-4 py-1.5 rounded-full flex items-center shadow-md">
                    <Star className="h-3 w-3 fill-current mr-1 text-gold-400" />
                    Popular
                  </div>
                )}

                <div>
                  {/* Name & Desc */}
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-sage-500 mb-2">{plan.name}</h3>
                  <p className="text-sm text-sage-600 mb-6 font-light leading-relaxed">{plan.description}</p>
                  
                  {/* Price */}
                  <div className="flex items-baseline text-gray-900 mb-8">
                    <span className="text-5xl font-outfit font-bold tracking-tight">${currentPrice}</span>
                    <span className="ml-1 text-sm font-medium text-sage-500">/mo</span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-cream-100 my-6"></div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-brand-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 leading-relaxed font-light">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Button */}
                <Link
                  href={plan.href}
                  className={`w-full py-4 px-6 rounded-2xl text-center font-semibold text-sm tracking-wider uppercase shadow-sm transition-all duration-200 ${
                    plan.isPopular
                      ? "bg-brand-600 text-white hover:bg-brand-700 hover:shadow-md"
                      : "bg-brand-100 text-brand-700 hover:bg-brand-200"
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
