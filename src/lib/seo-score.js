// SEO scoring utility - safe for client components (no fs imports)
export function calculateSEOScore(data) {
  let score = 0
  const checks = []

  const titleLen = (data.seoTitle || data.title || "").length
  if (titleLen >= 30 && titleLen <= 60) {
    score += 25
    checks.push({ name: "title_length", status: "pass" })
  } else if (titleLen > 0) {
    score += 10
    checks.push({ name: "title_length", status: "warn" })
  } else {
    checks.push({ name: "title_length", status: "fail" })
  }

  const descLen = (data.seoDescription || data.excerpt || data.description || "").length
  if (descLen >= 120 && descLen <= 160) {
    score += 25
    checks.push({ name: "desc_length", status: "pass" })
  } else if (descLen > 0) {
    score += 10
    checks.push({ name: "desc_length", status: "warn" })
  } else {
    checks.push({ name: "desc_length", status: "fail" })
  }

  if (data.coverImage || data.coverArt || data.images?.length > 0) {
    score += 25
    checks.push({ name: "has_image", status: "pass" })
  } else {
    checks.push({ name: "has_image", status: "fail" })
  }

  if ((data.tags && data.tags.length > 0) || data.category) {
    score += 25
    checks.push({ name: "taxonomy", status: "pass" })
  } else {
    checks.push({ name: "taxonomy", status: "fail" })
  }

  return { score, checks }
}
