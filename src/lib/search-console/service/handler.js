import { google } from "googleapis"
import { URL } from "url"
import {
  SitemapSubmitInputSchema,
  SearchConsoleErrorCode,
  createSearchConsoleFailure,
  SubmitResultSchema,
} from "./spec.js"

const SITEMAP_SCOPE = "https://www.googleapis.com/auth/webmasters"

function getServiceAccountAuth() {
  const clientEmail = process.env.GOOGLE_INDEXING_CLIENT_EMAIL || ""
  const privateKey = (process.env.GOOGLE_INDEXING_PRIVATE_KEY || "").replace(/\\n/g, "\n")

  if (!clientEmail || !privateKey) return null

  return new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: [SITEMAP_SCOPE],
  })
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://tachy.io.vn"
}

function shouldSkipLocal() {
  return process.env.VERCEL !== "1" && process.env.GOOGLE_INDEXING_ALLOW_LOCAL !== "1"
}

export class SearchConsoleHandler {
  async submitSitemap(input = {}) {
    const parsed = SitemapSubmitInputSchema.safeParse(input)
    if (!parsed.success) {
      return SubmitResultSchema.parse(
        createSearchConsoleFailure(
          SearchConsoleErrorCode.INVALID_INPUT,
          "Invalid sitemap URL.",
          false
        )
      )
    }

    if (shouldSkipLocal()) {
      return SubmitResultSchema.parse(
        createSearchConsoleFailure(
          SearchConsoleErrorCode.API_ERROR,
          "Skipped in local environment.",
          true
        )
      )
    }

    const auth = getServiceAccountAuth()
    if (!auth) {
      return SubmitResultSchema.parse(
        createSearchConsoleFailure(
          SearchConsoleErrorCode.MISSING_CREDENTIALS,
          "No Google service account credentials configured.",
          true
        )
      )
    }

    try {
      const webmasters = google.webmasters({ version: "v3", auth })
      const sitemapUrl = parsed.data.sitemapUrl
      const parsedUrl = new URL(sitemapUrl)
      const site = `${parsedUrl.protocol}//${parsedUrl.hostname}`
      const feedpath = parsedUrl.pathname + parsedUrl.search

      await webmasters.sitemaps.submit({
        siteUrl: site,
        feedpath: feedpath,
      })

      return SubmitResultSchema.parse({
        success: true,
        data: {
          submitted: true,
          method: "search-console-api",
        },
      })
    } catch (error) {
      const message = error?.response?.data?.error?.message || error.message || "Unknown error"
      const code = message.includes("not a property owner")
        ? SearchConsoleErrorCode.NOT_OWNER
        : SearchConsoleErrorCode.API_ERROR
      return SubmitResultSchema.parse(
        createSearchConsoleFailure(code, message, true)
      )
    }
  }
}
