import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen text-white app-shell">
      <header className="px-6 py-8 md:px-10 border-b border-white/10 animate-slide-down">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="uppercase tracking-[0.4em] text-xs text-white/60">
              Expense tracker
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">
              Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-white/60">Signed in as</p>
              <p className="text-sm font-medium">{user?.email}</p>
            </div>
            <button
              type="button"
              className="btn-ghost"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="px-6 pb-16 md:px-10 pt-8">
        <Outlet />
      </main>
    </div>
  )
}
