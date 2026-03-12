import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MAX_MEDIA_ATTACHMENTS, readImagesAsDrafts } from '../../lib/media'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'
import type { DraftMediaAttachment, MediaAttachment, Post } from '../../types'

interface EditModalProps {
  open: boolean
  post: Post | null
  media: MediaAttachment[]
  onCancel: () => void
  onSave: (title: string, content: string, media: MediaAttachment[]) => void
  loading?: boolean
}

export const EditModal = ({ open, post, media, onCancel, onSave, loading }: EditModalProps) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [draftMedia, setDraftMedia] = useState<DraftMediaAttachment[]>([])

  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setContent(post.content)
    }
  }, [post])

  useEffect(() => {
    setDraftMedia(media)
  }, [media])

  const canSave = title.trim() && content.trim()

  const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? [])
    if (selectedFiles.length === 0) return

    const remainingSlots = MAX_MEDIA_ATTACHMENTS - draftMedia.length
    if (remainingSlots <= 0) {
      e.target.value = ''
      return
    }

    const nextMedia = await readImagesAsDrafts(selectedFiles.slice(0, remainingSlots))
    setDraftMedia((current) => [...current, ...nextMedia].slice(0, MAX_MEDIA_ATTACHMENTS))
    e.target.value = ''
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[660px] rounded-2xl bg-white p-6 shadow-modal"
          >
            <h2 className="text-[22px] font-bold text-black">Edit item</h2>
            <div className="mt-6 flex flex-col gap-4">
              <Input
                id="edit-title"
                label="Title"
                placeholder="Hello world"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-8 rounded-lg px-3 py-0"
              />
              <Textarea
                id="edit-content"
                label="Content"
                placeholder="Content here"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="min-h-[74px] rounded-lg"
              />

              <div className="rounded-xl bg-[#F7F7F7] px-4 py-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-black">Media attachments</p>
                    <p className="text-xs text-muted">Keep, remove, or add up to {MAX_MEDIA_ATTACHMENTS} images.</p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-app-border bg-white px-3 py-2 text-sm font-semibold text-black transition-colors hover:border-primary hover:text-primary">
                    Add image
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleMediaChange} />
                  </label>
                </div>
                {draftMedia.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {draftMedia.map((item) => (
                      <div key={item.id} className="overflow-hidden rounded-xl border border-app-border bg-white">
                        <img src={item.src} alt={item.name} className="h-24 w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setDraftMedia((current) => current.filter((entry) => entry.id !== item.id))}
                          className="w-full border-0 bg-white px-3 py-2 text-xs font-semibold text-danger transition-colors hover:bg-danger/5"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={onCancel} disabled={loading} className="min-h-0 rounded-lg px-7 py-2">
                  Cancel
                </Button>
                <Button
                  variant="success"
                  disabled={!canSave || loading}
                  onClick={() =>
                    onSave(
                      title.trim(),
                      content.trim(),
                      draftMedia.map((item) => ({
                        ...item,
                        postId: post?.id ?? 0,
                      })),
                    )
                  }
                  className="min-h-0 rounded-lg px-7 py-2"
                >
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
