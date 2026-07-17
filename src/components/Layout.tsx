import { useLocation, Link, Outlet } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()

  const linkClass = (path: string) =>
    `px-4 py-2 rounded-lg font-semibold transition-colors ${
      location.pathname === path
        ? 'bg-blue-600 text-white'
        : 'text-gray-300 hover:text-white hover:bg-gray-700'
    }`

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="border-b border-gray-700 bg-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-2xl">📦</span>
            <h1 className="text-xl font-bold tracking-tight">
              IO2 Suministros
            </h1>
          </Link>
          <nav className="flex gap-2">
            <Link to="/" className={linkClass('/')}>
              Dashboard
            </Link>
            <Link to="/historial" className={linkClass('/historial')}>
              Historial
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
