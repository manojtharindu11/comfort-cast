import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import ComfortBar from './ComfortBar'

export default function WeatherTable({ cities }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Weather</TableHead>
            <TableHead className="text-right">Temp</TableHead>
            <TableHead className="text-right">Humidity</TableHead>
            <TableHead className="text-right">Wind</TableHead>
            <TableHead className="text-right">Pressure</TableHead>
            <TableHead className="w-44">Comfort Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cities.map((city) => (
            <TableRow key={city.cityCode}>
              <TableCell>
                <Badge variant="secondary">#{city.rank}</Badge>
              </TableCell>
              <TableCell className="font-medium">{city.cityName}</TableCell>
              <TableCell className="text-muted-foreground capitalize">{city.description}</TableCell>
              <TableCell className="text-right tabular-nums">{city.tempC.toFixed(1)}°C</TableCell>
              <TableCell className="text-right tabular-nums">{city.humidity.toFixed(0)}%</TableCell>
              <TableCell className="text-right tabular-nums">{city.windMps.toFixed(1)} m/s</TableCell>
              <TableCell className="text-right tabular-nums">{city.pressure.toFixed(0)} hPa</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="w-6 text-right font-semibold tabular-nums">
                    {city.comfortIndex}
                  </span>
                  <ComfortBar score={city.comfortIndex} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}