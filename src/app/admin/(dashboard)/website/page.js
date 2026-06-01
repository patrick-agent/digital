import { readSettings } from "@/lib/db"
import WebsiteBuilderClient from "./WebsiteBuilderClient"

export const dynamic = "force-dynamic"

export default async function AdminWebsitePage() {
  const settings = await readSettings()
  return <WebsiteBuilderClient settings={settings} />
}
