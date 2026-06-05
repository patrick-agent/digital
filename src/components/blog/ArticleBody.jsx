import { createElement } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import sanitizeHtml from "sanitize-html"
import { getArticleHeadings, getArticleRenderMode, getArticleSource } from "@/lib/article-content"
import styles from "./ArticleBody.module.css"

const htmlSanitizeOptions = {
  allowedTags: [
    ...new Set([
      ...sanitizeHtml.defaults.allowedTags,
      "img",
      "figure",
      "figcaption",
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "th",
      "td",
      "del",
    ]),
  ],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    "*": ["id", "title"],
    a: ["href", "name", "target", "rel", "title"],
    img: ["src", "srcset", "alt", "title", "width", "height", "loading", "decoding"],
    code: ["class"],
    pre: ["class"],
    th: ["colspan", "rowspan", "align"],
    td: ["colspan", "rowspan", "align"],
  },
  allowedClasses: {
    code: [/^language-[\w-]+$/],
    pre: [/^language-[\w-]+$/],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: {
    img: ["http", "https", "data"],
  },
  allowProtocolRelative: false,
  transformTags: {
    a: (tagName, attribs) => {
      if (!attribs.href) return { tagName, attribs }

      const isExternal = /^https?:\/\//i.test(attribs.href)
      return {
        tagName,
        attribs: isExternal
          ? { ...attribs, rel: attribs.rel || "noopener noreferrer" }
          : attribs,
      }
    },
  },
}

const markdownSanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...new Set([
      ...(defaultSchema.tagNames || []),
      "img",
      "figure",
      "figcaption",
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "th",
      "td",
      "del",
    ]),
  ],
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a || []), "target", "rel", "title"],
    code: [...(defaultSchema.attributes?.code || []), ["className", /^language-[\w-]+$/]],
    h1: [...(defaultSchema.attributes?.h1 || []), "id"],
    h2: [...(defaultSchema.attributes?.h2 || []), "id"],
    h3: [...(defaultSchema.attributes?.h3 || []), "id"],
    img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
    th: [...(defaultSchema.attributes?.th || []), "align"],
    td: [...(defaultSchema.attributes?.td || []), "align"],
  },
}

function injectHeadingIds(html, headings) {
  let headingIndex = 0

  return html.replace(/<h([1-3])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, text) => {
    const heading = headings[headingIndex]
    headingIndex += 1
    if (!heading) return match

    const attrsWithoutId = attrs.replace(/\sid=(['"])(.*?)\1/i, "")
    return `<h${level}${attrsWithoutId} id="${heading.id}">${text}</h${level}>`
  })
}

function withAttribute(attrs, name, value) {
  const attrRegex = new RegExp(`\\s${name}=`, "i")
  return attrRegex.test(attrs) ? attrs : `${attrs} ${name}="${value}"`
}

function enhanceImages(html) {
  return html.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
    const selfClosing = /\/\s*$/.test(attrs)
    let nextAttrs = attrs.replace(/\/\s*$/, "").trimEnd()
    nextAttrs = withAttribute(nextAttrs, "alt", "")
    nextAttrs = withAttribute(nextAttrs, "loading", "lazy")
    nextAttrs = withAttribute(nextAttrs, "decoding", "async")

    return `<img${nextAttrs}${selfClosing ? " />" : ">"}`
  })
}

function wrapTables(html) {
  return html.replace(/<table\b[\s\S]*?<\/table>/gi, (match, offset, input) => {
    const before = input.slice(Math.max(0, offset - 120), offset)
    if (/class=(['"])[^'"]*articleTableScroll[^'"]*\1/i.test(before)) return match
    return `<div class="articleTableScroll">${match}</div>`
  })
}

function mergeAdjacentLists(html) {
  let output = html
  let previous = ""

  while (output !== previous) {
    previous = output
    output = output.replace(
      /<(ol|ul)([^>]*)>([\s\S]*?)<\/\1>\s*<\1([^>]*)>([\s\S]*?)<\/\1>/gi,
      (match, tag, firstAttrs, firstInner, secondAttrs, secondInner) => {
        const attrs = firstAttrs || secondAttrs || ""
        return `<${tag}${attrs}>${firstInner}${secondInner}</${tag}>`
      }
    )
  }

  return output
}

function splitInlineLabels(html) {
  return html.replace(/\s-\s(<strong>[^<]+<\/strong>)/g, "<br>$1")
}

function sanitizeArticleHtml(content) {
  const sanitized = sanitizeHtml(content, htmlSanitizeOptions)
  return wrapTables(enhanceImages(splitInlineLabels(mergeAdjacentLists(sanitized))))
}

function renderTable({ node: _node, ...props }) {
  void _node
  return (
    <div className="articleTableScroll">
      <table {...props} />
    </div>
  )
}

export default function ArticleBody({ content }) {
  const source = getArticleSource(content)
  const headings = getArticleHeadings(content)
  const renderMode = getArticleRenderMode(content)

  if (!source) return null

  if (renderMode === "html") {
    const processed = injectHeadingIds(sanitizeArticleHtml(source), headings)

    return (
      <div
        className={styles.body}
        dangerouslySetInnerHTML={{ __html: processed }}
      />
    )
  }

  let headingIndex = 0

  const nextHeadingId = () => {
    const heading = headings[headingIndex]
    headingIndex += 1
    return heading?.id
  }

  const createHeading = (tag) => ({ node: _node, children, ...props }) => {
    void _node
    const id = nextHeadingId()
    return createElement(tag, id ? { ...props, id } : props, children)
  }

  return (
    <div className={styles.body}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, markdownSanitizeSchema],
        ]}
        components={{
          h1: createHeading("h1"),
          h2: createHeading("h2"),
          h3: createHeading("h3"),
          table: renderTable,
          img: ({ node: _node, alt = "", ...props }) => {
            void _node
            return <img alt={alt} loading="lazy" decoding="async" {...props} />
          },
          a: ({ node: _node, href = "", rel, ...props }) => {
            void _node
            const isExternal = /^https?:\/\//i.test(href)
            return (
              <a
                href={href}
                rel={isExternal ? rel || "noopener noreferrer" : rel}
                {...props}
              />
            )
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}

export function ArticleSummary({ excerpt }) {
  if (!excerpt) return null
  return (
    <section aria-label="Article summary" className={styles.summary}>
      <span className={styles.summaryLabel}>Quick Read</span>
      <p className={styles.summaryText}>{excerpt}</p>
    </section>
  )
}
