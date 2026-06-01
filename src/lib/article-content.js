function stripTags(value) {
  return value.replace(/<[^>]*>/g, "")
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;")
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

function parseArticleFrontmatter(value) {
  const source = String(value || "").replace(/^\uFEFF/, "")
  if (!source.startsWith("---")) return { content: source, data: {} }

  const lines = source.split(/\r?\n/)
  if (lines[0].trim() !== "---") return { content: source, data: {} }

  const data = {}
  let endIndex = -1

  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === "---") {
      endIndex = i
      break
    }

    const match = lines[i].match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (match) {
      const [, key, rawValue] = match
      data[key] = rawValue.replace(/^['"]|['"]$/g, "")
    }
  }

  if (endIndex === -1) return { content: source, data: {} }

  return { content: lines.slice(endIndex + 1).join("\n").trimStart(), data }
}

function looksLikeHtml(value) {
  return /<\/?(?:h[1-6]|p|ul|ol|li|blockquote|pre|code|table|thead|tbody|tr|td|th|img|figure|figcaption|div|section|br|hr)\b/i.test(value)
}

function looksLikeMarkdown(value) {
  return Boolean(
    /(^|\n)\s{0,3}#{1,6}\s+/.test(value) ||
    /(^|\n)\s*\|?.+\|.+\n\s*\|?\s*:?-{3,}:?\s*\|/.test(value) ||
    /(^|\n)\s*(```|~~~)/.test(value) ||
    /(^|\n)\s*(?:[-*+]\s+|\d+\.\s+|>\s+)/.test(value) ||
    /!?\[[^\]]+\]\([^\)]+\)/.test(value)
  )
}

function sanitizeUrl(value) {
  const url = String(value || "").trim()
  return /^javascript:/i.test(url) ? "#" : url
}

function parseInlineMarkdown(value) {
  const codeTokens = []
  let output = String(value || "").replace(/`([^`\n]+)`/g, (_, code) => {
    const token = `@@ARTICLE_CODE_${codeTokens.length}@@`
    codeTokens.push(`<code>${escapeHtml(code)}</code>`)
    return token
  })

  output = escapeHtml(output)

  output = output.replace(
    /!\[([^\]]*)\]\(([^\s)]+)(?:\s+&quot;([^&]*)&quot;)?\)/g,
    (_, alt, src, title) => {
      const safeSrc = escapeAttribute(sanitizeUrl(src))
      const safeAlt = escapeAttribute(alt)
      const titleAttr = title ? ` title="${escapeAttribute(title)}"` : ""
      return `<img src="${safeSrc}" alt="${safeAlt}"${titleAttr}>`
    }
  )

  output = output.replace(
    /\[([^\]]+)\]\(([^\s)]+)(?:\s+&quot;([^&]*)&quot;)?\)/g,
    (_, text, href, title) => {
      const safeHref = escapeAttribute(sanitizeUrl(href))
      const titleAttr = title ? ` title="${escapeAttribute(title)}"` : ""
      return `<a href="${safeHref}"${titleAttr}>${text}</a>`
    }
  )

  output = output
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<em>$2</em>")
    .replace(/(^|[\s(])_([^_\n]+)_/g, "$1<em>$2</em>")

  codeTokens.forEach((html, index) => {
    output = output.replace(`@@ARTICLE_CODE_${index}@@`, html)
  })

  return output
}

function isTableDelimiter(value) {
  const cells = value.trim().replace(/^\|/, "").replace(/\|$/, "").split("|")
  return cells.length > 0 && cells.every((cell) => /^\s*:?-{3,}:?\s*$/.test(cell))
}

function isTableStart(lines, index) {
  return Boolean(
    lines[index]?.includes("|") &&
    lines[index + 1]?.includes("|") &&
    isTableDelimiter(lines[index + 1])
  )
}

function splitTableRow(value) {
  return value.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim())
}

function tableAlignment(delimiter) {
  const trimmed = delimiter.trim()
  if (trimmed.startsWith(":") && trimmed.endsWith(":")) return "center"
  if (trimmed.endsWith(":")) return "right"
  return "left"
}

function renderTable(lines, startIndex) {
  const headers = splitTableRow(lines[startIndex])
  const alignments = splitTableRow(lines[startIndex + 1]).map(tableAlignment)
  const rows = []
  let index = startIndex + 2

  while (index < lines.length && lines[index].trim() && lines[index].includes("|")) {
    rows.push(splitTableRow(lines[index]))
    index += 1
  }

  const head = headers.map((cell, cellIndex) => {
    const align = alignments[cellIndex] || "left"
    return `<th style="text-align: ${align}">${parseInlineMarkdown(cell)}</th>`
  }).join("")

  const body = rows.map((row) => {
    const cells = headers.map((_, cellIndex) => {
      const align = alignments[cellIndex] || "left"
      return `<td style="text-align: ${align}">${parseInlineMarkdown(row[cellIndex] || "")}</td>`
    }).join("")
    return `<tr>${cells}</tr>`
  }).join("")

  return {
    html: `<div class="articleTableScroll"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`,
    nextIndex: index,
  }
}

