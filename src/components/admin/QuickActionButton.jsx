import Link from "next/link"

export default function QuickActionButton({ icon: Icon, label, href, variant = "default" }) {
  if (variant === "primary") {
    return (
      <Link
        href={href}
        className="admin-btn-primary"
      >
        <Icon size={16} />
        {label}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className="admin-btn-secondary"
    >
      <Icon size={16} />
      {label}
    </Link>
  )
}
