import { readPressKit } from "@/lib/db"
import PressKitForm from "@/components/admin/PressKitForm"

export const dynamic = "force-dynamic"

export default async function PressKitPage() {
  const data = await readPressKit()
  return <PressKitForm data={data} />
}
