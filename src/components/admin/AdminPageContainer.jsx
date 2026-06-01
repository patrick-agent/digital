import { cn } from "@/lib/utils"

export default function AdminPageContainer({ children, className }) {
  return (
    <div className={cn("admin-page-container", className)}>
      {children}
    </div>
  )
}
