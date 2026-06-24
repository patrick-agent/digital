import { readdir, readFile } from "fs/promises"
import path from "path"

const dbDir = path.join(process.cwd(), "db")

async function main() {
  const entries = await readdir(dbDir, { withFileTypes: true })
  const jsonFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort()

  const failures = []

  for (const filename of jsonFiles) {
    const filePath = path.join(dbDir, filename)
    const raw = await readFile(filePath, "utf-8")

    if (!raw.trim()) {
      failures.push(`${filename}: blank file`)
      continue
    }

    try {
      JSON.parse(raw)
    } catch (error) {
      failures.push(`${filename}: ${error.message}`)
    }
  }

  if (failures.length > 0) {
    console.error("Invalid DB JSON detected:")
    for (const failure of failures) {
      console.error(`- ${failure}`)
    }
    process.exit(1)
  }

  console.log(`Validated ${jsonFiles.length} JSON file(s) in db/`)
}

main().catch((error) => {
  console.error("Failed to validate db JSON:", error)
  process.exit(1)
})
