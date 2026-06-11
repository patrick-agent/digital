export const SHOP_PATH = "/shop"

export const SHOP_PRICE_RANGES = [
  { label: "Tất cả", value: "" },
  { label: "Dưới 1.000.000₫", value: "0-1e6" },
  { label: "1.000.000₫ – 3.000.000₫", value: "1e6-3e6" },
  { label: "3.000.000₫ – 5.000.000₫", value: "3e6-5e6" },
  { label: "Trên 5.000.000₫", value: "5e6-" },
]

export const SHOP_SORT_OPTIONS = [
  { label: "Mặc định", value: "" },
  { label: "Giá: Thấp đến cao", value: "price-asc" },
  { label: "Giá: Cao đến thấp", value: "price-desc" },
  { label: "Tên: A đến Z", value: "name-asc" },
  { label: "Tên: Z đến A", value: "name-desc" },
]

export const SHOP_PRICE_RANGE_LABELS = Object.fromEntries(
  SHOP_PRICE_RANGES.map((option) => [option.value, option.label])
)

export const SHOP_SORT_LABELS = Object.fromEntries(
  SHOP_SORT_OPTIONS.map((option) => [option.value, option.label])
)

function getEntries(source) {
  if (!source) return []

  if (typeof source.entries === "function") {
    return Array.from(source.entries())
  }

  return Object.entries(source).flatMap(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return []
    }

    if (Array.isArray(value)) {
      return value
        .filter((item) => item !== undefined && item !== null && item !== "")
        .map((item) => [key, String(item)])
    }

    return [[key, String(value)]]
  })
}

export function buildShopSearchParams(source, updates = {}) {
  const params = new URLSearchParams(getEntries(source))

  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined || value === null || value === "" || value === "all") {
      params.delete(key)
      continue
    }

    params.set(key, String(value))
  }

  return params
}

export function buildShopHref(source, updates = {}) {
  const params = buildShopSearchParams(source, updates)
  const queryString = params.toString()
  return queryString ? `${SHOP_PATH}?${queryString}` : SHOP_PATH
}
