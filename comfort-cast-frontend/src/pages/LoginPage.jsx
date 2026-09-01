import { useAuth0 } from '@auth0/auth0-react'
import { Navigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CloudSun } from 'lucide-react'

export default function LoginPage() {
  const { loginWithRedirect, isAuthenticated } = useAuth0()
  const location = useLocation()
  const from = location.state?.from ?? '/'

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="flex items-center gap-2 text-3xl font-bold">
        <CloudSun className="size-8 text-primary" />
        Comfort Cast
      </div>
      <p className="max-w-md text-center text-muted-foreground">
        Sign in to view weather analytics ranked by Comfort Index, computed
        server-side from temperature, humidity and wind speed.
      </p>
      <Button
        size="lg"
        onClick={() =>
          loginWithRedirect({
            appState: { returnTo: from },
          })
        }
      >
        Sign in with Auth0
      </Button>
    </div>
  )
}