import { usePostExtrasStore } from '../store/usePostExtrasStore'
import type { Comment, MediaAttachment } from '../types'

const EMPTY_COMMENTS: Comment[] = []
const EMPTY_MEDIA: MediaAttachment[] = []

export const usePostExtras = (postId: number) => {
  const likedPostIds = usePostExtrasStore((s) => s.likedPostIds)
  const commentsByPost = usePostExtrasStore((s) => s.commentsByPost)
  const mediaByPost = usePostExtrasStore((s) => s.mediaByPost)
  const toggleLikeStore = usePostExtrasStore((s) => s.toggleLike)
  const addCommentStore = usePostExtrasStore((s) => s.addComment)
  const removeCommentStore = usePostExtrasStore((s) => s.removeComment)
  const setMediaForPost = usePostExtrasStore((s) => s.setMediaForPost)
  const clearPostExtras = usePostExtrasStore((s) => s.clearPostExtras)

  return {
    liked: likedPostIds.includes(postId),
    comments: commentsByPost[postId] ?? EMPTY_COMMENTS,
    media: mediaByPost[postId] ?? EMPTY_MEDIA,
    toggleLike: () => toggleLikeStore(postId),
    addComment: (username: string, content: string) => addCommentStore({ postId, username, content }),
    removeComment: (commentId: string) => removeCommentStore({ postId, commentId }),
    setMedia: (media: MediaAttachment[]) => setMediaForPost(postId, media),
    clearExtras: () => clearPostExtras(postId),
  }
}
