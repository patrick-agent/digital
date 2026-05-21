import Link from "next/link"
import { Plus } from "lucide-react"
import { readProducts } from "@/lib/db"
import ShopListClient from "./ShopListClient"

export const dynamic = "force-dynamic"

export default async function AdminShopPage({ searchParams }) {
  const params = await searchParams
  const status = params?.status || ""
  const category = params?.category || ""

  const { data: products, meta } = await readProducts({ status, category })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Products</h1>
          <p className="text-text-muted text-sm mt-1">
            {meta.total} {meta.total === 1 ? "product" : "products"} total
          </p>
        </div>
        <Link
          href="/admin/shop/new"
          className="flex items-center gap-2 px-4 py-2 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          New Product
        </Link>
      </div>

      <ShopListClient products={products} />
    </div>
  )
}
