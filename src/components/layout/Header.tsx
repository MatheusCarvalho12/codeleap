import { LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import { useUserStore } from '../../store/useUserStore'
import { Button } from '../ui/Button'

export const Header = () => {
  const { user, loading, signInWithGoogle, signOut, isAvailable } = useAuth()
  const username = useUserStore((s) => s.username)
  const clearUsername = useUserStore((s) => s.clearUsername)

  const handleAuthAction = async () => {
    try {
      if (user) {
        await signOut()
        toast.success('Google session disconnected.')
        return
      }

      await signInWithGoogle()
      toast.success('Google account connected.')
    } catch {
      toast.error('Google authentication failed.')
    }
  }

  return (
    <header className="bg-primary px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-white">CodeLeap Network</h1>
          <p className="mt-1 text-sm text-white/85">Posting as @{username}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isAvailable && !user && (
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={handleAuthAction}
              className="min-h-0 rounded-lg border-white/65 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20"
            >
              Connect Google
            </Button>
          )}
          {user && (
            <span className="rounded-lg border border-white/65 bg-white/10 px-3 py-2 text-xs font-semibold text-white">
              Google: {user.displayName ?? 'connected'}
            </span>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={clearUsername}
            className="min-h-0 rounded-lg border-white/65 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20"
          >
            Change user
          </Button>
          {user && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleAuthAction}
              className="min-h-0 rounded-lg px-3 py-2 text-xs font-semibold text-white hover:bg-white/15 hover:text-white"
            >
              <LogOut size={14} />
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