function isListItem(value) {
  return /^\s*(?:[-*+]\s+|\d+\.\s+)/.test(value)
}

function renderList(lines, startIndex) {
  const ordered = /^\s*\d+\.\s+/.test(lines[startIndex])
  const tag = ordered ? "ol" : "ul"
  const items = []
  let index = startIndex

  while (index < lines.length) {
    const line = lines[index]
    const match = ordered
      ? line.match(/^\s*\d+\.\s+(.+)$/)
      : line.match(/^\s*[-*+]\s+(.+)$/)

    if (!match) break
    items.push(`<li>${parseInlineMarkdown(match[1].trim())}</li>`)
    index += 1
  }

  return { html: `<${tag}>${items.join("")}</${tag}>`, nextIndex: index }
}

function isBlockStart(lines, index) {
  const line = lines[index] || ""
  const trimmed = line.trim()
  return Boolean(
    !trimmed ||
    /^(```|~~~)/.test(trimmed) ||
    /^#{1,6}\s+/.test(trimmed) ||
    /^>\s?/.test(trimmed) ||
    /^-{3,}$/.test(trimmed) ||
    isListItem(line) ||
    isTableStart(lines, index) ||
    /^<\/?[A-Za-z][^>]*>/.test(trimmed)
  )
}

function markdownToHtml(markdown) {
  const lines = String(markdown || "").replace(/\r\n?/g, "\n").split("\n")
  const blocks = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    const trimmed = line.trim()

    if (!trimmed) {
      index += 1
      continue
    }

    const fence = trimmed.match(/^(```|~~~)\s*([A-Za-z0-9_-]+)?\s*$/)
    if (fence) {
      const closing = fence[1]
      const language = fence[2]
      const code = []
      index += 1

      while (index < lines.length && lines[index].trim() !== closing) {
        code.push(lines[index])
        index += 1
      }

      if (index < lines.length) index += 1
      const className = language ? ` class="language-${escapeAttribute(language)}"` : ""
      blocks.push(`<pre><code${className}>${escapeHtml(code.join("\n"))}</code></pre>`)
      continue
    }

    if (isTableStart(lines, index)) {
      const table = renderTable(lines, index)
      blocks.push(table.html)
      index = table.nextIndex
      continue
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.+?)\s*#*$/)
    if (heading) {
      const level = heading[1].length
      blocks.push(`<h${level}>${parseInlineMarkdown(heading[2].trim())}</h${level}>`)
      index += 1
      continue
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines = []
      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""))
        index += 1
      }
      blocks.push(`<blockquote>${markdownToHtml(quoteLines.join("\n"))}</blockquote>`)
      continue
    }

    if (/^-{3,}$/.test(trimmed)) {
      blocks.push("<hr>")
      index += 1
      continue
    }

    if (isListItem(line)) {
      const list = renderList(lines, index)
      blocks.push(list.html)
      index = list.nextIndex
      continue
    }

    if (/^<\/?[A-Za-z][^>]*>/.test(trimmed)) {
      const htmlLines = []
      while (index < lines.length && lines[index].trim()) {
        htmlLines.push(lines[index])
        index += 1
      }
      blocks.push(htmlLines.join("\n"))
      continue
    }

    const paragraph = []
    while (index < lines.length && !isBlockStart(lines, index)) {
      paragraph.push(lines[index].trim())
      index += 1
    }

    blocks.push(`<p>${parseInlineMarkdown(paragraph.join(" "))}</p>`)
  }

  return blocks.join("\n")
}

function normalizeArticleContent(content) {
  const parsed = parseArticleFrontmatter(content)
  const body = parsed.content.trim()
  if (!body) return ""
  return looksLikeHtml(body) && !looksLikeMarkdown(body) ? body : markdownToHtml(body)
}

function uniqueId(baseId, seen) {
  const count = seen.get(baseId) || 0
  seen.set(baseId, count + 1)
  return count === 0 ? baseId : `${baseId}-${count + 1}`
}

function extractArticleHeadings(html) {
  if (!html) return []

  const headings = []
  const seen = new Map()
  const regex = /<h([1-3])([^>]*)>([\s\S]*?)<\/h\1>/gi
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

export function getArticleHeadings(content) {
  return extractArticleHeadings(normalizeArticleContent(content))
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

function enhanceTables(html) {
  return html.replace(/<table\b[\s\S]*?<\/table>/gi, (match, offset, input) => {
    const before = input.slice(Math.max(0, offset - 120), offset)
    if (/class=(['"])[^'"]*articleTableScroll[^'"]*\1/i.test(before)) return match
    return `<div class="articleTableScroll">${match}</div>`
  })
}

export function enhanceArticleContent(content) {
  if (!content) return ""

  const html = normalizeArticleContent(content)
  const headings = extractArticleHeadings(html)
  let headingIndex = 0
  const withHeadingIds = html.replace(
    /<h([1-3])([^>]*)>([\s\S]*?)<\/h\1>/gi,
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

  return enhanceTables(enhanceImages(withHeadingIds))
}
