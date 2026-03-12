import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import { useUserStore } from './store/useUserStore'
import { SignUpModal } from './components/modals/SignUpModal'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import AuthPage from './pages/AuthPage'
import FeedPage from './pages/FeedPage'

function AppContent() {
  const { user, loading } = useAuth()
  const username = useUserStore((s) => s.username)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-primary">
        <LoadingSpinner size={40} />
      </div>
    )
  }

  if (!user) return <AuthPage />

  return (
    <>
      <FeedPage />
      {!username && <SignUpModal />}
    </>
  )
}

export default function App() {
  return (
    <>
      <AppContent />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </>
  )
}
