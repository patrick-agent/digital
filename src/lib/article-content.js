function stripTags(value) {
  return value.replace(/<[^>]*>/g, "")
}

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
}

function slugifyHeading(text) {
  const normalized = decodeHtml(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")

  return normalized || "section"
}

function uniqueId(baseId, seen) {
  const count = seen.get(baseId) || 0
  seen.set(baseId, count + 1)
  return count === 0 ? baseId : `${baseId}-${count + 1}`
}

export function getArticleHeadings(html) {
  if (!html) return []

  const headings = []
  const seen = new Map()
  const regex = /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi
  let match

  while ((match = regex.exec(html)) !== null) {
    const [, level, attrs, rawText] = match
    const text = decodeHtml(stripTags(rawText)).trim()
    if (!text) continue

    const idMatch = attrs.match(/\sid=(['"])(.*?)\1/i)
    const baseId = idMatch?.[2] || slugifyHeading(text)

    headings.push({
      level: Number(level),
      id: uniqueId(baseId, seen),
      text,
    })
  }

  return headings
}

function withAttribute(attrs, name, value) {
  const attrRegex = new RegExp(`\\s${name}=`, "i")
  return attrRegex.test(attrs) ? attrs : `${attrs} ${name}="${value}"`
}

function enhanceImages(html) {
  return html.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
    const selfClosing = /\/\s*$/.test(attrs)
    let nextAttrs = attrs.replace(/\/\s*$/, "").trimEnd()
    nextAttrs = withAttribute(nextAttrs, "loading", "lazy")
    nextAttrs = withAttribute(nextAttrs, "decoding", "async")
    nextAttrs = withAttribute(nextAttrs, "alt", "")
    return `<img${nextAttrs}${selfClosing ? " />" : ">"}`
  })
}

export function enhanceArticleContent(html) {
  if (!html) return ""

  const headings = getArticleHeadings(html)
  let headingIndex = 0
  const withHeadingIds = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, level, attrs, text) => {
      const cleanText = decodeHtml(stripTags(text)).trim()
      if (!cleanText) return match

      const heading = headings[headingIndex]
      headingIndex += 1
      if (!heading) return match

      const attrsWithoutId = attrs.replace(/\sid=(['"])(.*?)\1/i, "")
      return `<h${level}${attrsWithoutId} id="${heading.id}">${text}</h${level}>`
    }
  )

  return enhanceImages(withHeadingIds)
}
