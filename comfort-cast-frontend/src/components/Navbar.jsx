import { useAuth0 } from '@auth0/auth0-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CloudSun, LogIn, LogOut, Moon, RefreshCw, Sun } from 'lucide-react'

const NAV_LINKS = [
  { to: '/', label: 'Cities', end: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/debug', label: 'Cache Debug' },
]

export default function Navbar({ darkMode, onToggleDarkMode, onRefresh, refreshing }) {
  const { user, isAuthenticated, logout } = useAuth0()
  const location = useLocation()
  const onDashboard = location.pathname === '/dashboard'

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <CloudSun className="size-5 text-primary" />
            <span className="hidden text-lg tracking-tight lg:inline">
              Comfort Cast
            </span>
          </Link>
          <nav className="flex items-center gap-0.5 sm:gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-2 py-1.5 text-sm font-medium whitespace-nowrap transition-colors sm:px-3',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated && user?.name && (
            <span className="text-muted-foreground mr-1 hidden text-sm md:inline">
              {user.name}
            </span>
          )}
          {onDashboard && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              disabled={refreshing}
              aria-label="Refresh weather"
              title="Refresh weather"
            >
              <RefreshCw className={cn('size-4', refreshing && 'animate-spin')} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
              aria-label="Log out"
              title="Log out"
            >
              <LogOut className="size-4" />
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link to="/login">
                <LogIn className="size-4" /> Sign in
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
