import { Loader2 } from 'lucide-react'

export default function LoadingSpinner() {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-muted-foreground"
      role="status"
      aria-label="Loading"
    >
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="text-sm">Loading weather data…</p>
    </div>
  )
}