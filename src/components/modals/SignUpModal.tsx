import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { useUserStore } from '../../store/useUserStore'

export const SignUpModal = () => {
  const [value, setValue] = useState('')
  const setUsername = useUserStore((s) => s.setUsername)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) setUsername(trimmed)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="w-full max-w-md rounded-2xl bg-white shadow-modal overflow-hidden"
      >
        <div className="bg-primary px-6 py-4">
          <h2 className="text-white font-bold text-lg">Welcome to CodeLeap Network!</h2>
          <p className="text-white/70 text-sm mt-0.5">Choose a username to get started</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <input
            autoFocus
            placeholder="Your username"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-lg border border-app-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!value.trim()}>
              ENTER
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
