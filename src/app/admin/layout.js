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
            background: "#ffffff",
            border: "1px solid #e4e9f2",
            color: "#192038",
            boxShadow: "0 0.5rem 1rem rgba(44, 51, 73, 0.12)",
          },
        }}
      />
    </>
  )
}
