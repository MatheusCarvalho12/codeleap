import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, X } from 'lucide-react'
import { renderTextWithMentions } from '../../lib/mentions'
import type { Comment } from '../../types'

interface CommentSectionProps {
  comments: Comment[]
  currentUsername: string
  showComments: boolean
  onAddComment: (content: string) => void
  onRemoveComment: (commentId: string) => void
}

export const CommentSection = ({
  comments,
  currentUsername,
  showComments,
  onAddComment,
  onRemoveComment,
}: CommentSectionProps) => {
  const [commentInput, setCommentInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = commentInput.trim()
    if (!trimmed) return
    onAddComment(trimmed)
    setCommentInput('')
  }

  return (
    <AnimatePresence initial={false}>
      {showComments && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="overflow-hidden"
        >
          <div className="mt-4 rounded-2xl bg-[#F7F7F7] p-4">
            <div className="flex flex-col gap-3">
              {comments.length === 0 && (
                <p className="text-sm text-muted">No comments yet. Start the conversation.</p>
              )}
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-xl border border-white bg-white px-3 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-muted">@{comment.username}</p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#4B4B4B]">
                        {renderTextWithMentions(comment.content)}
                      </p>
                    </div>
                    {comment.username === currentUsername && (
                      <button
                        type="button"
                        onClick={() => onRemoveComment(comment.id)}
                        className="rounded-md p-1 text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                        aria-label="Remove comment"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment or mention @someone"
                className="h-11 flex-1 rounded-xl border border-app-border px-3 text-sm outline-none transition-colors focus:border-primary"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                <Send size={14} />
                Send
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
