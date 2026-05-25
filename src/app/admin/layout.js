import "./globals.css"
import { Toaster } from "sonner"

export const metadata = {
  title: "Admin — Studio 3D",
  robots: "noindex, nofollow",
}

export default function AdminRootLayout({ children }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: "#1a1a2e",
            border: "1px solid rgba(168, 85, 247, 0.2)",
            color: "#fff",
          },
        }}
      />
    </>
  )
}
