import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

/**
 * Shared page shell: sticky navbar on top, page content below.
 * Used by both public (cities) and protected (dashboard, debug) routes.
 */
export default function Layout({ darkMode, onToggleDarkMode, onRefresh }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        onRefresh={onRefresh}
      />
      <Outlet />
    </div>
  )
}
