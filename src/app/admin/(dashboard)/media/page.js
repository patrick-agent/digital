import { readMedia } from "@/lib/db"
import MediaLibraryClient from "./MediaLibraryClient"

export const dynamic = "force-dynamic"

export default async function AdminMediaPage() {
  const { data } = await readMedia({ limit: 120 })
  return <MediaLibraryClient initialItems={data} />
}
