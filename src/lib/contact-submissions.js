import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { put } from "@vercel/blob"
import { slugify } from "./db/slug.js"

function createSubmissionRecord(input) {
  return {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    name: String(input.name || "").trim(),
    email: String(input.email || "").trim(),
    subject: String(input.subject || "").trim(),
    message: String(input.message || "").trim(),
    persona: String(input.persona || "general").trim(),
  }
}

function buildSubmissionFilename(record) {
  const timestamp = record.submittedAt.replace(/[:.]/g, "-")
  const hint = slugify(`${record.name || record.email || "contact"}`, "contact")
  return `${timestamp}-${hint}-${record.id}.json`
}

export async function persistContactSubmission(input) {
  const record = createSubmissionRecord(input)
  const filename = buildSubmissionFilename(record)
  const json = JSON.stringify(record, null, 2)

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put(`private/contact-submissions/${filename}`, json, {
      access: "private",
      addRandomSuffix: false,
      contentType: "application/json",
    })
  } else {
    if (process.env.VERCEL === "1") {
      throw new Error("Set BLOB_READ_WRITE_TOKEN to persist contact submissions on Vercel")
    }

    const directory = path.join(process.cwd(), ".private", "contact-submissions")
    await mkdir(directory, { recursive: true })
    await writeFile(path.join(directory, filename), json, "utf-8")
  }

  return {
    id: record.id,
    submittedAt: record.submittedAt,
  }
}
