"use client"

import { useRouter, useSearchParams } from "next/navigation"
import styles from "./shop.module.css"

const PRICE_RANGES = [
  { label: "Tất cả", value: "" },
  { label: "Dưới 1.000.000₫", value: "0-1e6" },
  { label: "1.000.000₫ – 3.000.000₫", value: "1e6-3e6" },
  { label: "3.000.000₫ – 5.000.000₫", value: "3e6-5e6" },
  { label: "Trên 5.000.000₫", value: "5e6-" },
]

function buildParams(searchParams, updates) {
  const params = new URLSearchParams()
  for (const [k, v] of searchParams.entries()) {
    params.set(k, v)
  }
  for (const [k, v] of Object.entries(updates)) {
    if (v) params.set(k, v)
    else params.delete(k)
  }
  return params
}

function navigate(router, params) {
  const qs = params.toString()
  router.push(qs ? `/shop?${qs}` : "/shop")
}

export default function FilterBar({ categories }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const category = searchParams.get("category") || ""
  const priceRange = searchParams.get("priceRange") || ""
  const sort = searchParams.get("sort") || ""
  const q = searchParams.get("q") || ""

  function handleCategory(e) {
    const params = buildParams(searchParams, { category: e.target.value === "all" ? "" : e.target.value })
    navigate(router, params)
  }

  function handlePriceRange(e) {
    const params = buildParams(searchParams, { priceRange: e.target.value })
    navigate(router, params)
  }

  function handleSort(e) {
    const params = buildParams(searchParams, { sort: e.target.value })
    navigate(router, params)
  }

  function handleSearch(e) {
    e.preventDefault()
    const params = buildParams(searchParams, { q: e.currentTarget.q.value.trim() || "" })
    navigate(router, params)
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch(e)
  }

  return (
    <div className={styles.filterBar}>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Danh mục</label>
        <select value={category || "all"} onChange={handleCategory}>
          <option value="all">Tất cả</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Khoảng giá</label>
        <select value={priceRange} onChange={handlePriceRange}>
          {PRICE_RANGES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Sắp xếp</label>
        <select value={sort} onChange={handleSort}>
          <option value="">Mặc định</option>
          <option value="price-asc">Giá: Thấp→Cao</option>
          <option value="price-desc">Giá: Cao→Thấp</option>
          <option value="name-asc">Tên: A→Z</option>
          <option value="name-desc">Tên: Z→A</option>
        </select>
      </div>

      <form className={styles.filterGroup} onSubmit={handleSearch}>
        <label className={styles.filterLabel}>Tìm kiếm</label>
        <div className={styles.searchWrap}>
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Nhập từ khóa..."
            onKeyDown={handleKeyDown}
          />
        </div>
      </form>
    </div>
  )
}
