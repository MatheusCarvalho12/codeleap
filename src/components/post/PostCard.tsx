import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, Pencil, Trash2, X, Send } from 'lucide-react'
import { useUpdatePost, useDeletePost } from '../../hooks/usePosts'
import { useLikes } from '../../hooks/useLikes'
import { useComments } from '../../hooks/useComments'
import { useUserStore } from '../../store/useUserStore'
import { DeleteModal } from '../modals/DeleteModal'
import { EditModal } from '../modals/EditModal'
import type { Post } from '../../types'

interface PostCardProps {
  post: Post
}

export const PostCard = ({ post }: PostCardProps) => {
  const username = useUserStore((s) => s.username)
  const isOwner = post.username === username

  const [showDelete, setShowDelete] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentInput, setCommentInput] = useState('')

  const { mutate: doUpdate, isPending: updating } = useUpdatePost()
  const { mutate: doDelete, isPending: deleting } = useDeletePost()
  const { toggleLike, isLiked } = useLikes()
  const { comments, addComment, removeComment } = useComments(post.id)

  const liked = isLiked(post.id)

  const handleSave = (title: string, content: string) => {
    doUpdate({ id: post.id, payload: { title, content } }, { onSuccess: () => setShowEdit(false) })
  }

  const handleDelete = () => {
    doDelete(post.id, { onSuccess: () => setShowDelete(false) })
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = commentInput.trim()
    if (trimmed) {
      addComment(username, trimmed)
      setCommentInput('')
    }
  }

  const timestamp = formatDistanceToNow(new Date(post.created_datetime), { addSuffix: true })
  const initial = post.username[0]?.toUpperCase() ?? '?'

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.22 }}
        className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
      >
        <div className="px-4 sm:px-6 py-4 flex gap-3">
          {/* Avatar */}
          <div className="shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm select-none">
              {initial}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 text-sm truncate">{post.title}</span>
                <span className="text-muted text-sm">@{post.username}</span>
                <span className="text-muted text-xs hidden sm:inline">·</span>
                <span className="text-muted text-xs hidden sm:inline">{timestamp}</span>
              </div>
              {isOwner && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    aria-label="Edit post"
                    onClick={() => setShowEdit(true)}
                    className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary/10 transition-colors active:scale-95"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    aria-label="Delete post"
                    onClick={() => setShowDelete(true)}
                    className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors active:scale-95"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
            </div>

            {/* Timestamp mobile */}
            <span className="text-muted text-xs sm:hidden">{timestamp}</span>

            {/* Post content */}
            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap mt-2">{post.content}</p>

            {/* Action bar */}
            <div className="flex items-center gap-1 mt-3">
              {/* Like */}
              <motion.button
                whileTap={{ scale: 1.3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  liked
                    ? 'text-danger bg-danger/10'
                    : 'text-muted hover:text-danger hover:bg-danger/10'
                }`}
                aria-label={liked ? 'Unlike' : 'Like'}
              >
                <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
                <span>{liked ? 'Liked' : 'Like'}</span>
              </motion.button>

              {/* Comments */}
              <button
                onClick={() => setShowComments((v) => !v)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium text-muted hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <MessageCircle size={14} />
                <span>{comments.length > 0 ? comments.length : ''} Comment{comments.length !== 1 ? 's' : ''}</span>
              </button>
            </div>

            {/* Comments section */}
            <AnimatePresence>
              {showComments && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
                    {comments.map((c) => (
                      <div key={c.id} className="flex items-start gap-2 text-sm">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold text-xs shrink-0">
                          {c.username[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
                          <span className="font-semibold text-gray-700 text-xs">@{c.username}</span>
                          <p className="text-gray-600 text-xs mt-0.5">{c.content}</p>
                        </div>
                        {c.username === username && (
                          <button
                            onClick={() => removeComment(c.id)}
                            className="text-muted hover:text-danger p-1 mt-1 shrink-0 rounded transition-colors"
                            aria-label="Remove comment"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                    <form onSubmit={handleAddComment} className="flex gap-2 mt-1">
                      <input
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Add a comment…"
                        className="flex-1 rounded-full border border-app-border px-3 py-1.5 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                      <button
                        type="submit"
                        disabled={!commentInput.trim()}
                        className="p-2 rounded-full bg-primary text-white disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all"
                        aria-label="Send comment"
                      >
                        <Send size={12} />
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <DeleteModal
        open={showDelete}
        onCancel={() => setShowDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
      <EditModal
        open={showEdit}
        post={post}
        onCancel={() => setShowEdit(false)}
        onSave={handleSave}
        loading={updating}
      />
    </>
  )
}
