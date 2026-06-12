const BLOG_CATEGORY_META = {
  "thu-am-tai-nha": {
    label: "Thu âm tại nhà",
    description: "Kinh nghiệm dựng home studio, tối ưu phòng thu nhỏ và workflow thu âm hiệu quả tại nhà.",
  },
  "review-thiet-bi": {
    label: "Review thiết bị",
    description: "Review audio interface, micro, tai nghe, monitor và gear phòng thu theo góc nhìn thực chiến.",
  },
  "the-loai-nhac": {
    label: "Thể loại nhạc",
    description: "Khám phá đặc trưng, cấu trúc và màu sắc của từng thể loại nhạc dành cho producer và artist.",
  },
  "kien-thuc-am-nhac": {
    label: "Kiến thức âm nhạc",
    description: "Nền tảng lý thuyết, tư duy nghe và kiến thức âm nhạc giúp viết, phối và sản xuất chắc tay hơn.",
  },
  "san-xuat-nhac": {
    label: "Sản xuất nhạc",
    description: "Workflow sản xuất nhạc, sáng tác, arrangement, mixing và phát triển bản phối từ ý tưởng đến thành phẩm.",
  },
  "ky-thuat-am-thanh": {
    label: "Kỹ thuật âm thanh",
    description: "Kiến thức về tín hiệu, gain staging, EQ, dynamics, monitoring và kỹ thuật xử lý âm thanh.",
  },
  "thiet-bi-phong-thu": {
    label: "Thiết bị phòng thu",
    description: "Gợi ý setup studio, cách chọn thiết bị và tối ưu chuỗi phần cứng cho producer.",
  },
}

function humanizeCategory(category) {
  if (!category) return "Blog"

  return category
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function getBlogCategoryMeta(category) {
  const fallbackLabel = humanizeCategory(category)
  const meta = BLOG_CATEGORY_META[category]

  return {
    slug: category,
    label: meta?.label || fallbackLabel,
    description: meta?.description || `Bài viết mới nhất về ${fallbackLabel.toLowerCase()} từ Tachy.`,
  }
}

export function formatBlogCategoryLabel(category) {
  return getBlogCategoryMeta(category).label
}

export function getBlogCategoryHref(category, page = 1) {
  if (!category) return "/blog"

  const basePath = `/blog/${encodeURIComponent(category)}`
  return page > 1 ? `${basePath}?page=${page}` : basePath
}
