import { useState } from 'react'
import { useCreatePost } from '../../hooks/usePosts'
import { useUserStore } from '../../store/useUserStore'

export const CreatePostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const username = useUserStore((s) => s.username)
  const { mutate, isPending } = useCreatePost()

  const canCreate = title.trim() && content.trim()
  const initial = username ? username[0].toUpperCase() : '?'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canCreate) return
    mutate(
      { username, title: title.trim(), content: content.trim() },
      {
        onSuccess: () => {
          setTitle('')
          setContent('')
        },
      },
    )
  }

  return (
    <div className="bg-white border-b border-gray-100 shadow-sm">
      <div className="px-4 sm:px-6 py-3 border-b border-gray-100">
        <h2 className="font-bold text-base text-gray-900">What's on your mind?</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3 px-4 sm:px-6 py-4">
          {/* Avatar */}
          <div className="shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm select-none">
              {initial}
            </div>
          </div>

          {/* Inputs */}
          <div className="flex-1 flex flex-col gap-3">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-0 border-b border-gray-100 pb-2 text-sm outline-none focus:border-primary placeholder:text-gray-400 bg-transparent transition-colors"
            />
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full resize-none border-0 text-sm outline-none placeholder:text-gray-400 bg-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end px-4 sm:px-6 pb-4">
          <button
            type="submit"
            disabled={!canCreate || isPending}
            className="px-5 py-2 rounded-full bg-primary text-white font-semibold text-sm disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            {isPending ? 'Posting…' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
