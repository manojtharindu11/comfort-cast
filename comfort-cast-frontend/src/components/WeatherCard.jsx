import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ComfortBar from './ComfortBar'

function comfortLabel(score) {
  if (score >= 80) return 'Very comfortable'
  if (score >= 60) return 'Comfortable'
  if (score >= 40) return 'Acceptable'
  if (score >= 20) return 'Uncomfortable'
  return 'Very uncomfortable'
}

export default function WeatherCard({ city }) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <Badge variant="secondary">#{city.rank}</Badge>
          <div>
            <CardTitle>{city.cityName}</CardTitle>
            <p className="text-muted-foreground text-sm capitalize">{city.description}</p>
          </div>
        </div>
        <div className="text-right leading-tight">
          <div className="text-2xl font-bold tracking-tight">{city.comfortIndex}</div>
          <div className="text-muted-foreground text-xs">{comfortLabel(city.comfortIndex)}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ComfortBar score={city.comfortIndex} />
        <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/50 p-2 text-center">
          <div>
            <div className="text-muted-foreground text-[11px] uppercase tracking-wide">Temp</div>
            <div className="font-semibold tabular-nums">{city.tempC.toFixed(1)}°C</div>
          </div>
          <div>
            <div className="text-muted-foreground text-[11px] uppercase tracking-wide">Humidity</div>
            <div className="font-semibold tabular-nums">{city.humidity.toFixed(0)}%</div>
          </div>
          <div>
            <div className="text-muted-foreground text-[11px] uppercase tracking-wide">Wind</div>
            <div className="font-semibold tabular-nums">{city.windMps.toFixed(1)} m/s</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}