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
    { route: "/contact", label: "Contact" },
    { route: "/privacy", label: "Privacy Policy" },
    { route: "/terms", label: "Terms & Conditions" },
    { route: "/bio-music", label: "Bio Music" },
    { route: "/blog", label: "Blog Index" },
    { route: "/shop", label: "Shop" },
    { route: "/digital", label: "Digital Landing" },
    { route: "/digital/blog", label: "Digital Blog" },
  ]
}
