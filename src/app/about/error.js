'use client'

import ErrorBoundary from "@/components/ui/ErrorBoundary"

export default function AboutError({ error, reset }) {
  return <ErrorBoundary error={error} reset={reset} title="Couldn't load about page" />
}
