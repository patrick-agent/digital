import Link from "next/link"
import {
  FileText,
  Music,
  Calendar,
  Image,
  ShoppingBag,
  Briefcase,
  Award,
  Mail,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react"
import { readPosts, readProducts, readEvents, readSubscribers, readMusic, readServices, readCaseStudies, readGallery } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  // Blog stats
  const { data: allPosts } = await readPosts()
  const artistPosts = allPosts.filter((p) => p.persona === "artist")
  const marketerPosts = allPosts.filter((p) => p.persona === "marketer")
  const draftArtist = artistPosts.filter((p) => p.status === "draft").length
  const draftMarketer = marketerPosts.filter((p) => p.status === "draft").length
  const publishedTotal = allPosts.filter((p) => p.status === "published").length

  // Shop stats
  const { data: products } = await readProducts()
  const activeProducts = products.filter((p) => p.status === "active").length

  // Events stats
  const { data: events } = await readEvents()
  const upcomingEvents = events.filter((e) => e.status === "upcoming")
  const nextThreeEvents = upcomingEvents.slice(0, 3)

  // Newsletter stats
  const { data: subscribers } = await readSubscribers()
  const activeSubscribers = subscribers.filter((s) => s.status === "active").length
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const newSubscribers7d = subscribers.filter(
    (s) => new Date(s.subscribedAt) >= sevenDaysAgo && s.status === "active"
  ).length

  // Music stats
  const { data: musicItems } = await readMusic()
  const featuredMusic = musicItems.filter((m) => m.featured).length

  // Services stats
  const { data: services } = await readServices()
  const activeServices = services.filter((s) => s.status === "active").length

  // Case studies stats
  const { data: caseStudies } = await readCaseStudies()
  const publishedCases = caseStudies.filter((c) => c.status === "published").length

  // Gallery stats
  const { data: galleryItems } = await readGallery()

  const stats = [
    { label: "Blog Posts", value: allPosts.length, sub: `${publishedTotal} published`, icon: FileText, color: "text-accent-purple", href: "/admin/blog" },
    { label: "Drafts — Artist", value: draftArtist, icon: FileText, color: "text-accent-pink", href: "/admin/blog?persona=artist" },
    { label: "Drafts — Another Me", value: draftMarketer, icon: FileText, color: "text-accent-cyan", href: "/admin/blog?persona=marketer" },
    { label: "Products", value: products.length, sub: `${activeProducts} active`, icon: ShoppingBag, color: "text-accent-cyan", href: "/admin/shop" },
    { label: "Releases", value: musicItems.length, sub: `${featuredMusic} featured`, icon: Music, color: "text-accent-purple", href: "/admin/music" },
    { label: "Upcoming Events", value: upcomingEvents.length, icon: Calendar, color: "text-accent-cyan", href: "/admin/events" },
    { label: "Services", value: services.length, sub: `${activeServices} active`, icon: Briefcase, color: "text-accent-purple", href: "/admin/services" },
    { label: "Case Studies", value: caseStudies.length, sub: `${publishedCases} published`, icon: Award, color: "text-accent-cyan", href: "/admin/case-studies" },
    { label: "Gallery Items", value: galleryItems.length, icon: Image, color: "text-accent-pink", href: "/admin/gallery" },
    { label: "Subscribers", value: activeSubscribers, sub: `+${newSubscribers7d} this week`, icon: Mail, color: "text-accent-purple", href: "/admin/newsletter" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-muted text-sm mt-1">Welcome back, Admin</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 px-4 py-2 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            New Post
          </Link>
          <Link
            href="/admin/events/new"
            className="flex items-center gap-2 px-4 py-2 bg-admin-card border border-border hover:bg-admin-hover text-text-primary rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            New Event
          </Link>
          <Link
            href="/admin/shop/new"
            className="flex items-center gap-2 px-4 py-2 bg-admin-card border border-border hover:bg-admin-hover text-text-primary rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            New Product
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-admin-card border border-border rounded-xl p-6 hover:border-accent-purple/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <p className="text-text-muted text-sm">{stat.label}</p>
                <Icon size={20} className={stat.color} />
              </div>
              <p className="text-3xl font-bold text-text-primary mt-2">{stat.value}</p>
              {stat.sub && (
                <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                  <TrendingUp size={12} />
                  {stat.sub}
                </p>
              )}
            </Link>
          )
        })}
      </div>

      {/* Upcoming events */}
      {nextThreeEvents.length > 0 && (
        <div className="bg-admin-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">Upcoming Events</h2>
            <Link href="/admin/events" className="text-sm text-accent-cyan hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {nextThreeEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-text-primary text-sm font-medium">{event.eventName}</p>
                  <p className="text-text-muted text-xs">{event.venue} • {event.city}, {event.country}</p>
                </div>
                <div className="text-right">
                  <p className="text-text-secondary text-sm">{new Date(event.date).toLocaleDateString()}</p>
                  {event.ticketUrl && (
                    <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent-cyan hover:underline">
                      Tickets
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent subscribers */}
      {newSubscribers7d > 0 && (
        <div className="bg-admin-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">New Subscribers (7 days)</h2>
            <Link href="/admin/newsletter" className="text-sm text-accent-cyan hover:underline">
              View all
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-purple/20 flex items-center justify-center">
              <Users size={20} className="text-accent-purple" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{newSubscribers7d}</p>
              <p className="text-text-muted text-xs">New subscribers this week</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
