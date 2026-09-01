import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import {
  ArrowRight,
  CloudSun,
  LayoutDashboard,
  LogIn,
  MapPin,
  RefreshCw,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import LoadingSpinner from '../components/LoadingSpinner'
import { useGetCitiesQuery } from '../services/api/cityApi'

/**
 * Public landing page: lists the tracked cities from the public
 * /api/cities endpoint. Guests are invited to sign in; signed-in
 * users can jump straight to the dashboard.
 */
export default function CitiesPage() {
  const { isAuthenticated } = useAuth0()
  const { data, isLoading, isFetching, isError, refetch } = useGetCitiesQuery()

  const cities = data?.data ?? []

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <section className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="flex items-center gap-2 text-4xl font-bold tracking-tight">
          <CloudSun className="size-9 text-primary" />
          Comfort Cast
        </div>
        <p className="text-muted-foreground max-w-xl">
          Weather for {cities.length > 0 ? cities.length : 'our'} tracked cities,
          ranked by a Comfort Index computed server-side from temperature,
          humidity and wind speed.
        </p>
        <div className="flex items-center gap-3">
          <Button asChild size="lg">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <LayoutDashboard /> Open Dashboard <ArrowRight />
              </Link>
            ) : (
              <Link to="/login">
                <LogIn /> Sign in to view rankings <ArrowRight />
              </Link>
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Refresh cities"
            title="Refresh cities"
          >
            <RefreshCw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </section>

      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <p className="text-4xl">⚠️</p>
          <p className="text-muted-foreground">Failed to load cities</p>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <Card key={city.cityCode}>
              <CardContent className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                    <MapPin className="text-muted-foreground size-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{city.cityName}</p>
                    <p className="text-muted-foreground text-xs">
                      OpenWeatherMap ID
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="tabular-nums">
                  {city.cityCode}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      <footer className="text-muted-foreground mt-10 border-t pt-4 text-center text-xs">
        {isAuthenticated
          ? 'Head to the dashboard for live comfort rankings.'
          : 'Sign in to see live weather, comfort scores and city rankings.'}
      </footer>
    </main>
  )
}
