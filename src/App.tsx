import { Toaster } from 'react-hot-toast'
import { useUserStore } from './store/useUserStore'
import { SignUpModal } from './components/modals/SignUpModal'
import FeedPage from './pages/FeedPage'

function AppContent() {
  const username = useUserStore((s) => s.username)

  if (!username) return <SignUpModal />

  return <FeedPage />
}

export default function App() {
  return (
    <>
      <AppContent />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </>
  )
}
