import { readJSON, writeJSON } from "./io.js"

export async function readSubscribers(filters = {}) {
  let items = await readJSON("newsletter.json")
  const { status, persona, search, page = 1, limit = 100 } = filters

  if (status) items = items.filter((s) => s.status === status)
  if (persona) items = items.filter((s) => s.personaInterest?.includes(persona))

  if (search) {
    const q = search.toLowerCase()
    items = items.filter(
      (s) =>
        s.email.toLowerCase().includes(q) ||
        s.firstName?.toLowerCase().includes(q)
    )
  }

  items.sort((a, b) => new Date(b.subscribedAt) - new Date(a.subscribedAt))
  const total = items.length
  const offset = (page - 1) * limit
  const data = items.slice(offset, offset + limit)

  return { data, meta: { page, limit, total } }
}

export async function unsubscribeSubscriber(id) {
  const items = await readJSON("newsletter.json")
  const index = items.findIndex((s) => s.id === id)
  if (index === -1) return null

  items[index].status = "unsubscribed"
  items[index].unsubscribedAt = new Date().toISOString()
  await writeJSON("newsletter.json", items)
  return items[index]
}

export async function addSubscriber(data) {
  const items = await readJSON("newsletter.json")

  if (items.some((s) => s.email === data.email)) {
    return null
  }

  const now = new Date().toISOString()
  const subscriber = {
    id: crypto.randomUUID(),
    email: data.email || "",
    firstName: data.firstName || "",
    personaInterest: data.personaInterest || [],
    subscribedAt: now,
    status: "active",
  }

  items.push(subscriber)
  await writeJSON("newsletter.json", items)
  return subscriber
}
