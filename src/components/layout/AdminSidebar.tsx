"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Shield,
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
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/classes", label: "Live Classes", icon: CalendarDays },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="flex flex-col h-full bg-[#0d1f0d] text-white">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <Logo size={32} variant="green" />
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-sm text-white">Admin Portal</span>
            <span className="text-[10px] font-medium tracking-widest uppercase text-brand-400">
              Sadhna Yogshala
            </span>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white lg:hidden"
            aria-label="Close admin sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav
        className="flex-1 px-3 py-6 overflow-y-auto scrollbar-thin"
        aria-label="Admin navigation"
      >
        <p className="px-4 text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
          Menu
        </p>
        <div className="space-y-1.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== "/admin" && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-brand-600 text-white shadow-brand"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-white/50 group-hover:text-white",
                  )}
                />
                <span className="flex-1">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-3 mb-2">
          {session?.user?.image ? (
            <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/10">
              <Image
                src={session.user.image}
                alt={session.user.name || "Admin"}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {session?.user?.name?.[0]?.toUpperCase() || "A"}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {session?.user?.name || "Admin User"}
            </p>
            <p className="text-xs text-white/50 truncate">
              {(session?.user as any)?.role === "admin"
                ? "Super Admin"
                : "Yoga Admin"}
            </p>
          </div>
        </div>
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
          id="admin-logout-btn"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-[#0d1f0d] border-b border-white/10 px-4 h-16">
        <div className="flex items-center gap-3">
          <button
            id="admin-sidebar-toggle"
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg text-white/70 hover:bg-white/10"
            aria-label="Open admin sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <Logo size={28} variant="green" />
            <span className="font-bold text-sm text-white">Admin</span>
          </div>
        </div>
        {session?.user?.image ? (
          <div className="relative h-8 w-8 rounded-full overflow-hidden border border-white/10">
            <Image
              src={session.user.image}
              alt={session.user.name || "Admin"}
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
            {session?.user?.name?.[0]?.toUpperCase() || "A"}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-[#0d1f0d] flex-col z-30 shadow-2xl">
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-[#0d1f0d] z-50 shadow-2xl lg:hidden"
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
