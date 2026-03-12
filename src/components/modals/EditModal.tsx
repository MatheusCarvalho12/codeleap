import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'
import type { Post } from '../../types'

interface EditModalProps {
  open: boolean
  post: Post | null
  onCancel: () => void
  onSave: (title: string, content: string) => void
  loading?: boolean
}

export const EditModal = ({ open, post, onCancel, onSave, loading }: EditModalProps) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setContent(post.content)
    }
  }, [post])

  const canSave = title.trim() && content.trim()

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md rounded-2xl bg-white overflow-hidden shadow-modal"
          >
            <div className="bg-primary px-6 py-4">
              <h2 className="text-white font-bold text-lg">Edit post</h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <Input
                id="edit-title"
                label="Title"
                placeholder="Hello world"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                id="edit-content"
                label="Content"
                placeholder="Content here"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  variant="success"
                  disabled={!canSave || loading}
                  onClick={() => onSave(title, content)}
                >
                  {loading ? 'Saving…' : 'Save'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
