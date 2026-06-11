'use client'

import ErrorBoundary from "@/components/ui/ErrorBoundary"

export default function ShopError({ error, reset }) {
  return <ErrorBoundary error={error} reset={reset} title="Không thể tải shop" />
}
