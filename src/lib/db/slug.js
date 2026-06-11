export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

export async function generateUniqueSlug(baseSlug, existingItems, currentId) {
  let slug = baseSlug
  let counter = 1
  while (
    existingItems.some(
      (item) => item.slug === slug && item.id !== currentId
    )
  ) {
    slug = `${baseSlug}-${counter}`
    counter++
  }
  return slug
}
