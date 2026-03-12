import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Comment, MediaAttachment } from '../types'

interface AddCommentInput {
  postId: number
  username: string
  content: string
}

interface RemoveCommentInput {
  postId: number
  commentId: string
}

interface RemoveMediaInput {
  postId: number
  mediaId: string
}

interface PostExtrasStore {
  likedPostIds: number[]
  commentsByPost: Record<number, Comment[]>
  mediaByPost: Record<number, MediaAttachment[]>
  toggleLike: (postId: number) => void
  addComment: (input: AddCommentInput) => void
  removeComment: (input: RemoveCommentInput) => void
  setMediaForPost: (postId: number, media: MediaAttachment[]) => void
  removeMedia: (input: RemoveMediaInput) => void
  clearPostExtras: (postId: number) => void
}

export const usePostExtrasStore = create<PostExtrasStore>()(
  persist(
    (set) => ({
      likedPostIds: [],
      commentsByPost: {},
      mediaByPost: {},
      toggleLike: (postId) =>
        set((state) => ({
          likedPostIds: state.likedPostIds.includes(postId)
            ? state.likedPostIds.filter((id) => id !== postId)
            : [...state.likedPostIds, postId],
        })),
      addComment: ({ postId, username, content }) =>
        set((state) => {
          const nextComments = state.commentsByPost[postId] ?? []
          const nextComment: Comment = {
            id: crypto.randomUUID(),
            postId,
            username,
            content,
            createdAt: new Date().toISOString(),
          }

          return {
            commentsByPost: {
              ...state.commentsByPost,
              [postId]: [...nextComments, nextComment],
            },
          }
        }),
      removeComment: ({ postId, commentId }) =>
        set((state) => ({
          commentsByPost: {
            ...state.commentsByPost,
            [postId]: (state.commentsByPost[postId] ?? []).filter((comment) => comment.id !== commentId),
          },
        })),
      setMediaForPost: (postId, media) =>
        set((state) => ({
          mediaByPost: {
            ...state.mediaByPost,
            [postId]: media,
          },
        })),
      removeMedia: ({ postId, mediaId }) =>
        set((state) => ({
          mediaByPost: {
            ...state.mediaByPost,
            [postId]: (state.mediaByPost[postId] ?? []).filter((item) => item.id !== mediaId),
          },
        })),
      clearPostExtras: (postId) =>
        set((state) => {
          const nextComments = { ...state.commentsByPost }
          const nextMedia = { ...state.mediaByPost }
          delete nextComments[postId]
          delete nextMedia[postId]

          return {
            likedPostIds: state.likedPostIds.filter((id) => id !== postId),
            commentsByPost: nextComments,
            mediaByPost: nextMedia,
          }
        }),
    }),
    { name: 'codeleap-post-extras' },
  ),
)
