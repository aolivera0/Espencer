import { useAuth } from './context/auth'
import Login from './pages/Login'
import Workspace from './Workspace'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="grid min-h-svh place-items-center" role="status" aria-label="Cargando">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-emerald-400" />
      </div>
    )
  }

  return user ? <Workspace user={user} /> : <Login />
}
