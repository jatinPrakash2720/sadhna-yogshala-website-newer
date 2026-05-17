import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f1f14] text-white pt-16 pb-8 border-t border-[#1a3320]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          {/* Brand & Intro */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group mb-6" aria-label="Sadhna Yogshala">
              <Logo size={40} variant="white" />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-lg text-white">Sadhna Yogshala</span>
                <span className="text-[10px] font-medium tracking-widest uppercase text-brand-300">Yoga Studio</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-sm">
              Empowering your wellness journey through authentic, accessible, and transformative online yoga education.
            </p>
            <div className="flex items-center gap-4">
              {[
                { name: "Instagram", href: "#" },
                { name: "YouTube", href: "#" },
                { name: "Facebook", href: "#" },
                { name: "Twitter", href: "#" },
              ].map(({ name, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-600 hover:text-white transition-all duration-300 text-[10px] font-bold"
                  aria-label={name}
                >
                  {name[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white tracking-wide">Explore</h3>
            <ul className="space-y-3 text-sm">
              {["All Courses", "Live Classes", "Our Teachers", "Yoga Retreats", "Blog"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-gray-400 hover:text-brand-400 transition-colors inline-flex items-center gap-2 group">
                    <span className="h-1 w-1 rounded-full bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white tracking-wide">Support</h3>
            <ul className="space-y-3 text-sm">
              {["Help Center", "Student Dashboard", "Terms of Service", "Privacy Policy", "Refund Policy"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-gray-400 hover:text-brand-400 transition-colors inline-flex items-center gap-2 group">
                    <span className="h-1 w-1 rounded-full bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white tracking-wide">Get in Touch</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">108 Lotus Tower, Wellness Hub,<br />Bangalore, KA 560001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-brand-500 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-500 flex-shrink-0" />
                <span>namaste@sadhna-yogshala.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#1a3320] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {currentYear} Sadhna Yogshala. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              Made with <span className="text-red-500 animate-pulse">❤</span> in India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
