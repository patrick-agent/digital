import { readSettings } from "@/lib/db"
import SettingsForm from "./SettingsForm"

export const dynamic = "force-dynamic"

export default async function AdminSettingsPage() {
  const settings = await readSettings()

  return (
    <div>
      <div className="mb-6" style={{ margin: 12 }}>
        <h1 className="text-2xl font-bold text-text-primary" style={{ color: "var(--color-text-primary)" , fontSize: "1.5rem" }}>
          Settings
        </h1>
        <p className="text-text-muted text-sm mt-1" style={{ color: "var(--color-text-muted)" , fontSize: "0.875rem" }}>
          Configure global site settings and SEO defaults
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  )
}
