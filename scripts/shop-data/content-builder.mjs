export function slugify(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\+/g, " plus ")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
}

export function formatPrice(price) {
  return `${Number(price || 0).toLocaleString("vi-VN")} VND`
}

export function decodeHtml(value = "") {
  return String(value)
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

export function normalizeImageUrl(url) {
  if (!url) return null
  const cleaned = decodeHtml(url).trim()
  if (!/^https?:\/\//i.test(cleaned)) return null
  return cleaned
}

export function uniq(values) {
  return [...new Set(values.filter(Boolean))]
}

function joinArticleLinks(items = []) {
  const links = items.map((item) => `<a href="/blog/${item.slug}">${item.title}</a>`)
  if (links.length === 0) return ""
  if (links.length === 1) return links[0]
  if (links.length === 2) return `${links[0]} và ${links[1]}`
  return `${links.slice(0, -1).join(", ")} và ${links.at(-1)}`
}

export function buildDescription(product, price) {
  const articleLinks = joinArticleLinks(product.relatedArticles.slice(0, 2))
  const priceText = formatPrice(price)
  return [
    `<p><strong>Kết luận nhanh:</strong> ${product.name} ${product.summaryLine}.</p>`,
    `<p>Giá tham khảo hiện tại quanh <strong>${priceText}</strong>. ${product.audienceLine} ${product.workflowLine}</p>`,
    articleLinks
      ? `<p>${product.recommendationLine} Trước khi chốt mua, bạn nên đối chiếu thêm với ${articleLinks}. ${product.cautionLine}</p>`
      : `<p>${product.recommendationLine} ${product.cautionLine}</p>`,
  ].join("")
}

export function buildWhyRecommend(product) {
  return [
    `<p>${product.recommendationLine}</p>`,
    `<p>${product.pairingLine} ${product.cautionLine}</p>`,
  ].join("")
}

export function buildPriceNote(product) {
  if (product.type === "monitor") {
    return "Giá tham khảo, cần kiểm tra kỹ listing đang bán theo từng chiếc hay theo cặp và mức voucher theo thời điểm."
  }
  if (product.type === "recording-accessory") {
    return "Giá tham khảo, có thể thay đổi theo combo phụ kiện, chất liệu và shop bán cụ thể."
  }
  return "Giá tham khảo, có thể thay đổi theo shop, voucher và thời điểm cập nhật."
}

export function buildSeoTitle(product) {
  return `${product.name} cho Home Studio | Gia tham khao va review nhanh`
}

export function buildSeoDescription(product) {
  return `${product.name} co dang mua cho home studio khong? Xem gia tham khao, diem manh, luu y khi mua va bai viet lien quan tu Tachy.`
}

export function buildFaq(product) {
  const articleLinks = joinArticleLinks(product.relatedArticles.slice(0, 2))
  if (product.type === "audio-interface") {
    return [
      {
        question: `${product.name} hợp với ai nhất?`,
        answer: `${product.audienceLine} ${product.workflowLine}`,
      },
      {
        question: `${product.name} có đáng mua để dùng lâu dài không?`,
        answer: `${product.recommendationLine} ${product.cautionLine}`,
      },
      {
        question: `Nên đọc gì trước khi chốt ${product.name}?`,
        answer: articleLinks
          ? `Bạn nên xem ${articleLinks} để đặt ${product.name} vào đúng bài toán workflow, ngân sách và nâng cấp lâu dài.`
          : `${product.name} hợp nhất khi bạn đối chiếu nó theo đúng workflow thu, monitor và mix của mình.`,
      },
    ]
  }

  if (["condenser-mic", "hybrid-mic"].includes(product.type)) {
    return [
      {
        question: `${product.name} hợp với kiểu giọng và kiểu phòng nào?`,
        answer: `${product.audienceLine} ${product.workflowLine}`,
      },
      {
        question: `Phòng chưa xử lý âm có nên mua ${product.name} không?`,
        answer: product.cautionLine,
      },
      {
        question: `Nên ghép ${product.name} với gear nào cho hợp lý?`,
        answer: product.pairingLine,
      },
    ]
  }

  if (["closed-headphone", "open-headphone"].includes(product.type)) {
    return [
      {
        question: `${product.name} hợp tracking hay mix hơn?`,
        answer: `${product.workflowLine} ${product.audienceLine}`,
      },
      {
        question: `Điều cần lưu ý trước khi mua ${product.name} là gì?`,
        answer: product.cautionLine,
      },
      {
        question: `Nên đọc bài nào trước khi chốt ${product.name}?`,
        answer: articleLinks
          ? `Bạn nên xem ${articleLinks} để biết ${product.name} đứng ở đâu so với các lựa chọn còn lại trong cùng tầm nhu cầu.`
          : `${product.name} nên được chọn theo đúng vai trò tracking, edit hay mix trong workflow của bạn.`,
      },
    ]
  }

  if (product.type === "monitor") {
    return [
      {
        question: `${product.name} hợp với kiểu phòng nào?`,
        answer: `${product.audienceLine} ${product.workflowLine}`,
      },
      {
        question: `Cần lưu ý gì về placement và giá của ${product.name}?`,
        answer: `${product.cautionLine} ${product.pairingLine}`,
      },
      {
        question: `Nên đọc bài nào trước khi mua ${product.name}?`,
        answer: articleLinks
          ? `Bạn nên xem ${articleLinks} để chọn đúng kích thước, tính cách loa và mức kiểm soát low-end phù hợp với phòng của mình.`
          : `${product.name} nên được chọn sau khi bạn hiểu rõ phòng, khoảng cách nghe và vị trí đặt loa hiện tại.`,
      },
    ]
  }

  if (["midi-mini", "midi-49"].includes(product.type)) {
    return [
      {
        question: `${product.name} hợp với ai nhất?`,
        answer: `${product.audienceLine} ${product.workflowLine}`,
      },
      {
        question: `Điều cần lưu ý trước khi mua ${product.name} là gì?`,
        answer: product.cautionLine,
      },
      {
        question: `Nên đọc gì để chọn đúng controller như ${product.name}?`,
        answer: articleLinks
          ? `Bạn nên xem ${articleLinks} để đối chiếu đúng DAW, số phím và kiểu workflow sáng tác của mình.`
          : `${product.name} nên được chọn theo DAW chính, không gian bàn làm việc và cách bạn viết nhạc mỗi ngày.`,
      },
    ]
  }

  if (["booster", "reflection-filter", "monitor-accessory", "recording-accessory"].includes(product.type)) {
    return [
      {
        question: `${product.name} có phải món nên mua ngay không?`,
        answer: `${product.recommendationLine} ${product.cautionLine}`,
      },
      {
        question: `${product.name} giải quyết vấn đề gì rõ nhất trong home studio?`,
        answer: `${product.workflowLine} ${product.pairingLine}`,
      },
      {
        question: `Nên đọc bài nào trước khi chốt ${product.name}?`,
        answer: articleLinks
          ? `Bạn nên xem ${articleLinks} để biết món phụ kiện này giải quyết đúng nút thắt nào và khi nào nên ưu tiên mua.`
          : `${product.name} chỉ đáng tiền khi nó xử lý đúng vấn đề mà setup hiện tại của bạn đang gặp.`,
      },
    ]
  }

  if (product.type === "ssd") {
    return [
      {
        question: `${product.name} có hợp để lưu sample và project âm nhạc không?`,
        answer: `${product.workflowLine} ${product.audienceLine}`,
      },
      {
        question: `Điều cần lưu ý trước khi mua ${product.name} là gì?`,
        answer: product.cautionLine,
      },
      {
        question: `Nên đọc gì để chọn SSD ngoài cho producer?`,
        answer: articleLinks
          ? `Bạn nên xem ${articleLinks} để đối chiếu ${product.name} với nhu cầu backup, di chuyển project và dung lượng sample của mình.`
          : `${product.name} nên được chọn theo vai trò lưu project, sample hay backup mà bạn cần nhiều nhất.`,
      },
    ]
  }

  return []
}
