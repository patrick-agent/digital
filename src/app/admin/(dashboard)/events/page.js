import Link from "next/link"
import { Plus } from "lucide-react"
import { readEvents } from "@/lib/db"
import EventsListClient from "./EventsListClient"

export const dynamic = "force-dynamic"

export default async function AdminEventsPage({ searchParams }) {
  const params = await searchParams
  const { data: items, meta } = await readEvents({
    status: params?.status || "",
    search: params?.search || "",
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Tour & Events</h1>
          <p className="text-text-muted text-sm mt-1">{meta.total} events</p>
        </div>
        <Link href="/admin/events/new" className="flex items-center gap-2 px-4 py-2 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} />
          New Event
        </Link>
      </div>
      <EventsListClient items={items} />
    </div>
  )
}
