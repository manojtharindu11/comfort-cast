import { useState } from 'react'
import { Database, Info, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetCitiesQuery } from '../services/api/cityApi'
import {
  useGetRawCacheStatusQuery,
  useGetSummaryCacheStatusQuery,
} from '../services/api/debugApi'

const POLL_INTERVAL_MS = 5000

function StatusBadge({ status }) {
  const isHit = status === 'HIT'
  return (
    <Badge
      variant="outline"
      className={
        isHit
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400'
      }
    >
      {isHit ? 'HIT' : 'MISS'}
    </Badge>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  )
}

/**
 * Protected debug page: shows live HIT/MISS status for the two
 * Caffeine caches (rawWeather per city, weatherSummary for the
 * ranked list). Statuses poll every 5 seconds and can be refreshed
 * manually.
 */
export default function CacheDebugPage() {
  const { data: citiesData } = useGetCitiesQuery()
  const cities = citiesData?.data ?? []

  const [cityCode, setCityCode] = useState('')
  const selectedCode = cityCode || cities[0]?.cityCode || ''

  const {
    data: summaryData,
    isFetching: summaryFetching,
    refetch: refetchSummary,
  } = useGetSummaryCacheStatusQuery(undefined, {
    refetchInterval: POLL_INTERVAL_MS,
  })

  const {
    data: rawData,
    isFetching: rawFetching,
    refetch: refetchRaw,
  } = useGetRawCacheStatusQuery(selectedCode, {
    skip: !selectedCode,
    refetchInterval: POLL_INTERVAL_MS,
  })

  const summary = summaryData?.data
  const raw = rawData?.data

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
      <section className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Cache Debugger
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Live HIT/MISS status for the server-side caches. Polls every{' '}
          {POLL_INTERVAL_MS / 1000} seconds.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="size-4 text-primary" />
              Ranked summary cache
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Status</span>
              {summary ? (
                <StatusBadge status={summary.status} />
              ) : (
                <span className="text-muted-foreground text-sm">—</span>
              )}
            </div>
            <DetailRow label="Cache" value="weatherSummary" />
            <DetailRow label="Key" value={summary?.cacheKey ?? 'all'} />
            <DetailRow label="TTL" value="5 min (expireAfterWrite=300s)" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchSummary()}
              disabled={summaryFetching}
              className="w-fit"
            >
              <RefreshCw
                className={`size-4 ${summaryFetching ? 'animate-spin' : ''}`}
              />
              Check now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="size-4 text-primary" />
              Raw city cache
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="debug-city" className="text-muted-foreground text-sm">
                City
              </label>
              <select
                id="debug-city"
                className="border-input bg-background h-9 rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={selectedCode}
                onChange={(e) => setCityCode(e.target.value)}
                aria-label="Select city for cache status"
              >
                {cities.map((city) => (
                  <option key={city.cityCode} value={city.cityCode}>
                    {city.cityName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Status</span>
              {selectedCode && raw ? (
                <StatusBadge status={raw.status} />
              ) : (
                <span className="text-muted-foreground text-sm">—</span>
              )}
            </div>
            <DetailRow label="Cache" value="rawWeather" />
            <DetailRow label="Key" value={selectedCode || '—'} />
            <DetailRow label="TTL" value="5 min (expireAfterWrite=300s)" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchRaw()}
              disabled={rawFetching || !selectedCode}
              className="w-fit"
            >
              <RefreshCw className={`size-4 ${rawFetching ? 'animate-spin' : ''}`} />
              Check now
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="size-4 text-primary" />
            How to read this
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2 text-sm">
          <p>
            <strong className="text-foreground">rawWeather</strong> stores each
            city's raw OpenWeatherMap response. A{' '}
            <strong className="text-foreground">MISS</strong> means the next
            dashboard load will call OpenWeatherMap for that city and then
            populate the cache.
          </p>
          <p>
            <strong className="text-foreground">weatherSummary</strong> stores
            the full ranked list shown on the dashboard. While it is a HIT, the
            dashboard is served entirely from cache.
          </p>
          <p>
            Entries expire 5 minutes after they are written (
            <code className="bg-muted rounded px-1 py-0.5 text-xs">
              expireAfterWrite=300s
            </code>
            ), so MISS states turn into HITs automatically after the next
            dashboard visit.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
