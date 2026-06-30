"use client"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import Logo from "@/components/ui/Logo"

export default function Header() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isHomePage = pathname === "/"
  const isWhiteBackgroundPage = !isHomePage
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header
      className={`${
        isWhiteBackgroundPage ? "relative bg-white" : "absolute right-0"
      } top-0 left-0 w-full z-50 py-6 px-8 flex items-center justify-between max-w-7xl mx-auto`}
    >
      <div className="flex items-center gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Logo
            size={40}
            className="drop-shadow-sm"
            variant={isHomePage ? "white" : "green"}
          />
        </Link>
        <div className="flex flex-col">
          <span
            className={`font-outfit text-xl font-bold leading-none ${
              isWhiteBackgroundPage ? "text-brand-900" : "text-white"
            }`}
          >
            Sadhana Yogshala
          </span>
          <span
            className={`text-xs uppercase tracking-wider ${
              isWhiteBackgroundPage ? "text-sage-600" : "text-white/80"
            }`}
          >
            Yoga Studio
          </span>
        </div>
      </div>

      <nav
        className={`hidden lg:flex items-center gap-8 font-medium text-sm tracking-wide ${
          isWhiteBackgroundPage ? "text-brand-900" : "text-white"
        }`}
      >
        <Link
          href="/courses"
          className={`transition-colors ${
            isWhiteBackgroundPage
              ? "hover:text-sage-600"
              : "hover:text-white/80"
          }`}
        >
          COURSES
        </Link>

        <Link
          href="/contact"
          className={`transition-colors ${
            isWhiteBackgroundPage
              ? "hover:text-sage-600"
              : "hover:text-white/80"
          }`}
        >
          ABOUT
        </Link>

        <Link
          href="/contact"
          className={`transition-colors ${
            isWhiteBackgroundPage
              ? "hover:text-sage-600"
              : "hover:text-white/80"
          }`}
        >
          CONTACT
        </Link>
        {status === "authenticated" ? (
          (session?.user as any)?.role === "admin" ||
          (session?.user as any)?.isAdmin ? (
            <Link
              href="/admin"
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                isWhiteBackgroundPage
                  ? "bg-brand-100 text-brand-900 hover:bg-brand-200"
                  : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              }`}
            >
              OWNER
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                isWhiteBackgroundPage
                  ? "bg-brand-100 text-brand-900 hover:bg-brand-200"
                  : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              }`}
            >
              DASHBOARD
            </Link>
          )
        ) : (
          <Link
            href="/login"
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
              isWhiteBackgroundPage
                ? "bg-brand-600 text-white hover:bg-brand-600/90"
                : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
            }`}
          >
            LOGIN
          </Link>
        )}
      </nav>
      <div className="flex items-center gap-3 lg:hidden">
        {status === "authenticated" ? (
          (session?.user as any)?.role === "admin" ||
          (session?.user as any)?.isAdmin ? (
            <Link
              href="/admin"
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                isWhiteBackgroundPage
                  ? "bg-brand-100 text-brand-900 hover:bg-brand-200"
                  : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              }`}
            >
              OWNER
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                isWhiteBackgroundPage
                  ? "bg-brand-100 text-brand-900 hover:bg-brand-200"
                  : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              }`}
            >
              DASHBOARD
            </Link>
          )
        ) : (
          <Link
            href="/login"
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
              isWhiteBackgroundPage
                ? "bg-brand-600 text-white hover:bg-brand-600/90"
                : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
            }`}
          >
            LOGIN
          </Link>
        )}
        <button
          onClick={() => setIsMenuOpen(true)}
          className={`${
            isWhiteBackgroundPage
              ? "text-brand-900 bg-brand-100"
              : "text-white bg-brand-600/20 backdrop-blur-sm"
          } px-4 py-2 rounded-full font-medium ${
            isWhiteBackgroundPage
              ? "hover:bg-brand-200"
              : "hover:bg-brand-600/30"
          } transition-all`}
        >
          {/* Hamburger icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>

      {/* Side Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-[100] lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Side Menu Panel */}
          <div
            className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-[101] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-primary/10">
                <div className="flex items-center gap-3">
                  <Logo size={40} variant="green" />
                  <div className="flex flex-col">
                    <span className="font-outfit text-xl font-bold text-brand-900 leading-none">
                      Sadhana Yogshala
                    </span>
                    <span className="text-xs text-sage-600 uppercase tracking-wider">
                      Yoga Studio
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-brand-900 hover:text-sage-600 transition-colors p-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col p-6 gap-4 flex-1">
                <Link
                  href="/courses"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg font-medium py-3 px-4 rounded-lg transition-colors ${
                    pathname === "/courses"
                      ? "bg-brand-600 text-white"
                      : "text-brand-900 hover:bg-brand-100"
                  }`}
                >
                  COURSES
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg font-medium py-3 px-4 rounded-lg transition-colors ${
                    pathname === "/contact"
                      ? "bg-brand-600 text-white"
                      : "text-brand-900 hover:bg-brand-100"
                  }`}
                >
                  ABOUT
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg font-medium py-3 px-4 rounded-lg transition-colors ${
                    pathname === "/contact"
                      ? "bg-brand-600 text-white"
                      : "text-brand-900 hover:bg-brand-100"
                  }`}
                >
                  CONTACT
                </Link>
                {status === "authenticated" ? (
                  (session?.user as any)?.role === "admin" ||
                  (session?.user as any)?.isAdmin ? (
                    <Link
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-lg font-medium py-3 px-4 rounded-lg transition-colors bg-brand-100 text-brand-900 hover:bg-brand-200"
                    >
                      OWNER
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-lg font-medium py-3 px-4 rounded-lg transition-colors bg-brand-100 text-brand-900 hover:bg-brand-200"
                    >
                      DASHBOARD
                    </Link>
                  )
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-medium py-3 px-4 rounded-lg transition-colors mt-auto bg-brand-600 text-white hover:bg-brand-600/90"
                  >
                    LOGIN
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
