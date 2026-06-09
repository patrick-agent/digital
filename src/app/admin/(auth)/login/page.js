"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const formInsetStyle = {
    width: "calc(100% - 48px)",
    marginLeft: 24,
    marginRight: 24,
  }

  const buttonInsetStyle = {
    width: "65%",
    marginLeft: "auto",
    marginRight: "auto",
  }

  // Quick typography overrides for the login page.
  const loginTextStyles = {
    title: {
      color: "var(--color-text-primary)",
      fontSize: "1.5rem",
    },
    label: {
      color: "var(--color-text-secondary)",
      fontSize: "0.875rem",
    },
    input: {
      color: "var(--color-text-primary)",
      fontSize: "0.95rem",
    },
    button: {
      color: "#ffffff",
      fontSize: "0.95rem",
      backgroundColor: "#2563eb",
      marginBottom: 10,
      marginTop: 10,
      borderRadius: "0.5rem",
    },
    error: {
      fontSize: "0.875rem",
      textAlign: "center",
    },
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid email or password")
      setLoading(false)
      return
    }

    router.push("/admin/dashboard")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-deep-bg px-4 py-8">
      <div className="w-full max-w-md rounded-xl border border-border bg-admin-card px-10 py-10 shadow-sm sm:px-12 sm:py-12">
        <div className="text-center" style={{ marginTop: 24, marginBottom: 10 }}>
          <h1 className="text-2xl font-extrabold text-text-primary" style={loginTextStyles.title}>Admin Login</h1>
          <div style={{ marginTop: 16, borderTop: "1px solid var(--color-border)" }} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div style={formInsetStyle}>
            <label className="mb-1 block text-sm font-medium text-text-secondary" style={loginTextStyles.label}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-lg border border-border bg-admin-bg px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
              style={loginTextStyles.input}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div style={formInsetStyle}>
            <label className="mb-1 block text-sm font-medium text-text-secondary" style={loginTextStyles.label}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full rounded-lg border border-border bg-admin-bg px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
              style={loginTextStyles.input}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p
              className="rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-400"
              style={{
                ...formInsetStyle,
                ...loginTextStyles.error,
              }}
            >
              {error}
            </p>
          )}

          <div style={buttonInsetStyle}>
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-lg px-4 py-3 font-medium transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={loginTextStyles.button}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
