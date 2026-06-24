export function slugify(text, fallback = "item") {
  const slug = String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")

  return slug || fallback
}

export async function generateUniqueSlug(baseSlug, existingItems, currentId) {
  const initialSlug = slugify(baseSlug, "item")
  let slug = initialSlug
  let counter = 1
  while (
    existingItems.some(
      (item) => item.slug === slug && item.id !== currentId
    )
  ) {
    slug = `${initialSlug}-${counter}`
    counter++
  }
  return slug
}
