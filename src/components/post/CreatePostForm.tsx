import { useState } from 'react'
import toast from 'react-hot-toast'
import { useCreatePost } from '../../hooks/usePosts'
import { assignPostIdToMedia, MAX_MEDIA_ATTACHMENTS, readImagesAsDrafts } from '../../lib/media'
import { extractMentions } from '../../lib/mentions'
import { usePostExtrasStore } from '../../store/usePostExtrasStore'
import { useUserStore } from '../../store/useUserStore'
import type { DraftMediaAttachment } from '../../types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'

export const CreatePostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [media, setMedia] = useState<DraftMediaAttachment[]>([])
  const username = useUserStore((s) => s.username)
  const setMediaForPost = usePostExtrasStore((s) => s.setMediaForPost)
  const { mutate, isPending } = useCreatePost()

  const canCreate = title.trim() && content.trim()
  const detectedMentions = extractMentions(content)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canCreate) return
    mutate(
      { username, title: title.trim(), content: content.trim() },
      {
        onSuccess: (post) => {
          if (media.length > 0) {
            setMediaForPost(post.id, assignPostIdToMedia(post.id, media))
          }
          setTitle('')
          setContent('')
          setMedia([])
        },
      },
    )
  }

  const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? [])

    if (selectedFiles.length === 0) return

    const remainingSlots = MAX_MEDIA_ATTACHMENTS - media.length
    if (remainingSlots <= 0) {
      toast.error(`You can attach up to ${MAX_MEDIA_ATTACHMENTS} images per post.`)
      e.target.value = ''
      return
    }

    const nextMedia = await readImagesAsDrafts(selectedFiles.slice(0, remainingSlots))
    if (nextMedia.length === 0) {
      toast.error('Please select image files only.')
      e.target.value = ''
      return
    }

    setMedia((current) => [...current, ...nextMedia].slice(0, MAX_MEDIA_ATTACHMENTS))
    e.target.value = ''
  }

  return (
    <section className="rounded-2xl border border-app-border bg-white p-6 shadow-sm">
      <h2 className="text-[22px] font-bold text-black">What&apos;s on your mind?</h2>
      <form onSubmit={handleSubmit}>
        <div className="mt-6 flex flex-col gap-4">
          <Input
            id="post-title"
            label="Title"
            placeholder="Hello world"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-8 rounded-lg px-3 py-0"
          />
          <Textarea
            id="post-content"
            label="Content"
            placeholder="Content here"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="min-h-[74px] rounded-lg"
          />

          <div className="flex flex-col gap-3 rounded-xl bg-[#F7F7F7] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-black">Bonus tools</p>
              <p className="text-xs text-muted">
                Add up to {MAX_MEDIA_ATTACHMENTS} images and mention people with @username.
              </p>
            </div>
            <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-app-border bg-white px-3 py-2 text-sm font-semibold text-black transition-colors hover:border-primary hover:text-primary">
              Add image
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleMediaChange} />
            </label>
          </div>
        </div>

        {detectedMentions.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {detectedMentions.map((mention) => (
              <span key={mention} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                @{mention}
              </span>
            ))}
          </div>
        )}

        {media.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {media.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-xl border border-app-border bg-[#F7F7F7]">
                <img src={item.src} alt={item.name} className="h-24 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setMedia((current) => current.filter((entry) => entry.id !== item.id))}
                  className="w-full border-0 bg-white px-3 py-2 text-xs font-semibold text-danger transition-colors hover:bg-danger/5"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-xs text-muted">Posting as @{username}</p>
          <Button
            type="submit"
            disabled={!canCreate || isPending}
            className="min-h-0 rounded-lg px-8 py-2 text-base font-bold disabled:bg-primary/40"
          >
            {isPending ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </section>
  )
}
