import { readSettings } from "@/lib/db"
import SettingsForm from "./SettingsForm"

export const dynamic = "force-dynamic"

export default async function AdminSettingsPage() {
  const settings = await readSettings()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-muted text-sm mt-1">
          Configure global site settings and SEO defaults
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  )
}
