import { readSubscribers } from "@/lib/db"
import NewsletterClient from "./NewsletterClient"

export const dynamic = "force-dynamic"

export default async function NewsletterPage({ searchParams }) {
  const params = await searchParams
  const { data: subscribers, meta } = await readSubscribers({
    status: params?.status || "",
    search: params?.search || "",
  })

  return <NewsletterClient subscribers={subscribers} meta={meta} />
}
