import { readMusicItem } from "@/lib/db"
import MusicForm from "@/components/admin/MusicForm"

export const dynamic = "force-dynamic"

export default async function NewMusicPage() {
  return <MusicForm />
}
