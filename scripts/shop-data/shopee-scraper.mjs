import { decodeHtml, normalizeImageUrl, uniq } from "./content-builder.mjs"

function parsePrice(value) {
  if (value === null || value === undefined) return null
  const cleaned = String(value).replace(/[^0-9]/g, "")
  if (!cleaned) return null
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : null
}

function parseJsonLdBlocks(html) {
  const matches = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
  const results = []
  for (const match of matches) {
    const raw = decodeHtml(match[1]).trim()
    if (!raw) continue
    try {
      results.push(JSON.parse(raw))
    } catch {
      // Ignore malformed LD+JSON blobs.
    }
  }
  return results
}

function flattenNodes(node) {
  if (!node) return []
  if (Array.isArray(node)) return node.flatMap(flattenNodes)
  if (typeof node !== "object") return []
  const self = [node]
  if (Array.isArray(node["@graph"])) return [...self, ...node["@graph"].flatMap(flattenNodes)]
  return self
}

function findProductSchema(html) {
  const nodes = parseJsonLdBlocks(html).flatMap(flattenNodes)
  return nodes.find((node) => {
    const type = node?.["@type"]
    if (Array.isArray(type)) return type.includes("Product")
    return type === "Product"
  }) || null
}

function extractShopeeData(html) {
  const productSchema = findProductSchema(html)
  const metaPrice = html.match(/<meta[^>]+property="product:price:amount"[^>]+content="([^"]+)"/i)?.[1]
  const metaImage = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)?.[1]
  const schemaImages = productSchema?.image
  const schemaOffers = productSchema?.offers

  let price = parsePrice(metaPrice)
  if (!price && schemaOffers) {
    if (Array.isArray(schemaOffers)) {
      price = parsePrice(schemaOffers[0]?.price)
    } else {
      price = parsePrice(schemaOffers.price)
    }
  }

  const images = uniq([
    ...(Array.isArray(schemaImages) ? schemaImages : [schemaImages]),
    metaImage,
  ].map(normalizeImageUrl)).slice(0, 5)

  return { price, images }
}

export async function fetchShopeeMeta(product, attempt = 1) {
  try {
    const res = await fetch(product.affiliateUrl, {
      redirect: "follow",
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137.0 Safari/537.36",
        "accept-language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const html = await res.text()
    return extractShopeeData(html)
  } catch (error) {
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000))
      return fetchShopeeMeta(product, attempt + 1)
    }
    console.warn(`Failed to fetch live data for ${product.name}: ${error.message}`)
    return { price: null, images: [] }
  }
}
