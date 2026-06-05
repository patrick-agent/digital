import { google } from "googleapis"

const INDEXING_SCOPE = "https://www.googleapis.com/auth/indexing"

function getOAuthAuth() {
  const clientId = process.env.GOOGLE_INDEXING_OAUTH_CLIENT_ID || ""
  const clientSecret = process.env.GOOGLE_INDEXING_OAUTH_CLIENT_SECRET || ""
  const refreshToken = process.env.GOOGLE_INDEXING_OAUTH_REFRESH_TOKEN || ""

  if (!clientId || !clientSecret || !refreshToken) return null

  const auth = new google.auth.OAuth2(clientId, clientSecret)
  auth.setCredentials({ refresh_token: refreshToken })
  return { auth, method: "oauth" }
}

function getServiceAccountAuth() {
  const clientEmail = process.env.GOOGLE_INDEXING_CLIENT_EMAIL || ""
  const privateKey = (process.env.GOOGLE_INDEXING_PRIVATE_KEY || "").replace(/\\n/g, "\n")

  if (!clientEmail || !privateKey) return null

  return {
    auth: new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: [INDEXING_SCOPE],
    }),
    method: "service-account",
  }
}

function getAuth() {
  return getOAuthAuth() || getServiceAccountAuth()
}

function shouldSkipLocalIndexing() {
  return process.env.VERCEL !== "1" && process.env.GOOGLE_INDEXING_ALLOW_LOCAL !== "1"
}

export async function publishGoogleIndexingNotification(url, type = "URL_UPDATED") {
  if (!url) return { success: false, skipped: true, reason: "missing-url" }

  if (shouldSkipLocalIndexing()) {
    return { success: false, skipped: true, reason: "local-environment", url, type }
  }

  const authConfig = getAuth()
  if (!authConfig) {
    return { success: false, skipped: true, reason: "missing-credentials", url, type }
  }

  try {
    const indexing = google.indexing({ version: "v3", auth: authConfig.auth })
    await indexing.urlNotifications.publish({ requestBody: { url, type } })
    return { success: true, skipped: false, url, type, auth: authConfig.method }
  } catch (err) {
    const error = err?.response?.data?.error?.message || err.message || "Unknown error"
    return { success: false, skipped: false, url, type, error }
  }
}
