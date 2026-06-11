import path from "node:path"
import { writeFile } from "node:fs/promises"
import { products, IMAGE_MAP } from "./shop-data/products.mjs"
import { slugify, buildDescription, buildWhyRecommend, buildPriceNote, buildSeoTitle, buildSeoDescription, buildFaq, formatPrice } from "./shop-data/content-builder.mjs"
import { fetchShopeeMeta } from "./shop-data/shopee-scraper.mjs"

async function main() {
  const now = Date.now()
  const catalog = []

  for (const [index, product] of products.entries()) {
    const live = await fetchShopeeMeta(product)
    const price = live.price || product.priceFallback
    const images = IMAGE_MAP[product.name] || live.images

    console.log(`- ${product.name}: ${price ? formatPrice(price) : "no price"}, images=${images.length}`)

    catalog.push({
      id: crypto.randomUUID(),
      brand: product.brand,
      name: product.name,
      slug: slugify(product.name),
      description: buildDescription(product, price),
      price,
      currency: "VND",
      images,
      category: product.category,
      tags: product.tags,
      affiliateUrl: product.affiliateUrl,
      stockQuantity: 0,
      stripeProductId: "",
      status: "active",
      seoTitle: buildSeoTitle(product),
      seoDescription: buildSeoDescription(product),
      priceNote: buildPriceNote(product),
      features: product.features,
      whyRecommend: buildWhyRecommend(product),
      faq: buildFaq(product),
      relatedArticles: product.relatedArticles,
      createdAt: new Date(now - index * 60_000).toISOString(),
      updatedAt: new Date(now).toISOString(),
    })

    await new Promise((resolve) => setTimeout(resolve, 350))
  }

  const outFile = path.join(process.cwd(), "db", "shop.json")
  await writeFile(outFile, `${JSON.stringify(catalog, null, 2)}\n`, "utf8")
  console.log(`Wrote ${catalog.length} products to ${outFile}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
