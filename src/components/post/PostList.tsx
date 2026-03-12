import { useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { usePosts } from '../../hooks/usePosts'
import { PostCard } from './PostCard'
import { LoadingSpinner } from '../ui/LoadingSpinner'

export const PostList = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = usePosts()
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12 text-primary bg-white">
        <LoadingSpinner size={32} />
      </div>
    )
  }

  if (isError) {
    return (
      <p className="text-center text-muted py-12 bg-white">
        Failed to load posts. Please refresh.
      </p>
    )
  }

  const posts = data?.pages.flatMap((p) => p.results) ?? []

  return (
    <div className="flex flex-col bg-white">
      <AnimatePresence mode="popLayout">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </AnimatePresence>

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-1" />

      {isFetchingNextPage && (
        <div className="flex justify-center py-4 text-primary">
          <LoadingSpinner size={24} />
        </div>
      )}

      {!hasNextPage && posts.length > 0 && (
        <p className="text-center text-muted text-sm py-4">No more posts</p>
      )}
    </div>
  )
}
