import Link from "next/link"
import { File, Music, Calendar, Image, Briefcase, Award, ExternalLink } from "lucide-react"

export const dynamic = "force-dynamic"

const STATIC_PAGES = [
  { name: "About Artist", route: "/about", icon: File, status: "Coming soon" },
  { name: "Bio Music", route: "/bio-music", icon: Music, status: "Coming soon" },
  { name: "Tour & Events", route: "/tour-events", icon: Calendar, status: "Coming soon" },
  { name: "Gallery", route: "/gallery", icon: Image, status: "Coming soon" },
  { name: "Collaboration", route: "/collab", icon: Briefcase, status: "Coming soon" },
  { name: "Digital Landing", route: "/digital", icon: Award, status: "Coming soon" },
]

export default function AdminPagesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Static Pages</h1>
        <p className="text-text-muted text-sm mt-1">Frontend pages status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STATIC_PAGES.map((page) => {
          const Icon = page.icon
          return (
            <div key={page.route} className="bg-admin-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-purple/10 flex items-center justify-center">
                    <Icon size={20} className="text-accent-purple" />
                  </div>
                  <div>
                    <p className="text-text-primary text-sm font-medium">{page.name}</p>
                    <p className="text-text-muted text-xs font-mono">{page.route}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">{page.status}</span>
                <Link href={page.route} target="_blank" className="text-xs text-accent-cyan hover:underline flex items-center gap-1">
                  <ExternalLink size={12} />
                  View
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
