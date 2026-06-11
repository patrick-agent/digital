export function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || ""
}

export function formatProductPriceText(price, currency = "VND") {
  const numericPrice = Number(price)

  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return ""
  }

  if (currency === "VND") {
    return `${new Intl.NumberFormat("vi-VN").format(numericPrice)} VND`
  }

  return formatProductPrice(numericPrice, currency)
}

export function syncDescriptionPrice(html, price, currency = "VND") {
  if (!html) return ""

  const priceText = formatProductPriceText(price, currency)
  if (!priceText) return html

  return html.replace(
    /(Giá tham khảo hiện tại quanh\s*<strong>)(.*?)(<\/strong>)/i,
    `$1${priceText}$3`
  )
}

export function clampText(text, maxLength = 160) {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}…`
}

export function getProductExcerpt(html, maxLength = 160) {
  return clampText(stripHtml(html), maxLength)
}

export function getPrimaryProductImage(product) {
  return product?.images?.[0] || null
}

const CURRENCY_LOCALES = {
  VND: "vi-VN",
  USD: "en-US",
  EUR: "de-DE",
}

export function formatProductPrice(price, currency = "VND") {
  const numericPrice = Number(price)

  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return "Liên hệ"
  }

  try {
    return new Intl.NumberFormat(CURRENCY_LOCALES[currency] || "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "VND" ? 0 : 2,
    }).format(numericPrice)
  } catch {
    return `${numericPrice} ${currency}`
  }
}
