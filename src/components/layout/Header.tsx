import { LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useUserStore } from '../../store/useUserStore'

export const Header = () => {
  const { signOut } = useAuth()
  const username = useUserStore((s) => s.username)
  const clearUsername = useUserStore((s) => s.clearUsername)

  const handleLogout = async () => {
    clearUsername()
    await signOut()
  }

  const initial = username ? username[0].toUpperCase() : '?'

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-primary/95 shadow-sm">
      <div className="mx-auto flex max-w-feed items-center justify-between px-4 sm:px-6 py-3">
        <h1 className="text-white font-bold text-xl tracking-tight">CodeLeap Network</h1>
        <div className="flex items-center gap-3">
          {username && (
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-sm select-none">
              {initial}
            </div>
          )}
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-colors active:scale-95"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
