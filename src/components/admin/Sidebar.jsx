"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
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
  User,
  Users,
  Globe,
  FolderOpen,
  Palette,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_GROUPS = [
  {
    label: "Overview",
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
      { href: "/admin/pages", label: "Pages", icon: File },
      { href: "/admin/seo", label: "SEO & Metadata", icon: Search },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
]

function NavItem({ item, pathname }) {
  const Icon = item.icon
  const isActive = item.isActive(pathname)

  return (
    <Link
      href={item.persona ? `${item.href}?persona=${item.persona}` : item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-150",
        isActive
          ? "bg-accent-purple/10 text-accent-purple"
          : "text-text-secondary hover:bg-sidebar-hover hover:text-text-primary"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent-purple" />
      )}
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
          isActive
            ? "bg-accent-purple/15 text-accent-purple"
            : "text-text-muted group-hover:text-text-secondary"
        )}
      >
        <Icon size={18} />
      </div>
      <span>{item.label}</span>
    </Link>
  )
}

export default function SidebarAdmin({ open = true }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const groups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      isActive(currentPathname) {
        if (item.persona) {
          return currentPathname === item.href && searchParams.get("persona") === item.persona
        }
        return currentPathname === item.href || currentPathname.startsWith(`${item.href}/`)
      },
    })),
  }))

  return (
    <aside className="admin-sidebar-content flex h-full w-full flex-col border-r border-border bg-white">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-purple/10">
          <Sparkles size={18} className="text-accent-purple" />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight text-text-primary">Tachy CMS</p>
          <p className="text-[11px] font-medium leading-tight text-text-muted">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div>
          {groups.map((group) => (
            <div key={group.label} className="admin-nav-group">
              <p className="mb-1.5 px-3 text-xs font-bold uppercase tracking-[0.08em] text-text-muted">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItem
                    key={item.href + (item.persona || "")}
                    item={item}
                    pathname={pathname}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="shrink-0 border-t border-border p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-text-muted transition-colors hover:bg-red-50 hover:text-red-500"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg text-current">
            <LogOut size={18} />
          </div>
          Logout
        </button>
      </div>
    </aside>
  )
}
