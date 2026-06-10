"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const STATUS_COLORS = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  hidden: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  out_of_stock: "bg-red-500/10 text-red-500 border-red-500/20",
}

export default function ShopListClient({ products: initialProducts }) {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this product?")) return

    const res = await fetch(`/api/admin/shop/products/${id}`, {
      method: "DELETE",
    })

    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      router.refresh()
    }
  }

  const filtered = products.filter((product) => {
    const matchesSearch =
      !search || product.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || product.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="flex items-center gap-3 mb-4" style={{ marginBottom: 16 , gap: 0 }}>
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="hidden">Hidden</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>

      <div className="bg-admin-card border border-border rounded-xl overflow-x-auto" style={{ margin: 12 }}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">
                Name
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">
                Price
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">
                Category
              </th>
              <th className="text-right px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-text-muted text-sm">
                  No products found.
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border last:border-0 hover:bg-admin-hover/50 transition-colors"                >
                  <td className="px-5 py-3">
                    <p className="text-text-primary text-sm font-medium">{product.name}</p>
                    <p className="text-text-muted text-xs mt-0.5">/{product.slug}</p>
                  </td>
                  <td className="px-5 py-3">
                    <Badge
                      variant="outline"
                      className={`text-xs ${STATUS_COLORS[product.status] || ""}`}
                      style={{ padding: "2px 8px" }}
                    >
                      {product.status?.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-text-primary text-sm font-mono">
                    {product.currency} {product.price?.toFixed(2)}
                  </td>
                  <td className="px-5 py-3 text-text-secondary text-sm">
                    {product.category || "—"}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-start gap-2">
                      <Link
                        href={`/admin/shop/${product.id}/edit`}
                        className="p-1.5 text-text-muted hover:text-accent-cyan transition-colors"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-text-muted hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
