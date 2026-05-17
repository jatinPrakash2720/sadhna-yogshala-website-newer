"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const yogaCategories = [
  {
    id: "warmup",
    title: "Loosening & Warm-up (Sukshma Vyayama)",
    items: [
      "Neck movements",
      "Shoulder movements",
      "Wrist/palm movements",
      "Fingers loosening",
      "Waist rotation",
      "Shishupal asana",
      "Half & Full Butterfly",
      "Knee movements",
      "Ankle/Toe movements",
      "Kati chakrasana",
      "Gatyatmak Padhastasana",
      "Utthita Lolasana",
      "Side bending in sitting",
      "Chakki chalana",
      "Chapati Making",
      "Sitting Cat-Cow",
      "Marjari-Bitilasana",
      "Vyaghrasana",
      "Threading the needle",
      "Lizard stretch",
      "Pyramid stretch",
      "Adho mukha Kapotasana",
      "Utkatasana situps",
      "Parvat asana walking",
      "Frog Jumping",
      "Lizard Walking",
      "Toe Jogging/High knee/Forward bend jogging/Jumping Jacks/Mukha Dhouti",
      "Knee to Elbow in Plank",
      "Shashank-bhujanga swing",
      "Dynamic Ashwasanchalana",
      "Bhujangasana-Parvatasana Swing",
    ],
  },
  {
    id: "namaskara",
    title: "Namaskara",
    items: [
      "Surya Namaskara (Sun Salutation)",
      "Chandra Namaskara (Moon Salutation)",
    ],
  },
  {
    id: "standing",
    title: "Standing Asanas",
    items: [
      "Tadasana",
      "Triyak Tadasana",
      "Utkatasana",
      "Dwikonasana",
      "Trikonasana",
      "Samakonasana",
      "Padahastasana",
      "Gatyatmak Padahastasana",
      "Sirsha Angustha Yogasana",
      "Vatyan asana",
      "Prishthasana",
      "Ardha Chandrasana",
    ],
  },
  {
    id: "balancing",
    title: "Balancing Asanas",
    items: [
      "Eka Pada Pranamasana/Vrikshasana",
      "Garudasana",
      "Hamsasana",
      "Santolanasana",
      "Saral Natraj asana",
      "Vashishthasana",
      "Brahmacharya asana",
      "Mayurasana",
      "Gorakshasana",
      "Astavakrasana",
      "Grivasana",
    ],
  },
  {
    id: "sitting",
    title: "Sitting Asanas",
    items: [
      "Baddha konasana",
      "Malasana",
      "Vajrasana",
      "Bhadrasana",
      "Simhasana",
      "Gomukhasana",
      "Naukasana",
      "Shashank asana/Balasana",
      "Naman Pranamasana",
      "Hanuman asana",
      "Dhanurakarshanasana",
    ],
  },
  {
    id: "twisting",
    title: "Spinal Twisting",
    items: [
      "Meru Wakrasana",
      "Gatyatmak Meru Vakrasana",
      "Bhu Namanasana",
      "Ardha Matsyendrasana",
      "Purna Matsyendrasana",
    ],
  },
  {
    id: "forward",
    title: "Forward Bending",
    items: [
      "Paschimottanasana",
      "Gatyatmak Paschimottasana",
      "Pada prasar Paschimottanasana",
      "Janu sirsasana",
    ],
  },
  {
    id: "backward",
    title: "Back Bending & Prone",
    items: [
      "Saral bhujangasana",
      "Bhujangasana",
      "Triyak bhujangasana",
      "Ardha Shalabhasana",
      "Shalabhasana",
      "Saral Dhanurasana",
      "Ardha Ustrasana",
      "Purna Ustrasana",
      "Chakrasana",
      "Makarasana",
      "Purna Dhanurasana",
      "Purna Salabasana",
      "Gupta Padmasana",
      "Purna Bhujangasana",
    ],
  },
  {
    id: "supine",
    title: "Supine Asanas",
    items: [
      "Padottanasana",
      "Supta Pawanmuktasana",
      "Kandharasana/Setu bandh",
      "Supta Udarakarshan asana",
      "Shavasana",
      "Matsyasana",
      "Supta Vajrasana",
      "Pada Angushthasana",
    ],
  },
  {
    id: "inverted",
    title: "Inverted Asanas",
    items: [
      "Vipareeta Karani Asana",
      "Sarvangasana",
      "Purva Halasana",
      "Halasana",
      "Padma Sarvangasana",
      "Shirsasana",
    ],
  },
  {
    id: "meditation",
    title: "Meditation & Pranayama",
    items: [
      "Sukhasana",
      "Padmasana",
      "Ardha padmasana",
      "Siddhasana",
      "Bhastrika (Var 1 & 2)",
      "Kapalbhati",
      "Ujjayi",
      "Vibhagiya",
      "Yogic Swasan",
      "Surya Bhedi",
      "Chandra Bhedi",
      "Surya/Chandra Anulom Viloma",
      "Nadi Shodhana",
      "Sheetali",
      "Sheetkari",
      "Bhramari",
      "Mula Bandha",
      "Uddiyana Bandha",
      "Jalandhar Bandha",
      "Jnana Mudra",
      "Chin Mudra",
      "Vishu Mudra",
      "Shanmukhi Mudra",
      "Anjali Mudra",
    ],
  },
];

