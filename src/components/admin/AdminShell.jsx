"use client"

import Link from "next/link"
import { Bell, ExternalLink, Menu, Search, UserCircle, X } from "lucide-react"
import { useState } from "react"
import SidebarAdmin from "@/components/admin/Sidebar"
import { cn } from "@/lib/utils"

const MOBILE_LINKS = [
  ["Dashboard", "/admin/dashboard"],
  ["Website", "/admin/website"],
  ["Blog", "/admin/blog"],
  ["Media", "/admin/media"],
  ["Settings", "/admin/settings"],
]

export default function AdminShell({ children }) {
  const [mobileSidebar, setMobileSidebar] = useState(false)

  return (
    <div className="flex min-h-screen bg-admin-bg text-text-primary">
      {/* Desktop sidebar — sticky */}
      <div className="sticky top-0 hidden h-screen w-[270px] shrink-0 self-start lg:block">
        <SidebarAdmin />
      </div>

      {/* Mobile sidebar backdrop */}
      {mobileSidebar && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebar(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[270px] -translate-x-full transition-transform duration-300 lg:hidden",
          mobileSidebar && "translate-x-0"
        )}
      >
        <SidebarAdmin />
      </div>

      {/* Main area — fills remaining space */}
      <div className="min-w-0 flex-1">
        {/* Topbar */}
        <header className="sticky top-0 z-40 h-14 border-b border-border bg-white sm:h-16">
          <div className="flex h-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Toggle sidebar"
                onClick={() => setMobileSidebar((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-admin-hover hover:text-text-primary lg:hidden"
              >
                {mobileSidebar ? <X size={20} /> : <Menu size={20} />}
              </button>
              <Link href="/" target="_blank" className="hidden items-center gap-1.5 text-xs font-semibold text-text-muted transition-colors hover:text-accent-purple sm:inline-flex">
                <ExternalLink size={13} />
                View Site
              </Link>
            </div>

            <div className="admin-topbar-actions">
              <div className="admin-topbar-search hidden items-center gap-1.5 rounded-lg border border-border bg-admin-bg text-text-muted md:flex">
                <Search size={15} />
                <span className="text-xs">Search...</span>
              </div>
              <button
                type="button"
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-admin-hover hover:text-text-primary"
              >
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent-pink" />
              </button>
              <div className="flex items-center gap-2.5 border-l border-border pl-3 ml-1">
                <UserCircle size={28} className="text-accent-purple" />
                <div className="hidden text-left md:block">
                  <p className="text-sm font-bold leading-tight text-text-primary">Admin</p>
                  <p className="text-[11px] font-medium leading-tight text-text-muted">Tachy Artist</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile nav bar */}
        <nav className="flex gap-2 overflow-x-auto border-b border-border bg-white px-4 py-2.5 lg:hidden">
          {MOBILE_LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="whitespace-nowrap rounded-md border border-border bg-admin-bg px-3 py-1.5 text-xs font-bold text-text-secondary transition-colors hover:border-accent-purple/30 hover:text-accent-purple"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Page content */}
        <main className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
