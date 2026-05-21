import { notFound } from "next/navigation"
import { readProduct } from "@/lib/db"
import ShopForm from "@/components/admin/ShopForm"

export const dynamic = "force-dynamic"

export default async function EditProductPage({ params }) {
  const { id } = await params
  const product = await readProduct(id)

  if (!product) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Edit Product</h1>
        <p className="text-text-muted text-sm mt-1">Editing: {product.name}</p>
      </div>

      <ShopForm product={product} />
    </div>
  )
}
