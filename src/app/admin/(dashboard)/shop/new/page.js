import ShopForm from "@/components/admin/ShopForm"

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">New Product</h1>
        <p className="text-text-muted text-sm mt-1">Add a new product to the shop</p>
      </div>

      <ShopForm />
    </div>
  )
}
