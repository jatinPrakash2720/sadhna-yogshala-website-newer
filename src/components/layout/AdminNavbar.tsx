"use client";

import { useSession } from "next-auth/react";
import { Bell, Search } from "lucide-react";
import Image from "next/image";

export default function AdminNavbar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-cream-200 h-16 w-full">
      <div className="flex items-center justify-between h-full px-6 lg:px-10">
        
        {/* Search Bar - Hidden on small mobile */}
        <div className="hidden sm:flex items-center flex-1 max-w-md relative">
          <Search className="h-4 w-4 text-sage-400 absolute left-3" />
          <input
            type="text"
            placeholder="Search users, courses, transactions..."
            className="w-full bg-cream-50 border border-cream-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-gray-700 placeholder:text-sage-400"
          />
        </div>
        
        <div className="flex items-center justify-end flex-1 gap-4 lg:gap-6">
          {/* Notifications */}
          <button className="relative p-2 text-sage-500 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          
          {/* Profile Dropdown trigger (visual only for now) */}
          <div className="flex items-center gap-3 pl-4 border-l border-cream-200">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900 leading-none mb-1">
                {session?.user?.name || "Admin"}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-brand-600 font-bold">
                {(session?.user as any)?.role === "admin" ? "Super Admin" : "Moderator"}
              </span>
            </div>
            
            {session?.user?.image ? (
              <div className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Admin"}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              </div>
            ) : (
              <div className="h-9 w-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm border-2 border-white shadow-sm">
                {session?.user?.name?.[0]?.toUpperCase() || "A"}
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
