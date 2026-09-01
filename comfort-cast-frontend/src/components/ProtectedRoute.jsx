import { useAuth0 } from '@auth0/auth0-react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'

/**
 * Guards a route: unauthenticated users are sent to /login with the
 * originally-requested path so they can be redirected back after login.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth0()
  const location = useLocation()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}