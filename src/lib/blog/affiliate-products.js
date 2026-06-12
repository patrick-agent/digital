import { readProducts } from "@/lib/db/shop"

function normalizeAffiliateUrl(value) {
  if (!value) return ""

  try {
    const url = new URL(value.trim())
    url.hash = ""
    url.hostname = url.hostname.toLowerCase()

    if (url.pathname.length > 1) {
      url.pathname = url.pathname.replace(/\/+$/, "")
    }

    const params = [...url.searchParams.entries()].sort(([leftKey, leftValue], [rightKey, rightValue]) => {
      if (leftKey === rightKey) {
        return leftValue.localeCompare(rightValue)
      }

      return leftKey.localeCompare(rightKey)
    })

    url.search = ""
    for (const [key, val] of params) {
      url.searchParams.append(key, val)
    }

    return url.toString()
  } catch {
    return value.trim()
  }
}

function extractArticleLinks(content) {
  if (!content) return []

  const links = []
  const seen = new Set()
  const patterns = [
    /<a\b[^>]*href=(['"])(.*?)\1/gi,
    /\[[^\]]+\]\((https?:\/\/[^\s)]+)\)/gi,
  ]

  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(content))) {
      const href = (match[2] || match[1] || "").trim()
      if (!href || seen.has(href)) continue

      seen.add(href)
      links.push(href)
    }
  }

  return links
}

export async function getAffiliateProductsForArticle(content) {
  const links = extractArticleLinks(content)
  if (links.length === 0) return []

  const { data: products } = await readProducts({ status: "active", page: 1, limit: 500 })
  const productByAffiliateUrl = new Map(
    products
      .filter((product) => product.affiliateUrl)
      .map((product) => [normalizeAffiliateUrl(product.affiliateUrl), product])
  )

  const matchedProducts = []
  const seenProducts = new Set()

  for (const link of links) {
    const product = productByAffiliateUrl.get(normalizeAffiliateUrl(link))
    if (!product || seenProducts.has(product.id)) continue

    seenProducts.add(product.id)
    matchedProducts.push(product)
  }

  return matchedProducts
}
