import { cn } from "@/lib/utils"

export function AdminCard({ children, className, padding = true }) {
  return (
    <div className={cn("rounded-xl border border-border bg-white", padding && "p-5 sm:p-6", className)}>
      {children}
    </div>
  )
}

export function AdminCardHeader({ title, action, className }) {
  return (
    <div className={cn("flex items-center justify-between border-b border-border px-6 py-4", className)}>
      {title && <h3 className="text-sm font-bold text-text-primary">{title}</h3>}
      {action && <div className="text-xs font-semibold text-accent-purple">{action}</div>}
    </div>
  )
}
