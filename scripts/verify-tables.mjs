import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const filePath = join(__dirname, "..", "db", "blog.json")
const data = JSON.parse(readFileSync(filePath, "utf8"))

let count = 0
for (const post of data) {
  if (post.content && post.content.includes('<div class="articleTableScroll">')) {
    count++
    console.log("OK: " + post.slug)
    const start = post.content.indexOf('<div class="articleTableScroll">')
    const snippet = post.content.slice(start, start + 250)
    console.log(snippet)
    console.log("")
  }
}

// Also check for remaining raw markdown tables
let remainingRaw = 0
for (const post of data) {
  if (post.content && (post.content.includes("|---") || post.content.includes("| :---"))) {
    remainingRaw++
    console.log("REMAINING RAW TABLE in: " + post.slug)
  }
}

console.log("Posts with tables: " + count)
console.log("Posts with remaining raw tables: " + remainingRaw)
