import { useState, useCallback } from 'react'

const STORAGE_KEY = 'codeleap-likes'

const getLikedIds = (): Set<number> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw) as number[]) : new Set()
  } catch {
    return new Set()
  }
}

const saveLikedIds = (ids: Set<number>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
}

export const useLikes = () => {
  const [likedIds, setLikedIds] = useState<Set<number>>(getLikedIds)

  const toggleLike = useCallback((postId: number) => {
    setLikedIds((prev) => {
      const next = new Set(prev)
      if (next.has(postId)) {
        next.delete(postId)
      } else {
        next.add(postId)
      }
      saveLikedIds(next)
      return next
    })
  }, [])

  const isLiked = useCallback((postId: number) => likedIds.has(postId), [likedIds])

  return { toggleLike, isLiked }
}
