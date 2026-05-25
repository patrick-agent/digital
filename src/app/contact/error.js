'use client'

import ErrorBoundary from "@/components/ui/ErrorBoundary"

export default function ContactError({ error, reset }) {
  return <ErrorBoundary error={error} reset={reset} title="Couldn't load contact page" />
}
