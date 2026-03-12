import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { useUserStore } from '../../store/useUserStore'
import { useAuth } from '../../hooks/useAuth'

export const SignUpModal = () => {
  const [value, setValue] = useState('')
  const setUsername = useUserStore((s) => s.setUsername)
  const { user } = useAuth()

  useEffect(() => {
    if (!value.trim() && user?.displayName) {
      setValue(user.displayName)
    }
  }, [user?.displayName, value])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) setUsername(trimmed)
  }

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[500px] rounded-2xl border border-app-border bg-white px-6 py-7 shadow-card"
      >
        <h2 className="text-[22px] font-bold leading-tight text-black">Welcome to CodeLeap network!</h2>
        <label htmlFor="username" className="mt-6 block text-base text-black">
          Please enter your username
        </label>
        <input
          id="username"
          autoFocus
          placeholder="John doe"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-2 h-8 w-full rounded-lg border border-app-border px-3 text-sm outline-none transition-colors focus:border-primary placeholder:text-[#777777]"
        />
        <div className="mt-4 flex justify-end">
          <Button
            type="submit"
            disabled={!value.trim()}
            className="min-h-0 rounded-lg px-7 py-2 text-base font-bold uppercase disabled:bg-primary/40"
          >
            Enter
          </Button>
        </div>
      </form>
    </div>
  )
}
