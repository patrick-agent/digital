import sanitizeHtml from "sanitize-html"

const shopRichTextSanitizeOptions = {
  allowedTags: [
    ...new Set([
      ...sanitizeHtml.defaults.allowedTags,
      "img",
      "figure",
      "figcaption",
      "h2",
      "h3",
      "h4",
      "pre",
    ]),
  ],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    "*": ["id", "title"],
    a: ["href", "name", "target", "rel", "title"],
    img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
    code: ["class"],
    pre: ["class"],
  },
  allowedClasses: {
    code: [/^language-[\w-]+$/],
    pre: [/^language-[\w-]+$/],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: {
    img: ["http", "https"],
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
    img: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        alt: attribs.alt || "",
        loading: attribs.loading || "lazy",
        decoding: attribs.decoding || "async",
      },
    }),
  },
}

export function sanitizeShopRichText(html) {
  if (!html) return ""
  return sanitizeHtml(html, shopRichTextSanitizeOptions)
}

export function sanitizeShopFaqEntries(entries = []) {
  return entries.map((entry) => ({
    ...entry,
    answer: sanitizeShopRichText(entry.answer),
  }))
}
