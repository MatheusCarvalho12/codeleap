import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { Heart, ImageIcon, MessageCircle, Pencil, Send, Trash2, X } from 'lucide-react'
import { useDeletePost, useUpdatePost } from '../../hooks/usePosts'
import { extractMentions, mentionsUser, renderTextWithMentions } from '../../lib/mentions'
import { usePostExtrasStore } from '../../store/usePostExtrasStore'
import { useUserStore } from '../../store/useUserStore'
import type { Comment, MediaAttachment, Post } from '../../types'
import { DeleteModal } from '../modals/DeleteModal'
import { EditModal } from '../modals/EditModal'

interface PostCardProps {
  post: Post
}

const EMPTY_COMMENTS: Comment[] = []
const EMPTY_MEDIA: MediaAttachment[] = []

export const PostCard = ({ post }: PostCardProps) => {
  const username = useUserStore((s) => s.username)
  const likedPostIds = usePostExtrasStore((s) => s.likedPostIds)
  const commentsByPost = usePostExtrasStore((s) => s.commentsByPost)
  const mediaByPost = usePostExtrasStore((s) => s.mediaByPost)
  const toggleLike = usePostExtrasStore((s) => s.toggleLike)
  const addComment = usePostExtrasStore((s) => s.addComment)
  const removeComment = usePostExtrasStore((s) => s.removeComment)
  const setMediaForPost = usePostExtrasStore((s) => s.setMediaForPost)
  const clearPostExtras = usePostExtrasStore((s) => s.clearPostExtras)

  const isOwner = post.username === username
  const liked = likedPostIds.includes(post.id)
  const comments = commentsByPost[post.id] ?? EMPTY_COMMENTS
  const media = mediaByPost[post.id] ?? EMPTY_MEDIA
  const detectedMentions = extractMentions(post.content)

  const [showDelete, setShowDelete] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentInput, setCommentInput] = useState('')

  const { mutate: doUpdate, isPending: updating } = useUpdatePost()
  const { mutate: doDelete, isPending: deleting } = useDeletePost()

  const handleSave = (title: string, content: string, nextMedia: MediaAttachment[]) => {
    doUpdate(
      { id: post.id, payload: { title, content } },
      {
        onSuccess: () => {
          setMediaForPost(post.id, nextMedia)
          setShowEdit(false)
        },
      },
    )
  }

  const handleDelete = () => {
    doDelete(post.id, {
      onSuccess: () => {
        clearPostExtras(post.id)
        setShowDelete(false)
      },
    })
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = commentInput.trim()
    if (!trimmed) return

    addComment({ postId: post.id, username, content: trimmed })
    setCommentInput('')
    setShowComments(true)
  }

  const mentionsThisUser =
    !!username &&
    (mentionsUser(post.content, username) || comments.some((comment) => mentionsUser(comment.content, username)))

  const timestamp = formatDistanceToNow(new Date(post.created_datetime), { addSuffix: true })

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden rounded-2xl border border-app-border bg-white shadow-sm"
      >
        <div className="flex items-start justify-between gap-4 bg-primary px-5 py-4">
          <h3 className="text-[22px] font-bold leading-tight text-white">{post.title}</h3>
          {isOwner && (
            <div className="flex items-center gap-3 text-white">
              <button
                type="button"
                aria-label="Delete post"
                onClick={() => setShowDelete(true)}
                className="rounded-md p-1 transition-colors hover:bg-white/15"
              >
                <Trash2 size={18} />
              </button>
              <button
                type="button"
                aria-label="Edit post"
                onClick={() => setShowEdit(true)}
                className="rounded-md p-1 transition-colors hover:bg-white/15"
              >
                <Pencil size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="font-bold text-muted">@{post.username}</span>
            <span className="text-muted">{timestamp}</span>
          </div>

          {(mentionsThisUser || detectedMentions.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {mentionsThisUser && (
                <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                  Mentions you
                </span>
              )}
              {detectedMentions.map((mention) => (
                <span key={mention} className="rounded-full bg-[#F4F4F4] px-3 py-1 text-xs font-semibold text-muted">
                  @{mention}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 whitespace-pre-wrap text-[18px] leading-7 text-[#4B4B4B]">
            {renderTextWithMentions(post.content)}
          </div>

          {media.length > 0 && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {media.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-2xl border border-app-border bg-[#F7F7F7]">
                  <img src={item.src} alt={item.name} className="h-48 w-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#EFEFEF] pt-4">
            <button
              type="button"
              onClick={() => toggleLike(post.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                liked
                  ? 'border-danger bg-danger/10 text-danger'
                  : 'border-app-border text-muted hover:border-danger hover:text-danger'
              }`}
            >
              <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
              {liked ? 'Liked' : 'Like'}
            </button>
            <button
              type="button"
              onClick={() => setShowComments((value) => !value)}
              className="inline-flex items-center gap-2 rounded-full border border-app-border px-3 py-2 text-xs font-semibold text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <MessageCircle size={14} />
              {comments.length > 0 ? `${comments.length} comments` : 'Comments'}
            </button>
            {media.length > 0 && (
              <span className="inline-flex items-center gap-2 rounded-full border border-app-border px-3 py-2 text-xs font-semibold text-muted">
                <ImageIcon size={14} />
                {media.length} image{media.length === 1 ? '' : 's'}
              </span>
            )}
          </div>

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
                          {comment.username === username && (
                            <button
                              type="button"
                              onClick={() => removeComment({ postId: post.id, commentId: comment.id })}
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

                  <form onSubmit={handleAddComment} className="mt-4 flex flex-col gap-3 sm:flex-row">
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
        </div>
      </motion.article>

      <DeleteModal
        open={showDelete}
        onCancel={() => setShowDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
      <EditModal
        open={showEdit}
        post={post}
        media={media}
        onCancel={() => setShowEdit(false)}
        onSave={handleSave}
        loading={updating}
      />
    </>
  )
}
