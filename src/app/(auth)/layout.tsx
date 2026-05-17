import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left: Premium Image Panel */}
      <div className="hidden lg:flex relative flex-col justify-between p-12 overflow-hidden">
        {/* Full-bleed background image */}
        <Image
          src="/class-image.png"
          alt="Serene yoga practice"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Elegant overlays for text readability */}
        <div className="absolute inset-0 bg-brand-900/30 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/20 to-black/30"></div>

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group" aria-label="Sadhana Yogshala">
            <Logo size={44} variant="white" className="drop-shadow-lg" />
            <div className="flex flex-col leading-none">
              <span className="font-outfit font-bold text-2xl text-white tracking-wide drop-shadow-md">Sadhana Yogshala</span>
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-white/80 mt-1">Yoga Studio</span>
            </div>
          </Link>
        </div>

        {/* Bottom: Quote & Stats */}
        <div className="relative z-10 w-full max-w-lg mt-auto">
          {/* Glassmorphism Quote Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 mb-10 shadow-2xl">
            <p className="text-white/95 text-lg md:text-xl font-light leading-relaxed mb-6">
              "Yoga is the journey of the self, through the self, to the self."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-white/30 overflow-hidden relative">
                <Image src="/instructor-1.png" alt="Instructor" fill className="object-cover" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">The Bhagavad Gita</p>
                <p className="text-white/70 text-xs">Ancient Scripture</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 border-t border-white/20 pt-6">
            {[
              { value: "5K+", label: "Active Students" },
              { value: "50+", label: "Expert Courses" },
              { value: "4.9/5", label: "Average Rating" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-outfit font-bold text-white mb-1">{value}</p>
                <p className="text-xs text-white/70 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form Area */}
      <div className="flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-white relative">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="w-full max-w-[420px] relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 flex justify-center">
            <Link href="/" className="flex items-center gap-3">
              <Logo size={40} variant="green" />
              <div className="flex flex-col">
                <span className="font-outfit font-bold text-xl text-brand-900 leading-none">Sadhana Yogshala</span>
                <span className="text-[10px] text-sage-600 uppercase tracking-wider mt-1">Yoga Studio</span>
              </div>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
