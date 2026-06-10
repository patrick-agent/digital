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
  Users,
  ExternalLink,
  ArrowRight,
  Search,
  Settings,
} from "lucide-react"
import { readPosts, readProducts, readEvents, readSubscribers, readMusic, readServices, readCaseStudies, readGallery } from "@/lib/db"
import StatCard from "@/components/admin/StatCard"
import SectionCard from "@/components/admin/SectionCard"
import EmptyState from "@/components/admin/EmptyState"
import QuickActionButton from "@/components/admin/QuickActionButton"
import PageHeader from "@/components/admin/PageHeader"
import AdminPageContainer from "@/components/admin/AdminPageContainer"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const { data: allPosts } = await readPosts({ limit: 9999 })
  const { data: products } = await readProducts()
  const { data: events } = await readEvents()
  const { data: subscribers } = await readSubscribers()
  const { data: musicItems } = await readMusic()
  const { data: services } = await readServices()
  const { data: caseStudies } = await readCaseStudies()
  const { data: galleryItems } = await readGallery()

  const publishedTotal = allPosts.filter((p) => p.status === "published").length
  const draftTotal = allPosts.length - publishedTotal
  const activeProducts = products.filter((p) => p.status === "active").length
  const upcomingEvents = events.filter((e) => e.status === "upcoming")
  const nextThreeEvents = upcomingEvents.slice(0, 3)
  const activeSubscribers = subscribers.filter((s) => s.status === "active").length
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const newSubscribers7d = subscribers.filter(
    (s) => new Date(s.subscribedAt) >= sevenDaysAgo && s.status === "active"
  ).length
  const featuredMusic = musicItems.filter((m) => m.featured).length
  const activeServices = services.filter((s) => s.status === "active").length
  const publishedCases = caseStudies.filter((c) => c.status === "published").length

  const stats = [
    { label: "Blog Posts", value: publishedTotal, sub: `${draftTotal} draft${draftTotal !== 1 ? "s" : ""}`, icon: FileText, color: "purple", href: "/admin/blog" },
    { label: "Products", value: activeProducts, sub: `${products.length} total`, icon: ShoppingBag, color: "cyan", href: "/admin/shop" },
    { label: "Releases", value: musicItems.length, sub: `${featuredMusic} featured`, icon: Music, color: "purple", href: "/admin/music" },
    { label: "Services", value: activeServices, sub: `${services.length} total`, icon: Briefcase, color: "pink", href: "/admin/services" },
    { label: "Case Studies", value: publishedCases, sub: `${caseStudies.length - publishedCases} draft`, icon: Award, color: "cyan", href: "/admin/case-studies" },
    { label: "Gallery Items", value: galleryItems.length, sub: "Media assets", icon: Image, color: "orange", href: "/admin/gallery" },
    { label: "Subscribers", value: activeSubscribers, sub: `${newSubscribers7d > 0 ? "+" + newSubscribers7d : "0"} this week`, icon: Mail, color: "purple", href: "/admin/newsletter" },
    { label: "Events", value: upcomingEvents.length, sub: "Upcoming", icon: Calendar, color: "cyan", href: "/admin/events" },
  ]

  const quickActions = [
    { label: "New Event", href: "/admin/events/new", icon: Calendar, desc: "Add tour dates" },
    { label: "New Product", href: "/admin/shop/new", icon: ShoppingBag, desc: "Add merch items" },
    { label: "SEO Settings", href: "/admin/seo", icon: Search, desc: "Optimize metadata" },
  ]

  return (
    <AdminPageContainer>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your content, media, and site performance."
        actions={
          <>
            <QuickActionButton icon={Plus} label="New Post" href="/admin/blog/new" variant="primary" />
            <QuickActionButton icon={ExternalLink} label="Website Builder" href="/admin/website" />
            <QuickActionButton icon={Image} label="Media Library" href="/admin/media" />
          </>
        }
      />

      {/* Stats Grid — 4 cols desktop, 2 tablet, 1 mobile */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Bottom Sections — 2/3 + 1/3 on desktop */}
      <div className="admin-bottom-grid grid gap-6 lg:grid-cols-[2fr_1fr]">

        {/* ===== LEFT COLUMN ===== */}
        <div className="flex flex-col gap-6">

          {/* Upcoming Events */}
          <SectionCard
            title="Upcoming Events"
            action={nextThreeEvents.length > 0 ? { label: "View all", href: "/admin/events" } : undefined}
          >
            {nextThreeEvents.length > 0 ? (
              <div className="divide-y divide-border">
                {nextThreeEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-text-primary truncate">{event.eventName}</p>
                      <p className="mt-0.5 text-xs text-text-muted truncate">
                        {event.venue}{event.venue && event.city ? " · " : ""}{event.city}
                      </p>
                    </div>
                    <div className="ml-4 flex flex-col items-end gap-1">
                      <span className="text-xs font-semibold text-text-secondary whitespace-nowrap">
                        {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      {event.ticketUrl && (
                        <a
                          href={event.ticketUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-accent-purple hover:underline"
                        >
                          Tickets
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title="No upcoming events"
                description="Schedule a tour date or event to display here."
                action={{ label: "Create Event", href: "/admin/events/new" }}
              />
            )}
          </SectionCard>

          {/* Quick Create */}
          <SectionCard title="Quick Create">
            <div className="divide-y divide-border">
              {quickActions.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="admin-action-card"
                  >
                    <div className="action-icon">
                      <Icon />
                    </div>
                    <div>
                      <div className="action-label">{item.label}</div>
                      <div className="action-desc">{item.desc}</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </SectionCard>
        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div className="flex flex-col gap-6">

          {/* Newsletter */}
          <SectionCard title="Newsletter">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-purple/10">
                <Users size={24} className="text-accent-purple" />
              </div>
              <div>
                <div className="text-[1.75rem] font-bold tracking-tight text-text-primary">{newSubscribers7d}</div>
                <div className="mt-0.5 text-sm font-semibold text-text-muted">New subscribers this week</div>
              </div>
            </div>
            <div className="admin-newsletter-row flex items-center justify-between rounded-xl border border-border bg-gray-50 px-4 py-3.5">
              <div>
                <div className="text-xs font-medium text-text-muted">Total active</div>
                <div className="text-base font-bold text-text-primary">{activeSubscribers}</div>
              </div>
              <Link
                href="/admin/newsletter"
                className="admin-btn-primary"
                style={{ height: 34, fontSize: 12, padding: "0 14px" }}
              >
                Manage
                <ArrowRight size={13} />
              </Link>
            </div>
          </SectionCard>

          {/* Site Health / SEO Settings */}
          <SectionCard title="SEO Settings">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-purple/10">
                <Settings size={24} className="text-accent-purple" />
              </div>
              <div>
                <div className="text-sm font-semibold text-text-primary">Meta & SEO</div>
                <div className="mt-0.5 text-xs text-text-muted">Manage metadata, sitemap, and indexing.</div>
              </div>
            </div>
            <Link
              href="/admin/seo"
              className="admin-seo-link mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:bg-gray-50"
            >
              <Settings size={15} />
              Open SEO Dashboard
            </Link>
          </SectionCard>
        </div>
      </div>
    </AdminPageContainer>
  )
}
