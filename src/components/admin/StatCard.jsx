import Link from "next/link"
import { cn } from "@/lib/utils"

const iconStyles = {
  purple: "bg-accent-purple/10 text-accent-purple",
  cyan: "bg-accent-cyan/10 text-accent-cyan",
  pink: "bg-accent-pink/10 text-accent-pink",
  orange: "bg-orange-100 text-orange-600",
  blue: "bg-blue-100 text-blue-600",
}

export default function StatCard({ icon: Icon, label, value, sub, color = "purple", href, className }) {
  const content = (
    <div className={cn("admin-stat-card", className)}>
      <div className={cn("stat-icon", iconStyles[color] || iconStyles.purple)}>
        <Icon size={22} />
      </div>
      <div className="stat-number">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-desc">{sub}</div>}
    </div>
  )

  if (href) return <Link href={href}>{content}</Link>
  return content
}
