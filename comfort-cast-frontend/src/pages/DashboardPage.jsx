import { useEffect, useMemo, useState } from 'react'
import { RefreshCw, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { useGetWeatherSummaryQuery } from '../services/api/weatherApi'
import LoadingSpinner from '../components/LoadingSpinner'
import WeatherCard from '../components/WeatherCard'
import WeatherTable from '../components/WeatherTable'

const SORT_OPTIONS = [
  { value: 'rank', label: 'Rank' },
  { value: 'comfortIndex', label: 'Comfort score' },
  { value: 'tempC', label: 'Temperature' },
  { value: 'cityName', label: 'City name' },
]

const VIEW_OPTIONS = [
  { value: 'table', label: 'Table' },
  { value: 'cards', label: 'Cards' },
]

export default function DashboardPage({ refreshSignal }) {
  const { data, isLoading, isFetching, isError, error, refetch, dataUpdatedAt } = useGetWeatherSummaryQuery()

  const cities = data?.data ?? []

  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('rank')
  const [minScore, setMinScore] = useState(0)
  const [view, setView] = useState('table')

  useEffect(() => {
    refetch()
  }, [refreshSignal, refetch])

  const filtered = useMemo(() => {
    let result = [...cities]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (c) => c.cityName.toLowerCase().includes(q) || c.description.toLowerCase().includes(q),
      )
    }
    if (minScore > 0) {
      result = result.filter((c) => c.comfortIndex >= minScore)
    }
    switch (sortBy) {
      case 'comfortIndex':
        result.sort((a, b) => b.comfortIndex - a.comfortIndex)
        break
      case 'tempC':
        result.sort((a, b) => b.tempC - a.tempC)
        break
      case 'cityName':
        result.sort((a, b) => a.cityName.localeCompare(b.cityName))
        break
      default:
        result.sort((a, b) => a.rank - b.rank)
    }
    return result
  }, [cities, search, sortBy, minScore])

  const refreshing = isFetching

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
        <p className="text-4xl">⚠️</p>
        <p className="text-muted-foreground">{error?.data?.message || 'Failed to load weather data'}</p>
        <Button onClick={refetch}>Try again</Button>
      </div>
    )
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
      <section className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Weather Analytics</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {cities.length} cities ranked by Comfort Index
            {dataUpdatedAt && <> · updated at {new Date(dataUpdatedAt).toLocaleTimeString()}</>}
          </p>
        </div>
        {refreshing && (
          <Badge variant="secondary" className="w-fit gap-1">
            <RefreshCw className="size-3 animate-spin" /> Refreshing…
          </Badge>
        )}
      </section>

      <section className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-44 flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Search city or weather…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label="Search cities"
          />
        </div>

        <select
          className="border-input bg-background h-9 rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort cities"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Sort: {opt.label}
            </option>
          ))}
        </select>

        <div className="flex h-9 min-w-52 items-center gap-3 rounded-md border px-3">
          <span className="text-muted-foreground text-sm">Min score</span>
          <Slider
            value={[minScore]}
            onValueChange={([value]) => setMinScore(value)}
            min={0}
            max={100}
            step={5}
            className="flex-1"
          />
          <span className="w-6 text-right text-sm font-medium tabular-nums">{minScore}</span>
        </div>

        <div className="flex overflow-hidden rounded-md border">
          {VIEW_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant={view === opt.value ? 'secondary' : 'ghost'}
              size="sm"
              className="rounded-none"
              onClick={() => setView(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="text-muted-foreground rounded-lg border border-dashed py-16 text-center">
          No cities match your filters.
        </div>
      ) : view === 'table' ? (
        <WeatherTable cities={filtered} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((city) => (
            <WeatherCard key={city.cityCode} city={city} />
          ))}
        </div>
      )}

      <footer className="text-muted-foreground mt-8 border-t pt-4 text-center text-xs">
        Comfort Index is computed server-side from temperature, humidity and wind speed.
      </footer>
    </main>
  )
}