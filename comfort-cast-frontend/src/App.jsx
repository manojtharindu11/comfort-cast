import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import { store } from './app/store'
import AuthSync from './components/AuthSync'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('comfort-cast-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  })

  const [refreshSignal, setRefreshSignal] = useState(0)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('comfort-cast-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <Provider store={store}>
      <AuthSync />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <>
                <div className="min-h-screen flex flex-col">
                  <Navbar
                    darkMode={darkMode}
                    onToggleDarkMode={() => setDarkMode((prev) => !prev)}
                    onRefresh={() => setRefreshSignal((value) => value + 1)}
                  />
                  <DashboardPage refreshSignal={refreshSignal} />
                </div>
              </>
            }
          />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Provider>
  )
}

export default App
