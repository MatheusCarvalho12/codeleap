import { useState, useCallback } from 'react'
import type { Comment } from '../types'

const STORAGE_KEY = 'codeleap-comments'

const getAll = (): Record<number, Comment[]> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<number, Comment[]>) : {}
  } catch {
    return {}
  }
}

const saveAll = (data: Record<number, Comment[]>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const useComments = (postId: number) => {
  const [allComments, setAllComments] = useState<Record<number, Comment[]>>(getAll)

  const comments = allComments[postId] ?? []

  const addComment = useCallback(
    (username: string, content: string) => {
      setAllComments((prev) => {
        const next = { ...prev }
        const comment: Comment = {
          id: crypto.randomUUID(),
          postId,
          username,
          content,
          createdAt: new Date().toISOString(),
        }
        next[postId] = [...(next[postId] ?? []), comment]
        saveAll(next)
        return next
      })
    },
    [postId],
  )

  const removeComment = useCallback(
    (commentId: string) => {
      setAllComments((prev) => {
        const next = { ...prev }
        next[postId] = (next[postId] ?? []).filter((c) => c.id !== commentId)
        saveAll(next)
        return next
      })
    },
    [postId],
  )

  return { comments, addComment, removeComment }
}
