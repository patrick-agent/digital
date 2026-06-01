import Link from "next/link"

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="admin-empty-state">
      {Icon && (
        <div className="empty-icon">
          <Icon />
        </div>
      )}
      <div className="empty-title">{title}</div>
      {description && <div className="empty-desc">{description}</div>}
      {action && (
        <div className="empty-action">
          <Link
            href={action.href}
            className="admin-empty-btn inline-flex items-center gap-1.5 rounded-lg bg-accent-purple text-xs font-bold text-white transition-colors hover:bg-accent-purple/90"
          >
            + {action.label}
          </Link>
        </div>
      )}
    </div>
  )
}
