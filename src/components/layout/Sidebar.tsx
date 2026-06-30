"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import { signOut, useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
import Logo from "@/components/ui/Logo"
const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/my-courses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/classes", label: "Upcoming Classes", icon: Calendar },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-cream-200">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={32} variant="green" />
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-sm text-brand-900">
              Sadhna Yogshala
            </span>
            <span className="text-[9px] font-medium tracking-widest uppercase text-sage-400">
              Yoga Studio
            </span>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="text-sage-400 hover:text-sage-700 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-cream-100">
        <div className="flex items-center gap-3">
          {session?.user?.image ? (
            <div className="relative h-10 w-10 rounded-full overflow-hidden border border-cream-200">
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {session?.user?.name || "Yogshala Student"}
            </p>
            <p className="text-xs text-sage-400 truncate">
              {session?.user?.email || "student@yogshala.com"}
            </p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav
        className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin"
        aria-label="Dashboard navigation"
      >
        <div className="space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-brand-600 text-white shadow-brand"
                    : "text-sage-700 hover:bg-brand-50 hover:text-brand-700",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-sage-400 group-hover:text-brand-600",
                  )}
                />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="h-4 w-4 opacity-70" />}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-cream-200 space-y-1">
        <Link
          href="/dashboard/notifications"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sage-700 hover:bg-brand-50 hover:text-brand-700 transition-all duration-200 group"
        >
          <Bell className="h-5 w-5 text-sage-400 group-hover:text-brand-600" />
          <span className="flex-1">Notifications</span>
          <span className="h-5 w-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
            2
          </span>
        </Link>
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200 group"
          id="sidebar-logout-btn"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-white border-b border-cream-200 px-4 h-14">
        <button
          id="dashboard-sidebar-toggle"
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-lg text-sage-600 hover:bg-sage-100"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <Logo size={28} variant="green" />
          <span className="font-bold text-sm text-brand-900">
            Sadhna Yogshala
          </span>
        </div>
        {session?.user?.image ? (
          <div className="relative h-8 w-8 rounded-full overflow-hidden border border-cream-200">
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
            {session?.user?.name?.[0]?.toUpperCase() || "U"}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-cream-200 flex-col z-30">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 shadow-xl lg:hidden"
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
