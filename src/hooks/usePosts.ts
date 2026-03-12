import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { listPosts, createPost, updatePost, deletePost } from '../lib/api'
import type { CreatePostPayload, UpdatePostPayload } from '../types'

const POSTS_KEY = ['posts']
const onError = () => toast.error('Something went wrong. Please try again.')

export const usePosts = () =>
  useInfiniteQuery({
    queryKey: POSTS_KEY,
    queryFn: ({ pageParam = 0 }) => listPosts(pageParam as number, 10),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.next) return undefined
      return allPages.length * 10
    },
  })

export const useCreatePost = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: POSTS_KEY })
      toast.success('Post created!')
    },
    onError,
  })
}

export const useUpdatePost = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdatePostPayload }) =>
      updatePost(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: POSTS_KEY })
      toast.success('Post updated!')
    },
    onError,
  })
}

export const useDeletePost = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: POSTS_KEY })
      toast.success('Post deleted!')
    },
    onError,
  })
}
