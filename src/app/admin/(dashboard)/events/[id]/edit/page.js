import { readEvent } from "@/lib/db"
import EventsForm from "@/components/admin/EventsForm"

export const dynamic = "force-dynamic"

export default async function EditEventsPage({ params }) {
  const { id } = await params
  const item = await readEvent(id)
  if (!item) return <div className="text-text-muted">Not found</div>
  return <EventsForm item={item} />
}
