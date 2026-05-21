import { readSEOMetadata, getAllRoutes } from "@/lib/db"
import SEOClient from "./SEOClient"

export const dynamic = "force-dynamic"

export default async function SEOPage() {
  const seo = await readSEOMetadata()
  const routes = await getAllRoutes()
  return <SEOClient seo={seo} routes={routes} />
}
