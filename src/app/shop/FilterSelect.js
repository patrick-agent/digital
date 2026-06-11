"use client"

import { startTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  SHOP_PRICE_RANGES,
  SHOP_SORT_OPTIONS,
  buildShopHref,
} from "@/lib/shop/query"
import styles from "./shop.module.css"

function navigate(router, searchParams, updates) {
  startTransition(() => {
    router.push(buildShopHref(searchParams, updates))
  })
}

export default function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const priceRange = searchParams.get("priceRange") || ""
  const sort = searchParams.get("sort") || ""
  const q = searchParams.get("q") || ""

  function handlePriceRange(e) {
    navigate(router, searchParams, { priceRange: e.target.value })
  }

  function handleSort(e) {
    navigate(router, searchParams, { sort: e.target.value })
  }

  function handleSearch(e) {
    e.preventDefault()
    navigate(router, searchParams, {
      q: e.currentTarget.elements.q.value.trim() || "",
    })
  }

  return (
    <div className={styles.filterBar}>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="shop-price-range">Khoảng giá</label>
        <select id="shop-price-range" value={priceRange} onChange={handlePriceRange}>
          {SHOP_PRICE_RANGES.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="shop-sort">Sắp xếp</label>
        <select id="shop-sort" value={sort} onChange={handleSort}>
          {SHOP_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <form className={`${styles.filterGroup} ${styles.searchForm}`} onSubmit={handleSearch}>
        <label className={styles.filterLabel} htmlFor="shop-search">Tìm kiếm</label>
        <div className={styles.searchWrap}>
          <input
            id="shop-search"
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Nhập tên gear, brand hoặc nhu cầu…"
            autoComplete="off"
          />
          <button type="submit" className={styles.searchButton}>
            Tìm
          </button>
        </div>
      </form>
    </div>
  )
}
