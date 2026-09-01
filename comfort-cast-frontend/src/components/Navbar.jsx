import { useAuth0 } from '@auth0/auth0-react'
import { Button } from '@/components/ui/button'
import { CloudSun, LogOut, Moon, RefreshCw, Sun } from 'lucide-react'

export default function Navbar({ darkMode, onToggleDarkMode, onRefresh, refreshing }) {
  const { user, logout } = useAuth0()

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-2 font-semibold">
          <CloudSun className="size-5 text-primary" />
          <span className="text-lg tracking-tight">Comfort Cast</span>
        </div>
        <div className="flex items-center gap-2">
          {user?.name && (
            <span className="text-muted-foreground mr-1 hidden text-sm sm:inline">
              {user.name}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            disabled={refreshing}
            aria-label="Refresh weather"
            title="Refresh weather"
          >
            <RefreshCw className={`size-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}