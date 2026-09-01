import { Progress } from '@/components/ui/progress'

function comfortColor(score) {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-lime-500'
  if (score >= 40) return 'bg-yellow-500'
  if (score >= 20) return 'bg-orange-500'
  return 'bg-red-500'
}

export default function ComfortBar({ score }) {
  const safeScore = Math.max(0, Math.min(100, score))
  return (
    <div
      role="img"
      aria-label={`Comfort score ${safeScore} out of 100`}
    >
      <Progress value={safeScore} className="h-2" indicatorClassName={comfortColor(safeScore)} />
    </div>
  )
}