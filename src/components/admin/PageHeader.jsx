import { cn } from "@/lib/utils"

export default function PageHeader({ title, subtitle, actions, className }) {
  return (
    <div className={cn("mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="min-w-0 flex-1">
        <h1 className="admin-h1">{title}</h1>
        {subtitle && <p className="admin-subtitle mt-1">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  )
}
