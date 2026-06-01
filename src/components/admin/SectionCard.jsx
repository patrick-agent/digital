import Link from "next/link"
import { cn } from "@/lib/utils"

export default function SectionCard({ title, action, children, className, bodyClass }) {
  return (
    <section className={cn("admin-section-card", className)}>
      {(title || action) && (
        <div className="section-header">
          {title && <h3>{title}</h3>}
          {action && (
            <Link href={action.href} className="text-xs font-semibold text-accent-purple transition-colors hover:text-accent-purple/80">
              {action.label}
            </Link>
          )}
        </div>
      )}
      <div className={cn("section-body", bodyClass)}>
        {children}
      </div>
    </section>
  )
}