export default function YogaContent() {
  const [activeTab, setActiveTab] = useState(yogaCategories[0].id);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const activeCategory = yogaCategories.find((cat) => cat.id === activeTab);

  // Reset expanded card when tab changes
  useEffect(() => {
    setExpandedCard(null);
  }, [activeTab]);

  return (
    <section className="pt-28 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
      {/* Title and Description */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-outfit font-bold text-brand-900 mb-6">
          Yoga Practices
        </h1>
        <p className="text-lg text-sage-600 max-w-3xl mx-auto font-light">
          Explore our comprehensive collection of asanas and pranayamas,
          organized by category to deepen your practice.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-12 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex flex-nowrap md:flex-wrap gap-3 border-b-2 border-brand-100 pb-4 min-w-max">
          {yogaCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`
                px-5 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap
                ${
                  activeTab === category.id
                    ? "bg-brand-600 text-white shadow-md"
                    : "bg-brand-100/50 text-brand-900 hover:bg-brand-100"
                }
              `}
            >
              {category.title.split(" ")[0]}
              {category.title.includes("(") && (
                <span className="hidden md:inline">
                  {" "}
                  {category.title.match(/\([^)]+\)/)?.[0]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active Category Content */}
      {activeCategory && (
        <div>
          <h2 className="text-3xl font-outfit font-bold text-brand-900 mb-8 text-center">
            {activeCategory.title}
          </h2>

          {/* Grid of Asanas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
            {activeCategory.items.map((item, index) => {
              const isHighlighted = index === 0;
              const isExpanded = expandedCard === index;
              
              // Create different sizes for visual variety (only when not expanded)
              let sizeClass = "";
              let imageHeight = "h-48";
              
              if (isExpanded) {
                // Expanded card spans 2 columns and 2 rows
                sizeClass = "col-span-2 row-span-2 sm:col-span-2 lg:col-span-2 xl:col-span-2";
              } else {
                if (index % 8 === 0) {
                  // Every 8th card: tall (spans 2 rows)
                  sizeClass = "row-span-2";
                  imageHeight = "h-80";
                } else if (index % 6 === 0) {
                  // Every 6th card: wide (spans 2 columns on larger screens)
                  sizeClass = "col-span-2 sm:col-span-1 lg:col-span-2";
                  imageHeight = "h-48";
                } else if (index % 4 === 0) {
                  // Every 4th card: medium tall
                  imageHeight = "h-64";
                }
              }
              
              return (
                <div
                  key={index}
                  onClick={() => setExpandedCard(isExpanded ? null : index)}
                  className={`
                    group rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer ${sizeClass}
                    ${
                      isExpanded
                        ? "bg-brand-900 text-white shadow-2xl z-50"
                        : isHighlighted
                        ? "bg-brand-600 text-white shadow-xl scale-105"
                        : "bg-brand-100 text-brand-900 hover:bg-brand-600 hover:text-white hover:shadow-xl hover:scale-105"
                    }
                  `}
                >
                  {isExpanded ? (
                    // Expanded View: Image on left, Description on right
                    <div className="flex flex-col lg:flex-row h-full">
                      {/* Large Image on Left */}
                      <div className="relative w-full lg:w-1/2 h-64 lg:h-full min-h-[300px]">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 z-10" />
                        <div className="w-full h-full bg-brand-900/20">
                          <div className="relative w-full h-full">
                            <Image
                              src="/class-image.png"
                              alt={item}
                              fill
                              className="object-cover opacity-90"
                            />
                          </div>
                        </div>
                        {/* Close button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedCard(null);
                          }}
                          className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white text-brand-900 rounded-full p-2 transition-colors"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Description on Right */}
                      <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
                        <h3 className="text-3xl font-outfit font-bold text-white mb-6">
                          {item}
                        </h3>
                        <div className="space-y-4 text-white/95 leading-relaxed font-light text-sm">
                          <p>
                            Practicing {item} benefits the body by building core stability, increasing mindfulness, and promoting flexibility. It belongs to the {activeCategory.title.split(" (")[0]} category of yogic postures.
                          </p>
                          <p>
                            By integrating breathing cycles with physical alignment, it helps release mental tension, improves blood circulation, and centers the nervous system.
                          </p>
                        </div>
                        <button className="mt-8 bg-white text-brand-900 px-8 py-3 rounded-full font-semibold text-sm hover:bg-opacity-90 transition-all shadow-lg self-start">
                          Learn More
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Normal Card View
                    <>
                      {/* Image Container */}
                      <div className={`relative ${imageHeight} w-full`}>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 z-10" />
                        <div className="w-full h-full bg-brand-100 flex items-center justify-center">
                          <div className="relative w-full h-full">
                            <Image
                              src="/class-image.png"
                              alt={item}
                              fill
                              className="object-cover opacity-80"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className={`w-16 h-16 ${
                                  isHighlighted
                                    ? "text-white"
                                    : "text-brand-900 group-hover:text-white"
                                } transition-colors`}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.163L9 5.25v10.303m0 0v3.75a2.25 2.25 0 002.25 2.25h1.32l1.32-.377a1.803 1.803 0 00.99-3.467l-2.31-.66A2.25 2.25 0 009 15.553z"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3
                          className={`text-lg font-bold text-center ${
                            isHighlighted
                              ? "text-white"
                              : "text-brand-900 group-hover:text-white"
                          } transition-colors`}
                        >
                          {item}
                        </h3>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
