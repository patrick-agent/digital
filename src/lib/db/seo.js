import { readFileJSON, writeFileJSON } from "./io.js"

export async function readSEOMetadata() {
  const data = await readFileJSON("seo.json")
  if (data) return data
  return { pages: {} }
}

export async function updateSEOMetadata(route, data) {
  const existing = await readSEOMetadata()
  if (!existing.pages) existing.pages = {}

  existing.pages[route] = {
    ...(existing.pages[route] || {}),
    ...data,
    updatedAt: new Date().toISOString(),
  }

  await writeFileJSON("seo.json", existing)
  return existing.pages[route]
}

export async function getAllRoutes() {
  return [
    { route: "/", label: "Homepage" },
    { route: "/about", label: "About Artist" },
    { route: "/bio-music", label: "Bio Music" },
    { route: "/blog", label: "Blog Index" },
    { route: "/shop", label: "Shop" },
    { route: "/gallery", label: "Gallery" },
    { route: "/tour-events", label: "Tour & Events" },
    { route: "/press-kit", label: "Press Kit" },
    { route: "/collab", label: "Collaboration" },
    { route: "/digital", label: "Digital Landing" },
    { route: "/digital/about", label: "Digital About" },
    { route: "/digital/blog", label: "Digital Blog" },
    { route: "/digital/contact", label: "Digital Contact" },
    { route: "/digital/services", label: "Digital Services" },
    { route: "/digital/case-studies", label: "Digital Case Studies" },
    { route: "/newsletter", label: "Newsletter" },
    { route: "/links", label: "Links Hub" },
  ]
}
