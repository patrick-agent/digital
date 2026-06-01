"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  FileText,
  Music,
  Calendar,
  Image,
  ShoppingBag,
  Briefcase,
  Award,
  Mail,
  Search,
  Settings,
  File,
  LogOut,
  ChevronDown,
  User,
  Users,
  Globe,
  FolderOpen,
  Palette,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

// Cấu trúc navigation theo persona
const NAV_GROUPS = [
  {
    label: "Dashboard",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Tachy Artist",
    icon: User,
    items: [
      { href: "/admin/blog", label: "Blog", icon: FileText, persona: "artist" },
      { href: "/admin/music", label: "Bio Music", icon: Music },
      { href: "/admin/shop", label: "Shop", icon: ShoppingBag },
      { href: "/admin/events", label: "Tour & Events", icon: Calendar },
      { href: "/admin/gallery", label: "Gallery", icon: Image },
    ],
  },
  {
    label: "Another Me",
    icon: Users,
    items: [
      { href: "/admin/blog", label: "Blog", icon: FileText, persona: "marketer" },
      { href: "/admin/services", label: "Services", icon: Briefcase },
      { href: "/admin/case-studies", label: "Case Studies", icon: Award },
    ],
  },
  {
    label: "Global",
    icon: Globe,
    items: [
      { href: "/admin/website", label: "Website Builder", icon: Palette },
      { href: "/admin/media", label: "Media Library", icon: FolderOpen },
      { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
      { href: "/admin/press-kit", label: "Press Kit", icon: File },
      { href: "/admin/seo", label: "SEO & Metadata", icon: Search },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
]

function NavGroup({ group, pathname }) {
  const [collapsed, setCollapsed] = useState(false)
  const hasSubItems = group.items.length > 1
  const GroupIcon = group.icon

  // Nếu group chỉ có 1 item (Dashboard), render thẳng không cần collapse
  if (!hasSubItems) {
    const item = group.items[0]
    const Icon = item.icon
    const isActive = pathname === item.href
    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
          isActive
            ? "bg-sidebar-active text-accent-cyan"
            : "text-text-secondary hover:bg-sidebar-hover hover:text-text-primary"
        )}
      >
        <Icon size={18} />
        {item.label}
      </Link>
    )
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider hover:text-text-secondary transition-colors"
      >
        <span className="flex items-center gap-2">
          {GroupIcon && <GroupIcon size={14} />}
          {group.label}
        </span>
        <ChevronDown
          size={14}
          className={cn("transition-transform", collapsed && "-rotate-90")}
        />
      </button>

      {!collapsed && (
        <div className="space-y-0.5 pl-2">
          {group.items.map((item) => {
            const Icon = item.icon
            // Active check: với blog có persona, check thêm query param
            const isActive = item.persona
              ? pathname === item.href
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href + (item.persona || "")}
                href={item.persona ? `${item.href}?persona=${item.persona}` : item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-active text-accent-cyan"
                    : "text-text-secondary hover:bg-sidebar-hover hover:text-text-primary"
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function SidebarAdmin() {
  const pathname = usePathname()

  return (
    <aside className="w-[280px] flex-none bg-sidebar border-r border-border flex flex-col h-screen sticky top-0 shadow-[18px_0_60px_rgba(0,0,0,0.22)]">
      {/* Logo */}
      <div className="p-6 border-b border-border bg-gradient-to-br from-sidebar to-admin-card">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center text-white font-bold text-sm">
            T
          </div>
          <div>
            <p className="text-text-primary font-semibold text-sm">Tachy Artist</p>
            <p className="text-text-muted text-xs">ngx-admin workspace</p>
          </div>
        </Link>
      </div>

      {/* Navigation groups */}
      <nav className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
        {NAV_GROUPS.map((group) => (
          <NavGroup key={group.label} group={group} pathname={pathname} />
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:bg-sidebar-hover hover:text-red-400 transition-colors w-full"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}
